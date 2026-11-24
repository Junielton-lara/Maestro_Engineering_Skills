import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Roles(Role.ADMIN)
  listDoctors() {
    return this.prisma.user.findMany({
      where: { role: 'MEDICO', active: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
  }
}
