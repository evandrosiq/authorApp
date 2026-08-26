#!/usr/bin/env node
/**
 * Verifica automaticamente a ausência de padrões perigosos que o projeto decidiu descartar
 * (SQL montado à mão, HTML cru injetado, etc.) — vira regra checada em CI/local, não só
 * convenção de code review. Sem dependência nova (só `node:fs`).
 *
 * Uso: node scripts/check-forbidden-patterns.mjs
 *
 * FORBIDDEN_PATTERNS abaixo é um ponto de partida — ajuste para os padrões que ESTE projeto
 * decidiu banir (registre o porquê na spec/ADR correspondente). Exemplos comuns:
 *   - '$queryRawUnsafe', '$executeRawUnsafe'  (Prisma: SQL não parametrizado)
 *   - 'dangerouslySetInnerHTML'                (React: HTML cru sem sanitização)
 *   - 'eval('                                  (execução de string como código)
 *   - '.innerHTML ='                           (DOM: mesma classe de risco que dangerouslySetInnerHTML)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, não `.pathname`: o pathname da URL vem percent-encoded, então um caminho com
// espaço ou acento (`/meu projeto/`) viraria `/meu%20projeto/` e nenhum arquivo seria encontrado.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TARGET_DIRS = ['src']; // ajuste para os diretórios de código-fonte deste projeto
const FORBIDDEN_PATTERNS = [
  "dangerouslySetInnerHTML", // React: HTML cru sem sanitização — o app renderiza título/autor vindos do usuário
  ".innerHTML =",            // DOM: mesma classe de risco, por fora do React
  "eval(",                   // execução de string como código
  "new Function(",           // idem, por outro caminho
  "document.write(",         // injeção direta no documento
];
const FILE_EXTENSIONS = /\.(ts|tsx|js|jsx)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', 'build']);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) {
        walk(fullPath, files);
      }
      continue;
    }
    if (FILE_EXTENSIONS.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

if (FORBIDDEN_PATTERNS.length === 0) {
  console.error(
    '❌ FORBIDDEN_PATTERNS está vazio — este gate não verifica nada. Preencha com os padrões que este projeto baniu (ver comentário no topo) ou remova o gate.',
  );
  process.exit(1);
}

const violations = [];
let arquivosVarridos = 0;

for (const targetDir of TARGET_DIRS) {
  const absoluteDir = join(ROOT, targetDir);
  // Ausência do diretório é tolerada (checkout parcial), mas silenciar QUALQUER erro faria o
  // gate passar sem ter varrido nada — por isso só o caso "não existe" é ignorado.
  if (!existsSync(absoluteDir)) {
    console.warn(`aviso: ${targetDir} não existe, pulando.`);
    continue;
  }
  const files = walk(absoluteDir);
  arquivosVarridos += files.length;

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (content.includes(pattern)) {
        violations.push({ file: relative(ROOT, file), pattern });
      }
    }
  }
}

if (violations.length > 0) {
  console.error('❌ Padrões proibidos encontrados:');
  for (const { file, pattern } of violations) {
    console.error(`   ${file}: ${pattern}`);
  }
  process.exit(1);
}

if (arquivosVarridos === 0) {
  console.error(
    `❌ Nenhum arquivo varrido em ${TARGET_DIRS.join(', ')} — ajuste TARGET_DIRS/FILE_EXTENSIONS. Gate que não lê nada não é gate.`,
  );
  process.exit(1);
}

console.log(
  `✅ Nenhum padrão proibido encontrado (${arquivosVarridos} ${arquivosVarridos === 1 ? 'arquivo varrido' : 'arquivos varridos'}).`,
);
