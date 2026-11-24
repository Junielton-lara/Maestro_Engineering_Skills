import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Alert, Button, LoadingState, TextField } from '../../components/ui';
import { LoginInput, loginSchema } from '../../lib/schemas';
import { ApiRequestError } from '../../services/api';
import { useAuth } from './auth-context';

export function LoginPage() {
  const { user, ready, login } = useAuth();
  const [formError, setFormError] = useState('');
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  if (!ready) return <LoadingState label="Carregando sessão…" />;
  if (user) return <Navigate to="/pacientes" replace />;

  return (
    <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-8 px-4 py-10 md:grid-cols-2">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">ValidaPacientes</p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Confira a lista antes do turno.</h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          O médico entra, vê só os pacientes atribuídos a ele e registra quem foi validado ou recusado. Sem prontuário.
        </p>
      </section>
      <form
        className="space-y-4 rounded-2xl bg-surface p-6 shadow-card"
        onSubmit={form.handleSubmit(async (values) => {
          setFormError('');
          try {
            await login(values.email, values.password);
          } catch (error) {
            setFormError(error instanceof ApiRequestError ? error.message : 'Não foi possível entrar.');
          }
        })}
        noValidate
      >
        <h2 className="font-display text-3xl">Entrar</h2>
        {formError ? <Alert>{formError}</Alert> : null}
        <TextField
          label="E-mail"
          type="email"
          autoComplete="username"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
        <div className="rounded-lg bg-mist px-3 py-3 text-sm text-muted">
          <p className="font-semibold text-ink">Acesso fictício de demonstração</p>
          <p className="mt-1">Médica: ana.mendes@valida.local</p>
          <p>Admin: admin@valida.local</p>
          <p>Senha: SenhaDev#2026</p>
        </div>
      </form>
    </main>
  );
}
