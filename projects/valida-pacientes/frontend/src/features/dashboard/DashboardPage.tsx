import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, CircleAlert, ClipboardList, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, ErrorState, LoadingState } from '../../components/ui';
import { patientSummary } from '../../services/api';
import { useAuth } from '../auth/auth-context';

export function DashboardPage() {
  const { user } = useAuth();
  const summary = useQuery({ queryKey: ['patients', 'summary'], queryFn: patientSummary });

  if (summary.isLoading) return <LoadingState label="Carregando dashboard…" />;
  if (summary.isError || !summary.data) {
    return <ErrorState message="Não foi possível carregar o resumo." onRetry={() => void summary.refetch()} />;
  }

  const cards = [
    {
      label: 'Pendentes',
      value: summary.data.pendente,
      to: '/pacientes?status=PENDENTE',
      icon: Clock3,
      tone: 'text-warning',
    },
    {
      label: 'Validados',
      value: summary.data.validado,
      to: '/pacientes?status=VALIDADO',
      icon: CheckCircle2,
      tone: 'text-success',
    },
    {
      label: 'Recusados',
      value: summary.data.recusado,
      to: '/pacientes?status=RECUSADO',
      icon: CircleAlert,
      tone: 'text-danger',
    },
    {
      label: 'Total na lista',
      value: summary.data.pendente + summary.data.validado + summary.data.recusado,
      to: '/pacientes',
      icon: ClipboardList,
      tone: 'text-secondary',
    },
  ];

  return (
    <section>
      <PageHeader
        title={`Olá, ${user?.name.split(' ')[0] ?? 'equipe'}`}
        description={
          user?.role === 'MEDICO'
            ? 'Resumo da sua lista de pacientes. Valide os pendentes antes do turno.'
            : 'Visão geral da lista operacional. Cadastre pacientes e acompanhe as validações.'
        }
        actions={
          <Link
            to="/pacientes"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary px-4 text-sm font-semibold text-secondary-foreground"
          >
            Abrir pacientes
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.to} className="block transition hover:-translate-y-0.5">
              <Card className="h-full p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{card.value}</p>
                  </div>
                  <span className={`rounded-xl bg-background p-2.5 ${card.tone}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
