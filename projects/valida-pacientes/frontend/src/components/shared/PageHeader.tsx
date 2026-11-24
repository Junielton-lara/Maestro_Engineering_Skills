import { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  actions,
  leading,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 animate-slide-up sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        {leading ? <div className="mb-1">{leading}</div> : null}
        <h1 className="text-[1.375rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
          {title}
        </h1>
        {description ? <p className="text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-col gap-2.5 min-[420px]:flex-row sm:w-auto sm:shrink-0 [&>a]:w-full min-[420px]:[&>a]:w-auto [&>button]:w-full min-[420px]:[&>button]:w-auto">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
