const { PrismaClient } = require('@prisma/client');
const { hash } = require('@node-rs/argon2');

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'SenhaDev#2026';

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD);
  await prisma.user.upsert({
    where: { email: 'admin@valida.local' },
    update: { name: 'Olívia Admin', role: 'ADMIN', active: true, passwordHash },
    create: { name: 'Olívia Admin', email: 'admin@valida.local', role: 'ADMIN', passwordHash },
  });
  const ana = await prisma.user.upsert({
    where: { email: 'ana.mendes@valida.local' },
    update: { name: 'Ana Mendes', role: 'MEDICO', active: true, passwordHash },
    create: { name: 'Ana Mendes', email: 'ana.mendes@valida.local', role: 'MEDICO', passwordHash },
  });
  const bruno = await prisma.user.upsert({
    where: { email: 'bruno.nogueira@valida.local' },
    update: { name: 'Bruno Nogueira', role: 'MEDICO', active: true, passwordHash },
    create: { name: 'Bruno Nogueira', email: 'bruno.nogueira@valida.local', role: 'MEDICO', passwordHash },
  });

  const existing = await prisma.patient.count();
  if (existing > 0) {
    console.log('Pacientes já existem; seed não recriou a lista.');
    return;
  }

  await prisma.patient.create({
    data: {
      fullName: 'Helena Costa (fictício)',
      birthDate: new Date('1984-03-12T00:00:00.000Z'),
      documentLast4: '1842',
      operationalNote: 'Cadastro fictício de demonstração.',
      assignedDoctorId: ana.id,
    },
  });
  const marcos = await prisma.patient.create({
    data: {
      fullName: 'Marcos Lima (fictício)',
      birthDate: new Date('1976-11-02T00:00:00.000Z'),
      documentLast4: '0901',
      operationalNote: 'Cadastro fictício de demonstração.',
      assignedDoctorId: ana.id,
      status: 'VALIDADO',
    },
  });
  await prisma.patientDecision.create({
    data: { patientId: marcos.id, doctorId: ana.id, decision: 'VALIDADO', reason: 'Dados conferidos na chegada.' },
  });
  const iris = await prisma.patient.create({
    data: {
      fullName: 'Íris Pacheco (fictício)',
      birthDate: new Date('1998-07-21T00:00:00.000Z'),
      documentLast4: '4410',
      operationalNote: 'Cadastro fictício de demonstração.',
      assignedDoctorId: ana.id,
      status: 'RECUSADO',
    },
  });
  await prisma.patientDecision.create({
    data: {
      patientId: iris.id,
      doctorId: ana.id,
      decision: 'RECUSADO',
      reason: 'Final do documento não confere com o documento apresentado.',
    },
  });
  await prisma.patient.create({
    data: {
      fullName: 'Davi Nunes (fictício)',
      birthDate: new Date('2015-01-09T00:00:00.000Z'),
      documentLast4: '2208',
      operationalNote: 'Cadastro fictício de demonstração.',
      assignedDoctorId: ana.id,
    },
  });
  await prisma.patient.create({
    data: {
      fullName: 'Lívia Prado (fictício)',
      birthDate: new Date('1991-05-30T00:00:00.000Z'),
      documentLast4: '7733',
      operationalNote: 'Cadastro fictício de demonstração. Lista do outro médico.',
      assignedDoctorId: bruno.id,
    },
  });

  console.log('Seed ok.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.name : 'seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
