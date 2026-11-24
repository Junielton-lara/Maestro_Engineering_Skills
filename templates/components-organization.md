# Template — organização de componentes

```text
components/
  ui/           # Button, Input, Modal, Card, Badge, Skeleton…
  mobile/       # BottomNav, BottomSheet, FormActionBar (se houver)
  page.tsx      # PageHeader, EmptyState, Field, FilterBar
  charts/       # opcional, lazy
```

## Regras

- Primitivo reutilizável → `ui/`
- Específico de domínio → `features/<domínio>/`
- Não criar `Button2` / `PrimaryButton` paralelo
- Variants por função (primary, outline, ghost, danger)
