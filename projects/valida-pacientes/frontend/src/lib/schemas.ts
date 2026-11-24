import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
    .max(128, 'A senha pode ter no máximo 128 caracteres.'),
});

export const patientSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe o nome completo.').max(120, 'O nome pode ter no máximo 120 caracteres.'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data de nascimento.'),
  documentLast4: z.string().regex(/^\d{4}$/, 'Informe os 4 últimos dígitos do documento.'),
  operationalNote: z.string().max(280, 'A nota pode ter no máximo 280 caracteres.'),
  assignedDoctorId: z.string().min(1, 'Escolha o médico responsável.'),
});

export const decisionSchema = z
  .object({
    decision: z.enum(['VALIDADO', 'RECUSADO']),
    reason: z.string().max(280, 'O motivo pode ter no máximo 280 caracteres.'),
  })
  .superRefine((value, ctx) => {
    const reason = value.reason.trim();
    if (value.decision === 'RECUSADO' && reason.length < 10) {
      ctx.addIssue({
        code: 'custom',
        path: ['reason'],
        message: 'A recusa precisa de um motivo com pelo menos 10 caracteres.',
      });
    }
    if (value.decision === 'VALIDADO' && reason.length > 0 && reason.length < 10) {
      ctx.addIssue({
        code: 'custom',
        path: ['reason'],
        message: 'A observação precisa ter pelo menos 10 caracteres, ou ficar vazia.',
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
