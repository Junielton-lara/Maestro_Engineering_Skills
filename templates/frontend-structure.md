# Template — estrutura inicial de front-end

> Adaptar à stack. Princípios em `MAESTRO_ENGINEERING_STANDARDS.md`.

```text
frontend/   (ou apps/web/)
  src/
    app/           # providers, router
    layouts/       # shell, sidebar, topbar
    features/<x>/  # páginas por domínio
    components/ui/ # primitivos
    components/    # page blocks
    hooks/
    services/      # api client
    lib/ utils/ types/
  public/
  index.html
  package.json
```

## Checklist

- [ ] Alias `@/` (ou equivalente)
- [ ] Tokens CSS / theme
- [ ] Shell + rota protegida (se auth)
- [ ] Empty/loading/error pattern
- [ ] Mobile-first breakpoint documentado
