import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { hashPassword } from '../src/auth/password';
import { configureApp } from '../src/configure-app';
import { PrismaService } from '../src/prisma/prisma.service';

const PASSWORD = 'SenhaDev#2026';

describe('ValidaPacientes API', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.patientDecision.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  async function createUser(role: 'ADMIN' | 'MEDICO', email: string, name: string) {
    return prisma.user.create({
      data: { name, email, role, passwordHash: await hashPassword(PASSWORD) },
    });
  }

  function http() {
    return request(app.getHttpServer());
  }

  async function tokenFor(email: string) {
    const res = await http().post('/api/v1/auth/login').send({ email, password: PASSWORD });
    expect(res.status).toBe(200);
    return res.body.accessToken as string;
  }

  it('CA-01 logs the doctor in without returning the password hash', async () => {
    await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    const res = await http().post('/api/v1/auth/login').send({ email: 'ana@valida.local', password: PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ email: 'ana@valida.local', role: 'MEDICO', name: 'Ana Mendes' });
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(JSON.stringify(res.body)).not.toContain('password');
    expect(res.headers['set-cookie']?.[0]).toContain('HttpOnly');
  });

  it('CA-02 uses the same message for a wrong password and an inactive user', async () => {
    await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    const wrong = await http().post('/api/v1/auth/login').send({ email: 'ana@valida.local', password: 'senha-errada-1' });
    const inactiveUser = await createUser('MEDICO', 'inativo@valida.local', 'Inativo');
    await prisma.user.update({ where: { id: inactiveUser.id }, data: { active: false } });
    const inactive = await http().post('/api/v1/auth/login').send({
      email: 'inativo@valida.local',
      password: PASSWORD,
    });
    expect(wrong.status).toBe(401);
    expect(inactive.status).toBe(401);
    expect(wrong.body).toEqual(inactive.body);
    expect(wrong.body.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('CA-03 hides another doctor patient from the list and the detail', async () => {
    const ana = await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    const bruno = await createUser('MEDICO', 'bruno@valida.local', 'Bruno Nogueira');
    const own = await prisma.patient.create({
      data: {
        fullName: 'Helena Costa',
        birthDate: new Date('1984-03-12T00:00:00.000Z'),
        documentLast4: '1842',
        assignedDoctorId: ana.id,
      },
    });
    const other = await prisma.patient.create({
      data: {
        fullName: 'Lívia Prado',
        birthDate: new Date('1991-05-30T00:00:00.000Z'),
        documentLast4: '7733',
        assignedDoctorId: bruno.id,
      },
    });
    const access = await tokenFor('ana@valida.local');
    const list = await http().get('/api/v1/patients').set('Authorization', `Bearer ${access}`);
    expect(list.status).toBe(200);
    expect(list.body.data.map((item: { id: string }) => item.id)).toEqual([own.id]);
    const hidden = await http().get(`/api/v1/patients/${other.id}`).set('Authorization', `Bearer ${access}`);
    expect(hidden.status).toBe(404);
    expect(hidden.body.code).toBe('PATIENT_NOT_FOUND');
  });

  it('CA-04 records a validation and CA-05 rejects a refusal without a reason', async () => {
    const ana = await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    const patient = await prisma.patient.create({
      data: {
        fullName: 'Helena Costa',
        birthDate: new Date('1984-03-12T00:00:00.000Z'),
        documentLast4: '1842',
        assignedDoctorId: ana.id,
      },
    });
    const access = await tokenFor('ana@valida.local');
    const missing = await http()
      .post(`/api/v1/patients/${patient.id}/decisions`)
      .set('Authorization', `Bearer ${access}`)
      .send({ decision: 'RECUSADO' });
    expect(missing.status).toBe(400);
    expect(await prisma.patientDecision.count()).toBe(0);

    const ok = await http()
      .post(`/api/v1/patients/${patient.id}/decisions`)
      .set('Authorization', `Bearer ${access}`)
      .send({ decision: 'VALIDADO', reason: 'Documento conferido.' });
    expect(ok.status).toBe(201);
    expect(ok.body.status).toBe('VALIDADO');
    expect(ok.body.decisions).toHaveLength(1);
    expect(ok.body.decisions[0].doctor.name).toBe('Ana Mendes');
  });

  it('CA-06 forbids the administrator from validating and CA-09 blocks anonymous access', async () => {
    const ana = await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    await createUser('ADMIN', 'admin@valida.local', 'Olívia Admin');
    const patient = await prisma.patient.create({
      data: {
        fullName: 'Helena Costa',
        birthDate: new Date('1984-03-12T00:00:00.000Z'),
        documentLast4: '1842',
        assignedDoctorId: ana.id,
      },
    });
    const anonymous = await http().get('/api/v1/patients');
    expect(anonymous.status).toBe(401);
    const admin = await tokenFor('admin@valida.local');
    const denied = await http()
      .post(`/api/v1/patients/${patient.id}/decisions`)
      .set('Authorization', `Bearer ${admin}`)
      .send({ decision: 'VALIDADO' });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe('FORBIDDEN');
  });

  it('CA-07 resets status when the name changes and keeps the history', async () => {
    const ana = await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    await createUser('ADMIN', 'admin@valida.local', 'Olívia Admin');
    const patient = await prisma.patient.create({
      data: {
        fullName: 'Helena Costa',
        birthDate: new Date('1984-03-12T00:00:00.000Z'),
        documentLast4: '1842',
        assignedDoctorId: ana.id,
        status: 'VALIDADO',
      },
    });
    await prisma.patientDecision.create({
      data: { patientId: patient.id, doctorId: ana.id, decision: 'VALIDADO', reason: 'Conferido.' },
    });
    const admin = await tokenFor('admin@valida.local');
    const updated = await http()
      .patch(`/api/v1/patients/${patient.id}`)
      .set('Authorization', `Bearer ${admin}`)
      .send({ fullName: 'Helena Costa Silva' });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe('PENDENTE');
    expect(updated.body.decisions).toHaveLength(1);
  });

  it('creates a patient only for an active doctor', async () => {
    const ana = await createUser('MEDICO', 'ana@valida.local', 'Ana Mendes');
    await createUser('ADMIN', 'admin@valida.local', 'Olívia Admin');
    const admin = await tokenFor('admin@valida.local');
    const created = await http().post('/api/v1/patients').set('Authorization', `Bearer ${admin}`).send({
      fullName: 'Davi Nunes',
      birthDate: '2015-01-09',
      documentLast4: '2208',
      assignedDoctorId: ana.id,
      operationalNote: 'Cadastro fictício.',
    });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe('PENDENTE');
    expect(created.body.documentLast4).toBe('2208');
  });
});
