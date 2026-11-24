import { Injectable } from '@nestjs/common';
import { DecisionKind, Patient, PatientStatus, Prisma, Role } from '@prisma/client';
import { AppException } from '../common/exceptions/app.exception';
import { AuthUser } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, DecidePatientDto, ListPatientsQuery, UpdatePatientDto } from './dto/patient.dto';

const doctorSelect = { id: true, name: true } as const;

type PatientWithDoctor = Patient & { assignedDoctor: { id: string; name: string } };
type DecisionRow = {
  id: string;
  decision: DecisionKind;
  reason: string | null;
  createdAt: Date;
  doctor: { id: string; name: string };
};

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthUser, query: ListPatientsQuery) {
    const where = this.listWhere(user, query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.patient.count({ where }),
      this.prisma.patient.findMany({
        where,
        include: { assignedDoctor: { select: doctorSelect } },
        orderBy: [{ fullName: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return {
      data: rows.map((row) => this.toPatient(row)),
      page,
      pageSize,
      total,
    };
  }

  async summary(user: AuthUser) {
    const rows = await this.prisma.patient.groupBy({
      by: ['status'],
      where: this.visibilityWhere(user),
      _count: { _all: true },
    });
    const counts = { pendente: 0, validado: 0, recusado: 0 };
    for (const row of rows) {
      if (row.status === 'PENDENTE') counts.pendente = row._count._all;
      if (row.status === 'VALIDADO') counts.validado = row._count._all;
      if (row.status === 'RECUSADO') counts.recusado = row._count._all;
    }
    return counts;
  }

  async getById(user: AuthUser, id: string) {
    const patient = await this.findVisible(user, id);
    return this.toDetail(patient);
  }

  async create(dto: CreatePatientDto) {
    await this.assertDoctor(dto.assignedDoctorId);
    const patient = await this.prisma.patient.create({
      data: {
        fullName: dto.fullName,
        birthDate: this.parseBirth(dto.birthDate),
        documentLast4: dto.documentLast4,
        operationalNote: dto.operationalNote ?? null,
        assignedDoctorId: dto.assignedDoctorId,
        status: 'PENDENTE',
      },
      include: { assignedDoctor: { select: doctorSelect }, decisions: decisionInclude },
    });
    return this.toDetail(patient);
  }

  async update(id: string, dto: UpdatePatientDto) {
    const current = await this.prisma.patient.findUnique({ where: { id } });
    if (!current) throw new AppException(404, 'PATIENT_NOT_FOUND', 'Paciente não encontrado.');
    if (
      dto.fullName === undefined &&
      dto.birthDate === undefined &&
      dto.documentLast4 === undefined &&
      dto.operationalNote === undefined &&
      dto.assignedDoctorId === undefined &&
      dto.active === undefined
    ) {
      throw new AppException(400, 'VALIDATION_FAILED', 'Dados inválidos.', [
        { field: 'body', message: 'Informe ao menos um campo.' },
      ]);
    }

    const data: Prisma.PatientUpdateInput = {};
    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.birthDate !== undefined) data.birthDate = this.parseBirth(dto.birthDate);
    if (dto.documentLast4 !== undefined) data.documentLast4 = dto.documentLast4;
    if (dto.operationalNote !== undefined) data.operationalNote = dto.operationalNote;
    if (dto.active !== undefined) data.active = dto.active;
    if (dto.assignedDoctorId !== undefined) {
      await this.assertDoctor(dto.assignedDoctorId);
      data.assignedDoctor = { connect: { id: dto.assignedDoctorId } };
    }

    const identityChanged =
      (dto.fullName !== undefined && dto.fullName !== current.fullName) ||
      (dto.birthDate !== undefined && dto.birthDate !== this.formatBirth(current.birthDate)) ||
      (dto.documentLast4 !== undefined && dto.documentLast4 !== current.documentLast4.trim()) ||
      (dto.assignedDoctorId !== undefined && dto.assignedDoctorId !== current.assignedDoctorId);
    if (identityChanged) data.status = 'PENDENTE';

    const patient = await this.prisma.patient.update({
      where: { id },
      data,
      include: { assignedDoctor: { select: doctorSelect }, decisions: decisionInclude },
    });
    return this.toDetail(patient);
  }

  async decide(user: AuthUser, id: string, dto: DecidePatientDto) {
    if (user.role !== 'MEDICO') {
      throw new AppException(403, 'PATIENT_DECISION_FORBIDDEN', 'Só o médico responsável valida o paciente.');
    }
    const reason = dto.reason?.trim() || null;
    if (dto.decision === 'RECUSADO' && (!reason || reason.length < 10)) {
      throw new AppException(400, 'VALIDATION_FAILED', 'Dados inválidos.', [
        { field: 'reason', message: 'O motivo precisa ter pelo menos 10 caracteres.' },
      ]);
    }

    const patient = await this.prisma.patient.findFirst({
      where: { id, assignedDoctorId: user.id },
    });
    if (!patient) throw new AppException(404, 'PATIENT_NOT_FOUND', 'Paciente não encontrado.');
    if (!patient.active) throw new AppException(409, 'PATIENT_INACTIVE', 'Paciente inativo não pode ser validado.');

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.patientDecision.create({
        data: {
          patientId: id,
          doctorId: user.id,
          decision: dto.decision,
          reason,
        },
      });
      return tx.patient.update({
        where: { id },
        data: { status: dto.decision },
        include: { assignedDoctor: { select: doctorSelect }, decisions: decisionInclude },
      });
    });
    return this.toDetail(updated);
  }

  private visibilityWhere(user: AuthUser): Prisma.PatientWhereInput {
    if (user.role === Role.MEDICO) return { assignedDoctorId: user.id, active: true };
    return {};
  }

  private listWhere(user: AuthUser, query: ListPatientsQuery): Prisma.PatientWhereInput {
    return {
      ...this.visibilityWhere(user),
      ...(query.status ? { status: query.status } : {}),
      ...(query.q ? { fullName: { contains: query.q, mode: 'insensitive' } } : {}),
    };
  }

  private async findVisible(user: AuthUser, id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, ...this.visibilityWhere(user) },
      include: { assignedDoctor: { select: doctorSelect }, decisions: decisionInclude },
    });
    if (!patient) throw new AppException(404, 'PATIENT_NOT_FOUND', 'Paciente não encontrado.');
    return patient;
  }

  private async assertDoctor(id: string) {
    const doctor = await this.prisma.user.findFirst({
      where: { id, role: 'MEDICO', active: true },
    });
    if (!doctor) {
      throw new AppException(400, 'VALIDATION_FAILED', 'Dados inválidos.', [
        { field: 'assignedDoctorId', message: 'Escolha um médico ativo.' },
      ]);
    }
  }

  private parseBirth(iso: string): Date {
    const date = new Date(`${iso}T00:00:00.000Z`);
    const today = new Date().toISOString().slice(0, 10);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso || iso > today || iso < '1900-01-01') {
      throw new AppException(400, 'VALIDATION_FAILED', 'Dados inválidos.', [
        { field: 'birthDate', message: 'Data de nascimento fora do intervalo permitido.' },
      ]);
    }
    return date;
  }

  private formatBirth(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private toPatient(patient: PatientWithDoctor) {
    return {
      id: patient.id,
      fullName: patient.fullName,
      birthDate: this.formatBirth(patient.birthDate),
      documentLast4: patient.documentLast4.trim(),
      operationalNote: patient.operationalNote,
      status: patient.status as PatientStatus,
      active: patient.active,
      assignedDoctor: patient.assignedDoctor,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }

  private toDetail(patient: PatientWithDoctor & { decisions: DecisionRow[] }) {
    return {
      ...this.toPatient(patient),
      decisions: patient.decisions.map((decision) => ({
        id: decision.id,
        decision: decision.decision,
        reason: decision.reason,
        createdAt: decision.createdAt.toISOString(),
        doctor: decision.doctor,
      })),
    };
  }
}

const decisionInclude = {
  orderBy: { createdAt: 'desc' as const },
  include: { doctor: { select: doctorSelect } },
};
