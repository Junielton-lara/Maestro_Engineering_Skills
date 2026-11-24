import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser, Roles } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthUser } from '../common/types';
import { CreatePatientDto, DecidePatientDto, ListPatientsQuery, UpdatePatientDto } from './dto/patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListPatientsQuery) {
    return this.patients.list(user, query);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthUser) {
    return this.patients.summary(user);
  }

  @Get(':id')
  getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.patients.getById(user, id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreatePatientDto) {
    return this.patients.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patients.update(id, dto);
  }

  @Post(':id/decisions')
  @Roles(Role.MEDICO)
  decide(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: DecidePatientDto) {
    return this.patients.decide(user, id, dto);
  }
}
