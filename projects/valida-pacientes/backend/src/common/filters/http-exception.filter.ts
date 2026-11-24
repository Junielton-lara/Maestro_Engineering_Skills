import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

type ErrorBody = { code: string; message: string; details: { field: string; message: string }[] };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request & { id?: string; user?: { id?: string } }>();
    const requestId = request.id;

    const { status, body } = this.toBody(exception);
    if (status >= 500) {
      const name = exception instanceof Error ? exception.name : 'Error';
      this.logger.error(
        JSON.stringify({
          msg: 'request failed',
          requestId,
          method: request.method,
          path: request.originalUrl,
          status,
          code: body.code,
          userId: request.user?.id,
          errorName: name,
        }),
      );
    }

    response.status(status).json(body);
  }

  private toBody(exception: unknown): { status: number; body: ErrorBody } {
    if (exception instanceof Prisma.PrismaClientKnownRequestError && exception.code === 'P2002') {
      return {
        status: HttpStatus.CONFLICT,
        body: { code: 'CONFLICT', message: 'Registro duplicado.', details: [] },
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      if (typeof raw === 'object' && raw && 'code' in raw) {
        const record = raw as ErrorBody;
        return {
          status,
          body: {
            code: String(record.code),
            message: String(record.message),
            details: Array.isArray(record.details) ? record.details : [],
          },
        };
      }
      const message =
        typeof raw === 'string'
          ? raw
          : Array.isArray((raw as { message?: unknown }).message)
            ? String((raw as { message: string[] }).message[0])
            : String((raw as { message?: string }).message ?? 'Não foi possível concluir.');
      const code = status === 404 ? 'NOT_FOUND' : status === 429 ? 'RATE_LIMITED' : 'REQUEST_FAILED';
      return { status, body: { code, message, details: [] } };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { code: 'INTERNAL_ERROR', message: 'Erro interno. Tente de novo.', details: [] },
    };
  }
}
