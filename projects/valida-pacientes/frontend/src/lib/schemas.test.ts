import { describe, expect, it } from 'vitest';
import { ageFrom, formatDate } from './format';
import { decisionSchema, loginSchema, patientSchema } from './schemas';

describe('form schemas', () => {
  it('accepts a doctor login and rejects a short password', () => {
    expect(loginSchema.safeParse({ email: 'ana.mendes@valida.local', password: 'SenhaDev#2026' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'ana.mendes@valida.local', password: 'curta' }).success).toBe(false);
  });

  it('requires a reason only when the patient is refused', () => {
    expect(decisionSchema.safeParse({ decision: 'VALIDADO', reason: '' }).success).toBe(true);
    const refused = decisionSchema.safeParse({ decision: 'RECUSADO', reason: 'curto' });
    expect(refused.success).toBe(false);
  });

  it('keeps the patient document to four digits', () => {
    const parsed = patientSchema.safeParse({
      fullName: 'Helena Costa',
      birthDate: '1984-03-12',
      documentLast4: '1842',
      operationalNote: '',
      assignedDoctorId: 'medico-1',
    });
    expect(parsed.success).toBe(true);
    expect(patientSchema.safeParse({
      fullName: 'Helena Costa',
      birthDate: '1984-03-12',
      documentLast4: '18421',
      operationalNote: '',
      assignedDoctorId: 'medico-1',
    }).success).toBe(false);
  });

  it('formats the birth date and age without shifting the calendar day', () => {
    expect(formatDate('1984-03-12')).toBe('12/03/1984');
    expect(ageFrom('1984-03-12', new Date('2026-11-24T12:00:00'))).toBe(42);
  });
});
