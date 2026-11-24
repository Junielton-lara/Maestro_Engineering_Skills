import { ValidationError } from 'class-validator';
import { FieldError } from './exceptions/app.exception';

export function flattenValidation(errors: ValidationError[], parent = ''): FieldError[] {
  const details: FieldError[] = [];
  for (const error of errors) {
    const field = parent ? `${parent}.${error.property}` : error.property;
    if (error.constraints) {
      const message = Object.values(error.constraints)[0];
      details.push({ field, message });
    }
    if (error.children?.length) {
      details.push(...flattenValidation(error.children, field));
    }
  }
  return details;
}
