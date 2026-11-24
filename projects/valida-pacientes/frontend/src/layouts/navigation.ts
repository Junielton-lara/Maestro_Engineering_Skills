import { ClipboardList, LayoutDashboard, type LucideIcon } from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

export const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    match: (pathname) => pathname === '/' || pathname.startsWith('/dashboard'),
  },
  {
    id: 'patients',
    label: 'Pacientes',
    to: '/pacientes',
    icon: ClipboardList,
    match: (pathname) => pathname.startsWith('/pacientes'),
  },
];

export function isNavActive(item: NavItem, pathname: string) {
  return item.match ? item.match(pathname) : pathname === item.to || pathname.startsWith(`${item.to}/`);
}
