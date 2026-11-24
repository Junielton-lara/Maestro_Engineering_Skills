import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useId,
  useRef,
} from 'react';
import { cn } from '../lib/cn';
import { PatientStatus } from '../services/api';

const buttonStyles = {
  primary: 'bg-secondary text-secondary-foreground hover:bg-[#0c6aab]',
  ghost: 'border border-border bg-card text-foreground hover:bg-background',
  danger: 'bg-danger text-white hover:opacity-95',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonStyles }) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        buttonStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function TextField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold text-foreground" htmlFor={id}>
      {label}
      <input
        id={id}
        className="mt-1 w-full min-h-11 rounded-xl border border-border bg-card px-3 text-base font-normal text-foreground"
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="mt-1 block font-normal text-danger">{error}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <textarea
        id={id}
        className="mt-1 min-h-28 w-full rounded-xl border border-border bg-card px-3 py-2 text-base font-normal"
        {...props}
      />
      {error ? <span className="mt-1 block font-normal text-danger">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; children: ReactNode }) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <select id={id} className="mt-1 w-full min-h-11 rounded-xl border border-border bg-card px-3 text-base font-normal" {...props}>
        {children}
      </select>
      {error ? <span className="mt-1 block font-normal text-danger">{error}</span> : null}
    </label>
  );
}

const badgeStyles: Record<PatientStatus, string> = {
  PENDENTE: 'bg-amber-50 text-warning',
  VALIDADO: 'bg-emerald-50 text-success',
  RECUSADO: 'bg-red-50 text-danger',
};

export const STATUS_LABEL: Record<PatientStatus, string> = {
  PENDENTE: 'Pendente',
  VALIDADO: 'Validado',
  RECUSADO: 'Recusado',
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', badgeStyles[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-2xl border border-border/70 bg-card p-4 shadow-card', className)}>{children}</div>;
}

export function Alert({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">{children}</p>;
}

export function LoadingState({ label }: { label: string }) {
  return (
    <p role="status" className="rounded-2xl border border-border bg-card px-4 py-10 text-center text-muted shadow-card">
      {label}
    </p>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center shadow-card">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center">
      <p className="text-danger">{message}</p>
      <Button className="mt-4" variant="ghost" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  );
}

export function Dialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('textarea, input, button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-primary/45 p-4 sm:items-center">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-5 shadow-elevated"
      >
        <h2 id={titleId} className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
