import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, useEffect, useId, useRef } from 'react';
import { PatientStatus } from '../services/api';

const buttonStyles = {
  primary: 'bg-primary text-white hover:bg-primary-strong',
  ghost: 'border border-line bg-surface text-ink hover:bg-mist',
  danger: 'bg-danger text-white hover:opacity-95',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonStyles }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
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
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <input
        id={id}
        className="mt-1 w-full min-h-11 rounded-lg border border-line bg-surface px-3 text-base font-normal"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-1 block font-normal text-danger">
          {error}
        </span>
      ) : null}
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
        className="mt-1 min-h-28 w-full rounded-lg border border-line bg-surface px-3 py-2 text-base font-normal"
        aria-invalid={Boolean(error)}
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
      <select id={id} className="mt-1 w-full min-h-11 rounded-lg border border-line bg-surface px-3 text-base font-normal" {...props}>
        {children}
      </select>
      {error ? <span className="mt-1 block font-normal text-danger">{error}</span> : null}
    </label>
  );
}

const badgeStyles: Record<PatientStatus, string> = {
  PENDENTE: 'bg-amber-50 text-warn',
  VALIDADO: 'bg-emerald-50 text-ok',
  RECUSADO: 'bg-red-50 text-danger',
};

export const STATUS_LABEL: Record<PatientStatus, string> = {
  PENDENTE: 'Pendente',
  VALIDADO: 'Validado',
  RECUSADO: 'Recusado',
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
      {children}
    </p>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <p role="status" className="rounded-xl border border-line bg-surface px-4 py-8 text-center text-muted">
      {label}
    </p>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface px-4 py-10 text-center">
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-muted">{body}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
      <p className="text-danger">{message}</p>
      <Button className="mt-4" variant="ghost" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  );
}

export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = node?.querySelector<HTMLElement>('textarea, input, button');
    focusable?.focus();
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
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-2xl bg-surface p-5 shadow-card"
      >
        <h2 id={titleId} className="font-display text-2xl">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
