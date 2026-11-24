# Template — estrutura inicial de back-end

```text
backend/   (ou apps/api/)
  src/
    <module>/
      *.module.ts | router
      *.controller.ts | handlers
      *.service.ts
      dto/ | schemas/
    common/          # filters, guards, tenant
    main.ts
  prisma/ ou migrations/
  test/
  package.json
```

## Checklist

- [ ] Validation na borda
- [ ] Auth guards em mutações
- [ ] Erros padronizados
- [ ] Health endpoint
- [ ] `.env.example` sem segredos
- [ ] Migration tool definida
