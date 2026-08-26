# ADR-0001 — Vitest + Testing Library como framework de testes

- **Data:** 2026-08-25
- **Status:** Aceita

## Contexto

O projeto (React 18 + TypeScript + Vite) não tinha nenhum framework de testes na
adoção do Loop de Engenharia. Sem gate de testes o loop não funciona: as regras de
negócio (RN-XX) precisam de um teste que as cite para serem consideradas cobertas.

O código a testar é de três naturezas: lógica pura (`src/validation/`), acesso a
localStorage (`src/services/AuthorService.tsx`), e componentes/hooks React
(`src/components/`, `src/hooks/`).

## Alternativas consideradas

- **Jest + Testing Library** — padrão de mercado, mas exigiria uma segunda
  configuração de transform (babel/ts-jest) paralela à do Vite, com risco de
  divergência entre o que o teste compila e o que o build compila.
- **Vitest sem Testing Library** — cobriria `services/`, `hooks/` e `validation/`,
  mas deixaria os componentes React sem gate.
- **Vitest + Testing Library** — escolhida.

## Decisão

Vitest 2 como runner, reaproveitando o `vite.config.ts` existente (mesma resolução
de módulos e mesmos plugins do build), com:

- `@testing-library/react` + `@testing-library/user-event` para componentes;
- `@testing-library/jest-dom` para matchers de DOM;
- `jsdom` como ambiente;
- `src/test/setup.ts` fazendo `cleanup()` e `localStorage.clear()` após cada teste —
  necessário porque a persistência do app é localStorage e o estado vazaria entre testes.

**`jsdom` fica pinado em `^25`.** Motivo original: o jsdom 27 era carregado via
`require()` pelo Vitest 2 e quebrava com `ERR_REQUIRE_ESM` (`@csstools/css-calc` é
ESM-only).

**Atualização (2026-08-26):** o projeto migrou para Vitest 4.1.11 (ver ADR-0003).
O motivo do pin mudou — não é mais o bug `ERR_REQUIRE_ESM` (não testado diretamente
nesta reavaliação), e sim `engines.node`: jsdom 26+ exige Node `>=22.13.0`/`24.x`, e o
jsdom 30 (testado) chegou a exigir `>=22.22.2`, acima do Node real do ambiente
(20.18.0). O pin em `^25` permanece necessário até o ambiente rodar Node ≥22.

## Consequências

- O gate de testes é `npm test` (`vitest run`, modo não-interativo).
- Cobertura disponível via `npm run test:coverage` (provider v8), sem limiar mínimo
  configurado — se o projeto quiser exigir cobertura, isso vira princípio em
  `/constituicao`, não configuração silenciosa.
- Testes ficam colocados junto ao código (`src/**/*.test.ts[x]`), não em pasta separada.
- Uma atualização do Vitest para a linha 3 exige revisitar o pin do jsdom.
