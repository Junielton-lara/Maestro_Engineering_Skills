import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Alert, Button, Card, Dialog, ErrorState, LoadingState, StatusBadge, TextAreaField } from '../../components/ui';
import { ageFrom, formatDate, formatDateTime } from '../../lib/format';
import { decisionSchema } from '../../lib/schemas';
import { ApiRequestError, decidePatient, getPatient } from '../../services/api';
import { useAuth } from '../auth/auth-context';

export function PatientDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<'VALIDADO' | 'RECUSADO' | null>(null);
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const patient = useQuery({ queryKey: ['patient', id], queryFn: () => getPatient(id) });
  const mutation = useMutation({
    mutationFn: (body: { decision: 'VALIDADO' | 'RECUSADO'; reason?: string }) => decidePatient(id, body),
    onSuccess: async () => {
      setDecision(null);
      setReason('');
      await queryClient.invalidateQueries({ queryKey: ['patient', id] });
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  if (patient.isLoading) return <LoadingState label="Carregando paciente…" />;
  if (patient.isError || !patient.data) {
    const message = patient.error instanceof ApiRequestError ? patient.error.message : 'Não foi possível abrir o paciente.';
    return <ErrorState message={message} onRetry={() => void patient.refetch()} />;
  }

  const current = patient.data;
  const age = ageFrom(current.birthDate);
  const canDecide = user?.role === 'MEDICO' && current.active;

  async function submit() {
    if (!decision) return;
    const parsed = decisionSchema.safeParse({ decision, reason });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Revise o motivo.');
      return;
    }
    setFormError('');
    try {
      await mutation.mutateAsync({
        decision,
        reason: parsed.data.reason.trim() || undefined,
      });
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Não foi possível registrar a decisão.');
    }
  }

  return (
    <article>
      <PageHeader
        leading={
          <Link to="/pacientes" className="text-sm font-semibold text-secondary">
            Voltar à lista
          </Link>
        }
        title={current.fullName}
        description={`Nascimento ${formatDate(current.birthDate)}${age !== null ? ` · ${age} anos` : ''}`}
        actions={<StatusBadge status={current.status} />}
      />

      <Card className="p-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Final do documento</dt>
            <dd className="text-lg font-semibold">{current.documentLast4}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Médico responsável</dt>
            <dd className="text-lg font-semibold">{current.assignedDoctor.name}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted">Nota operacional</dt>
            <dd>{current.operationalNote || 'Sem nota.'}</dd>
          </div>
        </dl>
      </Card>

      {canDecide ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => {
              setDecision('VALIDADO');
              setReason('');
              setFormError('');
            }}
          >
            Validar paciente
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setDecision('RECUSADO');
              setReason('');
              setFormError('');
            }}
          >
            Recusar paciente
          </Button>
        </div>
      ) : null}
      {user?.role === 'ADMIN' ? (
        <Link to={`/pacientes/${current.id}/editar`} className="mt-4 inline-flex min-h-11 items-center font-semibold text-secondary">
          Editar cadastro
        </Link>
      ) : null}

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">Histórico</h2>
        {current.decisions.length === 0 ? <p className="mt-2 text-muted">Nenhuma decisão registrada.</p> : null}
        <ol className="mt-3 space-y-3">
          {current.decisions.map((item) => (
            <li key={item.id}>
              <Card className="p-4">
                <p className="font-semibold">{item.decision === 'VALIDADO' ? 'Validado' : 'Recusado'} por {item.doctor.name}</p>
                <p className="text-sm text-muted">{formatDateTime(item.createdAt)}</p>
                {item.reason ? <p className="mt-2">{item.reason}</p> : null}
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {decision ? (
        <Dialog title={decision === 'VALIDADO' ? 'Validar paciente' : 'Recusar paciente'} onClose={() => setDecision(null)}>
          <p className="text-muted">
            {decision === 'VALIDADO'
              ? `Confirmar que ${current.fullName} está com o cadastro mínimo conferido?`
              : `Informe por que ${current.fullName} não foi aceito nesta lista.`}
          </p>
          <div className="mt-4 space-y-3">
            {formError ? <Alert>{formError}</Alert> : null}
            <TextAreaField
              label={decision === 'VALIDADO' ? 'Observação (opcional)' : 'Motivo da recusa'}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setDecision(null)}>
                Cancelar
              </Button>
              <Button onClick={() => void submit()} disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando…' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </article>
  );
}
