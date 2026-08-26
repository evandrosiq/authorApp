# autor-obra-app

SPA de cadastro de autores e obras. React 18 + TypeScript + Vite, SCSS,
`react-router-dom` para rotas, `react-select` para combobox, `sonner` para toasts.
Persistência é **localStorage** (`src/services/AuthorService.tsx`) — não há backend.

Estrutura: `src/pages/` (rotas), `src/components/` (UI), `src/hooks/` (lógica de
formulário e ações), `src/context/ContextManager.tsx` (estado da tabela),
`src/validation/` (regras de input), `src/scss/` (estilos), `src/test/` (setup do Vitest).

Gerenciador de pacotes oficial: **npm**. (`yarn.lock` ainda existe no repo por
histórico — não use yarn; remover o lockfile órfão é pendência aberta.)

## Gates de qualidade

Nenhuma task é considerada pronta sem TODOS os gates verdes:

- Testes: `npm test`
- Lint: `npm run lint`
- Tipos: `npm run typecheck`
- Build: `npm run build`

Gates de segurança adicionais (também obrigatórios para fechar uma task):

- Padrões proibidos: `npm run check:patterns`
- Auditoria de dependência: `npm run check:audit`

`check:patterns` bane `dangerouslySetInnerHTML`, `.innerHTML =`, `eval(`,
`new Function(` e `document.write(` em `src/` — o app renderiza texto vindo do
usuário (título, autor), então HTML cru é risco direto de XSS. Ajuste a lista em
`scripts/check-forbidden-patterns.mjs` só com decisão registrada em ADR.

`check:audit` falha em vulnerabilidade alta/crítica que não esteja em
`audit-allowlist.json` com justificativa e critério de reavaliação. Nunca silencie
uma vulnerabilidade adicionando exceção sem os dois campos preenchidos.

**Estado real hoje (2026-08-26):** todos os gates estão verdes — ver
`docs/loop/STATUS.md` para bloqueios pontuais em aberto (ex.: exceções
registradas em `audit-allowlist.json` para vulnerabilidades que só têm fix via
upgrade major).

Proibido fazer um gate passar enfraquecendo-o: apagar teste, largar assert, adicionar
skip/ignore, afrouxar regra de lint ou usar cast para calar o verificador de tipos.

## Loop de Engenharia

Este projeto segue o Loop de Engenharia. Antes de implementar qualquer coisa,
leia `docs/loop/STATUS.md`.

Regras de negócio vivem em `docs/loop/specs/` com identificadores RN-XX; cada RN
implementada precisa de teste que a cite. As specs são **flat** (um domínio só:
autores/obras) — não agrupe por subpasta sem decidir isso explicitamente.
Regra descoberta durante a implementação volta para a spec ANTES de virar código.

Nenhuma dependência nova entra sem passar por `/avaliacao-de-libs`, mesmo quando
pedida explicitamente. Isso é **bloqueado automaticamente**, não só por convenção:

- Hook `PreToolUse` (`.claude/hooks/hook-verifica-dependencia.mjs`, registrado em
  `.claude/settings.json`) intercepta instalação feita nesta sessão. Libere com o
  marcador `AVALIACAO_LIBS_OK=1` dentro do próprio comando de instalação.
- Pre-commit (`.githooks/pre-commit` → `scripts/pre-commit-hook.mjs`, ativado por
  `core.hooksPath`) cobre instalação feita em terminal externo. Libere com a variável
  de ambiente `LIBS_APROVADAS=<pacotes separados por vírgula>` no `git commit`.

São mecanismos independentes: quando instalação e commit acontecem na mesma sessão,
libere os dois. Liberar sem ter feito a avaliação é burlar o gate, não usá-lo.

Fluxo: `/especificar` → `/planejar` → `/implementar` → `/verificar` → `/revisar-regras`.
Para retomar trabalho: `/retomar`. Decisão estrutural: `/adr`.

Se `docs/loop/CONSTITUICAO.md` existir, ele tem **precedência sobre este arquivo**
e sobre qualquer spec. Ainda não existe — `/constituicao` cria.

## Convenções em uso

Siga o que já está no código, não imponha estilo novo:

- Componentes em pasta com `index.tsx` (`src/components/Header/index.tsx`).
- Tipos compartilhados em `src/general.d.ts`, importados de `"../general"`.
- Testes colocados junto do código: `src/**/*.test.ts[x]`, rodados por Vitest com
  jsdom. `src/test/setup.ts` já faz `cleanup()` e `localStorage.clear()` entre testes —
  não repita isso em cada arquivo.
- `.prettierrc.json` existe, mas o Prettier NÃO está instalado como dependência e o
  código atual não foi formatado por ele. Rodá-lo em tudo geraria um diff que apaga o
  histórico útil de `git blame` — se for formatar, faça em commit isolado e só então.
