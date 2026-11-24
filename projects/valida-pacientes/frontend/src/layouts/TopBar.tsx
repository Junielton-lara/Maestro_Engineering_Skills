import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../features/auth/auth-context';

export function TopBar() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role === 'ADMIN' ? 'Administração' : 'Médico';

  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-3 border-b border-border/60 bg-card/70 px-4 py-2 backdrop-blur-xl sm:px-6 lg:px-8">
      <Link
        to="/dashboard"
        className="rounded-lg text-base font-semibold tracking-tight text-foreground lg:hidden"
      >
        ValidaPacientes
      </Link>
      <div className="flex-1" />
      <div className="text-right text-sm">
        <p className="font-semibold text-foreground">{user?.name}</p>
        <p className="text-muted">{roleLabel}</p>
      </div>
      <Button variant="ghost" className="min-h-11 px-3" onClick={() => void logout()} aria-label="Sair">
        <LogOut className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </header>
  );
}
