import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { User } from '@prisma/client';
import { AppException } from '../common/exceptions/app.exception';
import { AuthUser } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';
import { verifyPassword } from './password';

const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;
const INVALID = new AppException(401, 'AUTH_INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
const REFRESH_INVALID = new AppException(401, 'AUTH_REFRESH_INVALID', 'Sessão expirada. Entre de novo.');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get<string>('COOKIE_SECURE') === 'true',
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: REFRESH_MS,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const valid = user ? await verifyPassword(user.passwordHash, password) : false;
    if (!user?.active || !valid) throw INVALID;
    return this.issueSession(user);
  }

  async refresh(rawToken: string | undefined) {
    if (!rawToken) throw REFRESH_INVALID;
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!stored || !stored.user.active) throw REFRESH_INVALID;
    if (stored.revokedAt || stored.expiresAt.getTime() <= Date.now()) {
      if (stored.revokedAt) {
        await this.prisma.refreshToken.updateMany({
          where: { userId: stored.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      throw REFRESH_INVALID;
    }
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    return this.issueSession(stored.user);
  }

  async logout(rawToken: string | undefined) {
    if (!rawToken) return;
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueSession(user: User) {
    const refreshToken = randomBytes(32).toString('base64url');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_MS),
      },
    });
    return {
      accessToken: await this.signAccess(user),
      refreshToken,
      user: this.toPublic(user),
    };
  }

  private signAccess(user: User) {
    return this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { expiresIn: 60 * 15, issuer: 'valida-pacientes', audience: 'valida-pacientes-web' },
    );
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private toPublic(user: User): AuthUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
