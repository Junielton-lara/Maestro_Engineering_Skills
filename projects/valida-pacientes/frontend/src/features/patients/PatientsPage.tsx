import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button, Card, EmptyState, ErrorState, LoadingState, StatusBadge, STATUS_LABEL } from '../../components/ui';
import { cn } from '../../lib/cn';
import { ageFrom, formatDate } from '../../lib/format';
import { listPatients, patientSummary, PatientStatus } from '../../services/api';
import { useAuth } from '../auth/auth-context';

const FILTERS: { id: '' | PatientStatus; label: string; countKey?: 'pendente' | 'validado' | 'recusado' }[] = [
  { id: '', label: 'Todos' },
  { id: 'PENDENTE', label: 'Pendentes', countKey: 'pendente' },
  { id: 'VALIDADO', label: 'Validados', countKey: 'validado' },
  { id: 'RECUSADO', label: 'Recusados', countKey: 'recusado' },
];

export function PatientsPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1);
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);

  const summary = useQuery({ queryKey: ['patients', 'summary'], queryFn: patientSummary });
  const list = useQuery({
    queryKey: ['patients', { page, q, status }],
    queryFn: () => listPatients({ page, q, status }),
  });

  function replace(next: Record<string, string | null>) {
    const paramsNext = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (!value) paramsNext.delete(key);
      else paramsNext.set(key, value);
    }
    setParams(paramsNext);
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    replace({ q: draft.trim() || null, page: null });
  }

  const total = list.data?.total ?? 0;
  const pageSize = list.data?.pageSize ?? 20;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section>
      <PageHeader
        title="Pacientes"
        description={
          user?.role === 'MEDICO'
            ? 'Só aparecem pacientes ativos atribuídos a você. Valide um por um.'
            : 'Cadastre a lista e atribua o médico. A validação fica com ele.'
        }
        actions={
          user?.role === 'ADMIN' ? (
            <Link
              to="/pacientes/novo"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-secondary-foreground"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Novo paciente
            </Link>
          ) : null
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const selected = status === filter.id;
          const count = filter.countKey ? summary.data?.[filter.countKey] : undefined;
          return (
            <button
              key={filter.label}
              type="button"
              aria-pressed={selected}
              className={cn(
                'min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition',
                selected ? 'bg-secondary text-white' : 'bg-card text-foreground shadow-card',
              )}
              onClick={() => replace({ status: filter.id || null, page: null })}
            >
              {filter.label}
              {count !== undefined ? ` · ${count}` : ''}
            </button>
          );
        })}
      </div>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={onSearch}>
        <label className="block flex-1 text-sm font-semibold">
          Buscar por nome
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="mt-1 w-full min-h-11 rounded-xl border border-border bg-card px-3 font-normal"
          />
        </label>
        <Button type="submit" className="sm:self-end" variant="ghost">
          Buscar
        </Button>
      </form>

      <div className="mt-5 space-y-3">
        {list.isLoading ? <LoadingState label="Carregando lista…" /> : null}
        {list.isError ? (
          <ErrorState message="Não foi possível carregar a lista." onRetry={() => void list.refetch()} />
        ) : null}
        {list.data && list.data.data.length === 0 ? (
          <EmptyState
            title="Nenhum paciente nesta visão"
            body={q || status ? 'Limpe a busca ou o filtro para ver o restante da lista.' : 'Quando houver pacientes atribuídos, eles aparecem aqui.'}
          />
        ) : null}
        <ul className="space-y-3">
          {list.data?.data.map((patient) => {
            const age = ageFrom(patient.birthDate);
            return (
              <li key={patient.id}>
                <Card className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">{patient.fullName}</h2>
                      <p className="mt-1 text-sm text-muted">
                        Nascimento {formatDate(patient.birthDate)}
                        {age !== null ? ` · ${age} anos` : ''} · documento final {patient.documentLast4}
                      </p>
                      {user?.role === 'ADMIN' ? <p className="mt-1 text-sm text-muted">Médico: {patient.assignedDoctor.name}</p> : null}
                      {!patient.active ? <p className="mt-1 text-sm text-danger">Inativo</p> : null}
                    </div>
                    <StatusBadge status={patient.status} />
                  </div>
                  <Link to={`/pacientes/${patient.id}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-secondary">
                    Abrir {STATUS_LABEL[patient.status].toLowerCase()}
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      {list.data && pages > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" disabled={page <= 1} onClick={() => replace({ page: String(page - 1) })}>
            Anterior
          </Button>
          <p className="text-sm text-muted">
            Página {page} de {pages}
          </p>
          <Button variant="ghost" disabled={page >= pages} onClick={() => replace({ page: String(page + 1) })}>
            Próxima
          </Button>
        </div>
      ) : null}
    </section>
  );
}
