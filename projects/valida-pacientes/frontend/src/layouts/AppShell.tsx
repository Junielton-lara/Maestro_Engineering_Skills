import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../features/auth/auth-context';

export function AppShell() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role === 'ADMIN' ? 'Administração' : 'Médico';

  return (
    <div className="min-h-screen">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-surface focus:px-3 focus:py-2">
        Ir para o conteúdo
      </a>
      <header className="border-b border-line bg-surface/90">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/pacientes" className="font-display text-2xl text-ink">
            ValidaPacientes
          </Link>
          <div className="flex items-center gap-3">
            <p className="text-sm">
              <span className="block font-semibold">{user?.name}</span>
              <span className="text-muted">{roleLabel}</span>
            </p>
            <Button variant="ghost" onClick={() => void logout()}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main id="conteudo" className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
