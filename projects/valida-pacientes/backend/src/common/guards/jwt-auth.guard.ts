import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: AuthUser }>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppException(401, 'AUTH_REQUIRED', 'Autenticação necessária.');
    }
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(header.slice(7), {
        issuer: 'valida-pacientes',
        audience: 'valida-pacientes-web',
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user?.active) {
        throw new Error('inactive');
      }
      request.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      return true;
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw new AppException(401, 'AUTH_REQUIRED', 'Autenticação necessária.');
    }
  }
}
