import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '../components/ui';
import { AuthProvider, useAuth } from '../features/auth/auth-context';
import { LoginPage } from '../features/auth/LoginPage';
import { PatientDetailPage } from '../features/patients/PatientDetailPage';
import { PatientFormPage } from '../features/patients/PatientFormPage';
import { PatientsPage } from '../features/patients/PatientsPage';
import { AppShell } from '../layouts/AppShell';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  if (!ready) return <LoadingState label="Carregando sessão…" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <Navigate to="/pacientes" replace />;
  return children;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Navigate to="/pacientes" replace />} />
              <Route path="/pacientes" element={<PatientsPage />} />
              <Route path="/pacientes/novo" element={<RequireAdmin><PatientFormPage /></RequireAdmin>} />
              <Route path="/pacientes/:id" element={<PatientDetailPage />} />
              <Route path="/pacientes/:id/editar" element={<RequireAdmin><PatientFormPage /></RequireAdmin>} />
            </Route>
            <Route path="*" element={<Navigate to="/pacientes" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
