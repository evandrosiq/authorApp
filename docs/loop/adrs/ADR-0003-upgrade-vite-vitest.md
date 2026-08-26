# ADR-0003 — Upgrade de vite (5→6) e vitest (2→4), teto de versão travado pelo Node do ambiente

- **Data:** 2026-08-26
- **Status:** aceita

## Contexto

`npm run check:audit` mantinha duas exceções em `audit-allowlist.json` desde
2026-08-26: `vite` (GHSA-fx2h-pf6j-xcff, high — esbuild embutido no dev server
permite site malicioso ler resposta do dev server local) e `vitest`
(GHSA-5xrq-8626-4rwp, critical — herdada de `@vitest/mocker`/vite). Nenhuma das
duas tinha correção sem `npm audit fix --force` (major bump).

## Alternativas consideradas

1. **Manter as exceções indefinidamente** — zero risco de breaking change, mas
   deixa vulnerabilidade high/critical tolerada sem prazo.
2. **Atualizar para as versões mais recentes (vite 8, vitest 4, `@vitejs/plugin-react` 6)**
   — descartada: `vite@7`/`8` e `@vitejs/plugin-react@5`+ exigem
   `engines.node >=20.19.0 || >=22.12.0`; o Node real do ambiente é **20.18.0**,
   abaixo do mínimo. Forçar essa combinação quebraria `npm install` no
   ambiente atual.
3. **Atualizar até o teto compatível com o Node do ambiente** — escolhida:
   `vite@6.4.3` (`engines.node: ^18 || ^20 || >=22`, aceita qualquer 20.x) +
   `@vitejs/plugin-react@4.7.0` (já instalado, sem mudança — aceita
   `vite ^6.0.0`) + `vitest@4.1.11`/`@vitest/coverage-v8@4.1.11`
   (`engines.node: ^20.0.0 || ^22.0.0 || >=24.0.0`, também compatível).

## Decisão

Atualizar `vite` para `6.4.3`, `vitest` e `@vitest/coverage-v8` para `4.1.11`
(pulando a v3 inteira — v4 já é a versão mantida, sem motivo para adotar uma
intermediária). `jsdom` permanece pinado em `^25` (ver ADR-0001, nota de
2026-08-26): jsdom 26+ exige Node `>=22.13.0`, acima do que o ambiente tem.

`npm audit` passou a reportar **0 vulnerabilidades** — `audit-allowlist.json`
foi esvaziado (as duas exceções que existiam eram exatamente essas).

## Consequências

- **Teto de versão real é vite 6.x, não a mais recente publicada.** Uma
  tentativa futura de "atualizar tudo para a última versão" vai falhar ou
  forçar downgrade de `@vitejs/plugin-react` incompatível com o Node do
  ambiente — subir further exige primeiro atualizar o Node para ≥20.19.0 (ou
  ≥22.12.0), decisão de infraestrutura fora do escopo deste ADR.
- `vitest` pulou da v2 direto para a v4 — nenhuma API de teste do projeto
  (`describe`/`it`/`expect`/`vi.fn`/Testing Library) mudou de forma visível;
  os 48 testes existentes passaram sem alteração de código, só de versão.
- `package.json` não pina `engines.node` — o teto acima não é fiscalizado
  automaticamente; alguém rodando `npm install` num Node mais novo não vai ser
  impedido de instalar versões incompatíveis com o Node 20.18 usado aqui.
- Gates verdes: typecheck, lint, 48 testes, build (vite 6.4.3), `test:coverage`
  (`@vitest/coverage-v8` 4.1.11), check:patterns, check:audit (0
  vulnerabilidades).
