export type Role = 'ADMIN' | 'MEDICO';
export type PatientStatus = 'PENDENTE' | 'VALIDADO' | 'RECUSADO';

export type User = { id: string; name: string; email: string; role: Role };

export type Patient = {
  id: string;
  fullName: string;
  birthDate: string;
  documentLast4: string;
  operationalNote: string | null;
  status: PatientStatus;
  active: boolean;
  assignedDoctor: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};

export type Decision = {
  id: string;
  decision: 'VALIDADO' | 'RECUSADO';
  reason: string | null;
  createdAt: string;
  doctor: { id: string; name: string };
};

export type PatientDetail = Patient & { decisions: Decision[] };
export type FieldError = { field: string; message: string };

export class ApiRequestError extends Error {
  status: number;
  code: string;
  details: FieldError[];

  constructor(status: number, code: string, message: string, details: FieldError[] = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

type Options = RequestInit & { retry?: boolean };

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`/api/v1${path}`, { ...options, headers, credentials: 'include' });
  if (response.status === 401 && options.retry !== false && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshed = await refreshSession();
    if (refreshed) return request<T>(path, { ...options, retry: false });
    setAccessToken(null);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as { code?: string; message?: string; details?: FieldError[] }) : null;
  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      payload?.code ?? 'REQUEST_FAILED',
      payload?.message ?? 'Não foi possível concluir.',
      payload?.details ?? [],
    );
  }
  return payload as T;
}

export async function refreshSession() {
  try {
    const data = await request<{ accessToken: string; user: User }>('/auth/refresh', {
      method: 'POST',
      retry: false,
    });
    setAccessToken(data.accessToken);
    return data.user;
  } catch {
    setAccessToken(null);
    return null;
  }
}

export async function login(email: string, password: string) {
  const data = await request<{ accessToken: string; user: User }>('/auth/login', {
    method: 'POST',
    retry: false,
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logout() {
  try {
    await request<void>('/auth/logout', { method: 'POST', retry: false });
  } finally {
    setAccessToken(null);
  }
}

export function listPatients(params: { page: number; q?: string; status?: string }) {
  const query = new URLSearchParams({ page: String(params.page), pageSize: '20' });
  if (params.q) query.set('q', params.q);
  if (params.status) query.set('status', params.status);
  return request<{ data: Patient[]; page: number; pageSize: number; total: number }>(`/patients?${query}`);
}

export function patientSummary() {
  return request<{ pendente: number; validado: number; recusado: number }>('/patients/summary');
}

export function getPatient(id: string) {
  return request<PatientDetail>(`/patients/${id}`);
}

export function createPatient(body: {
  fullName: string;
  birthDate: string;
  documentLast4: string;
  operationalNote?: string;
  assignedDoctorId: string;
}) {
  return request<PatientDetail>('/patients', { method: 'POST', body: JSON.stringify(body) });
}

export function updatePatient(id: string, body: Record<string, unknown>) {
  return request<PatientDetail>(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function decidePatient(id: string, body: { decision: 'VALIDADO' | 'RECUSADO'; reason?: string }) {
  return request<PatientDetail>(`/patients/${id}/decisions`, { method: 'POST', body: JSON.stringify(body) });
}

export function listDoctors() {
  return request<{ id: string; name: string; email: string }[]>('/doctors');
}
