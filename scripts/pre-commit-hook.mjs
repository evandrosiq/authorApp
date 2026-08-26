#!/usr/bin/env node
// Hook `pre-commit`: bloqueia o commit se algum package.json do repo está STAGED com
// dependência nova em relação ao HEAD, sem sinal de que a skill `avaliacao-de-libs` rodou.
//
// Por que isso existe (e não só um hook de `postinstall`): `npm install <pacote>` (adicionar um
// pacote nomeado) NÃO dispara `preinstall`/`install`/`postinstall` do projeto raiz — só um
// `npm install` sem argumentos ou `npm ci` disparam. Ou seja, um aviso de `postinstall` fica
// calado exatamente no caso mais comum de instalação feita direto no terminal. O commit é o
// portão que sobra e que dá pra bloquear de verdade: git hooks não têm essa lacuna.
//
// Aprovação: rode `LIBS_APROVADAS=<nomes separados por vírgula> git commit -m "..."` depois de
// rodar a skill e decidir manter a(s) lib(s).
//
// Sem dependências externas (só builtins do Node + `git`).

import { execSync } from 'node:child_process';

function raizDoRepo() {
  return execSync('git rev-parse --show-toplevel', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function conteudoOuNull(comando, cwd) {
  try {
    return execSync(comando, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

function nomesDeDependencias(conteudoJson) {
  if (!conteudoJson) return new Set();
  let pkg;
  try {
    pkg = JSON.parse(conteudoJson);
  } catch {
    return new Set();
  }
  return new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
}

const raiz = raizDoRepo();

const aprovadas = new Set(
  (process.env.LIBS_APROVADAS ?? '')
    .split(/[,\s]+/)
    .map((nome) => nome.trim())
    .filter(Boolean),
);

const arquivosStaged = execSync('git diff --cached --name-only', { cwd: raiz, encoding: 'utf8' })
  .split('\n')
  .filter((linha) => linha.endsWith('package.json'));

const novasPorArquivo = [];
for (const relativo of arquivosStaged) {
  const staged = conteudoOuNull(`git show :${relativo}`, raiz);
  const commitado = conteudoOuNull(`git show HEAD:${relativo}`, raiz);
  const antigas = nomesDeDependencias(commitado);
  const novas = [...nomesDeDependencias(staged)].filter(
    (nome) => !antigas.has(nome) && !aprovadas.has(nome),
  );
  if (novas.length > 0) {
    novasPorArquivo.push([relativo, novas]);
  }
}

if (novasPorArquivo.length === 0) {
  process.exit(0);
}

console.error('\n[bloqueado] Commit inclui dependência nova sem avaliação sinalizada:\n');
for (const [arquivo, nomes] of novasPorArquivo) {
  console.error(`  ${arquivo}: ${nomes.join(', ')}`);
}
console.error(
  '\nRode a skill `avaliacao-de-libs` (responsabilidade já coberta pelo stack adotado? ' +
    'compatível com o runtime e os pins documentados? peer deps sem conflito?), registre a ' +
    'justificativa onde o projeto guarda decisões (spec/plano da feature, CLAUDE.md, ou ' +
    'docs/loop/CONSTITUICAO.md, se houver) e reenvie o commit prefixado, ex.:\n' +
    '  LIBS_APROVADAS=' +
    novasPorArquivo.flatMap(([, nomes]) => nomes).join(',') +
    ' git commit -m "..."\n',
);
process.exit(1);
