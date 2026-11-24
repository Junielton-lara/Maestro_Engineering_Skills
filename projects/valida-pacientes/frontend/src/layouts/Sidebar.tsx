import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/cn';
import { isNavActive, navItems } from './navigation';

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/10 bg-sidebar lg:flex">
      <div className="flex min-h-16 items-center border-b border-white/10 px-5">
        <Link to="/dashboard" className="text-lg font-semibold tracking-tight text-primary-foreground">
          ValidaPacientes
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item, pathname);
          return (
            <Link
              key={item.id}
              to={item.to}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                active
                  ? 'bg-sidebar-active text-white'
                  : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
