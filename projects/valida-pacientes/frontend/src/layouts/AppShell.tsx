import { Outlet } from 'react-router-dom';
import { MobileBottomNav } from './mobile/MobileBottomNav';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Ir para o conteúdo
      </a>
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <TopBar />
        <main
          id="conteudo"
          className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 animate-fade-in px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 sm:p-6 lg:p-8 lg:pb-8"
        >
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
