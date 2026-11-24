import { HttpException } from '@nestjs/common';

export type FieldError = { field: string; message: string };

export class AppException extends HttpException {
  constructor(status: number, code: string, message: string, details: FieldError[] = []) {
    super({ code, message, details }, status);
  }
}
