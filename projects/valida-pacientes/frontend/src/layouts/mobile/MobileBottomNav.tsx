import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { isNavActive, navItems } from '../navigation';

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur lg:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item, pathname);
          return (
            <li key={item.id} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold',
                  active ? 'text-secondary' : 'text-muted',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
