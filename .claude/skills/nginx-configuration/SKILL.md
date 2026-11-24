---
name: nginx-configuration
description: >-
  Configura Nginx como reverse proxy: TLS, upstream, gzip, security headers e limites sem derrubar
  tráfego. Use when criar vhost, proxy para Node/Docker, renovar cert ou corrigir 502/SSL. Do not use
  when o escopo for só CI ou variáveis de app (ci-cd / environment-configuration).
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Configuração Nginx

## Objetivo

Terminar TLS na borda, encaminhar tráfego de forma segura ao upstream da aplicação, com headers, compressão e limites alinhados ao projeto — sempre validando config antes de reload.

## Quando ativar

- Novo domínio ou subdomínio.
- App mudou de porta/socket/upstream.
- Erros 502/504, redirect loop, WebSocket.
- Hardening de headers e TLS.

## Quando NÃO ativar

- Lógica de autenticação na aplicação → `security-engineering`.
- Provisionar VPS do zero → `hostinger-deployment`.
- Métricas e alertas → `observability`.

## Contexto técnico necessário

- Caminho dos sites (`sites-available` / `conf.d`).
- Upstream real (IP:porta, unix socket, container).
- Certificados (Let’s Encrypt paths ou custom).
- Se há CDN na frente (Cloudflare) — headers e real IP.

## Regras obrigatórias

1. **`nginx -t`** obrigatório antes de `reload`.
2. **Backup** do arquivo `.conf` antes de editar.
3. **Não expor** upstream diretamente na internet se Nginx é a borda.
4. **TLS moderno**: preferir TLS 1.2+; cipher suite atualizada.
5. **Sem reload** destrutivo em incidente sem plano; preferir `reload` a `restart`.
6. **WebSocket**: `Upgrade` e `Connection` headers quando aplicável.

## Processo de execução

1. Ler config existente do mesmo domínio ou template do projeto.
2. Definir `server` HTTP (redirect 301) e `server` HTTPS.
3. `location /` → `proxy_pass` com timeouts adequados.
4. Incluir headers de proxy e segurança (abaixo).
5. `client_max_body_size` conforme upload do app.
6. Testar localmente `curl -Ik https://host` e rota API.
7. `nginx -t && systemctl reload nginx`.

### Bloco proxy típico (Node/upstream HTTP)

```nginx
proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_connect_timeout 60s;
proxy_read_timeout 60s;
```

### Security headers (ajustar CSP ao app)

- `Strict-Transport-Security` (só com HTTPS estável)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` ou `SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- CSP: começar permissiva em legado; apertar com testes

### Gzip

- `gzip on;` para `text/css`, `application/json`, `application/javascript`
- Não comprimir imagens já comprimidas

## Boas práticas

- **upstream {}** com health implícito (fail_timeout) para múltiplas instâncias.
- **rate limit** em login (`limit_req_zone`) coordenando com app.
- **logs** separados por site; formato inclui `$request_time`.
- **Certbot** webroot ou nginx plugin; timer de renovação ativo.
- **Real IP** do CDN com `set_real_ip_from` quando necessário.

## Erros comuns

- `proxy_pass http://127.0.0.1:3000/` vs sem barra — URI cortada.
- Esquecer `proxy_set_header Host` → app gera URLs erradas.
- HSTS antes de HTTPS funcionar — lockout temporário.
- CSP quebrando CDN de assets.
- Buffer pequeno em respostas grandes (`proxy_buffer_size`).

## Exemplos práticos

**API + SPA:** `/api` → backend; `/` → arquivos estáticos ou outro upstream.

**Let’s Encrypt:** `certbot --nginx -d app.example.com` após DNS apontar.

**502:** upstream down — checar processo; `error_log` nginx.

## Critérios de qualidade

- `nginx -t` limpo; reload sem drop perceptível.
- A+ ou equivalente em SSL labs (objetivo comum).
- Headers de segurança sem quebrar app.
- Latência e timeouts coerentes com SLAs.

## Checklist de validação

- [ ] HTTP→HTTPS redirect
- [ ] Cert válido e renovação agendada
- [ ] Upstream correto e health OK
- [ ] Headers proxy + segurança
- [ ] Upload limit e gzip
- [ ] WebSocket testado se usado
- [ ] Backup da config salvo

## Skills relacionadas

- `hostinger-deployment` — deploy na VPS
- `docker-management` — upstream para containers
- `security-engineering` — CSP e superfície
- `observability` — access log e métricas
- `devops-infrastructure` — topologia
- `linux-server-management` — serviço nginx no SO