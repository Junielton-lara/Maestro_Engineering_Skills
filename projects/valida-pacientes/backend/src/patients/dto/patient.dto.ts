import { DecisionKind, PatientStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ListPatientsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize = 20;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(80, { message: 'A busca pode ter no máximo 80 caracteres.' })
  q?: string;

  @IsOptional()
  @IsEnum(PatientStatus, { message: 'Status inválido.' })
  status?: PatientStatus;
}

export class CreatePatientDto {
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @MinLength(3, { message: 'Informe o nome completo.' })
  @MaxLength(120, { message: 'O nome pode ter no máximo 120 caracteres.' })
  fullName!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Informe a data de nascimento.' })
  @IsDateString({}, { message: 'Informe a data de nascimento.' })
  birthDate!: string;

  @Matches(/^\d{4}$/, { message: 'Informe os 4 últimos dígitos do documento.' })
  documentLast4!: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const text = String(value).trim();
    return text.length ? text : null;
  })
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(280, { message: 'A nota pode ter no máximo 280 caracteres.' })
  operationalNote?: string | null;

  @IsString({ message: 'Escolha o médico responsável.' })
  @MinLength(1, { message: 'Escolha o médico responsável.' })
  assignedDoctorId!: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @MinLength(3, { message: 'Informe o nome completo.' })
  @MaxLength(120, { message: 'O nome pode ter no máximo 120 caracteres.' })
  fullName?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Informe a data de nascimento.' })
  birthDate?: string;

  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'Informe os 4 últimos dígitos do documento.' })
  documentLast4?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text.length ? text : null;
  })
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(280, { message: 'A nota pode ter no máximo 280 caracteres.' })
  operationalNote?: string | null;

  @IsOptional()
  @IsString()
  assignedDoctorId?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class DecidePatientDto {
  @IsIn(['VALIDADO', 'RECUSADO'], { message: 'Decisão inválida.' })
  decision!: DecisionKind;

  @ValidateIf((dto: DecidePatientDto) => dto.decision === 'RECUSADO' || Boolean(dto.reason?.trim()))
  @IsString({ message: 'O motivo precisa ter pelo menos 10 caracteres.' })
  @MinLength(10, { message: 'O motivo precisa ter pelo menos 10 caracteres.' })
  @MaxLength(280, { message: 'O motivo pode ter no máximo 280 caracteres.' })
  reason?: string;
}
