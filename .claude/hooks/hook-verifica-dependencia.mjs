#!/usr/bin/env node
// Hook PreToolUse: exige a avaliação da skill `avaliacao-de-libs` antes de uma dependência nova.
//
// Recebe o payload do hook em JSON pelo stdin e responde com `permissionDecision`:
//   - `Bash` instalando pacote nomeado (`npm i <pkg>`, `pnpm add`, `yarn add`, `bun add`) -> nega
//     e instrui a rodar a skill. Reexecutar com o marcador `AVALIACAO_LIBS_OK=1` libera.
//   - `Edit`/`Write` em `package.json` que acrescenta dependência versionada -> pede confirmação.
//
// Deixa passar sem ruído o que não adiciona lib nova: `npm install` puro (restaura node_modules),
// `npm ci`, `npm update`, `npm audit fix`, `npx <algo>`, instalação global.
//
// Sem dependências externas (só builtins do Node), para rodar sem `npm install` prévio.
// Genérico entre projetos: nenhuma versão de runtime ou stack fica hardcoded aqui — quem sabe
// disso é a skill `avaliacao-de-libs` (Passo 0), que lê o projeto na hora.

import { readFileSync } from 'node:fs';

const MARCADOR = 'AVALIACAO_LIBS_OK=1';
const GERENCIADORES = new Set(['npm', 'pnpm', 'yarn', 'bun']);
const SUBCOMANDOS_DE_ADICAO = new Set(['install', 'i', 'add']);
const FLAGS_COM_VALOR = new Set([
  '-w',
  '--workspace',
  '--prefix',
  '-C',
  '--filter',
  '--registry',
  '--tag',
]);
const FLAGS_GLOBAIS = new Set(['-g', '--global', '--location=global']);

const SEPARADOR_DE_COMANDOS = /&&|\|\||;|\|/;
const ATRIBUICAO_DE_ENV = /^[A-Za-z_][A-Za-z0-9_]*=/;

const CAMPOS_DE_DEPENDENCIA = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

// Usada só quando o trecho editado NÃO é JSON completo (`Edit` manda fragmento). Exige valor com
// cara de faixa semver (`1.2.3`, `^4.0`, `~2.1.0`) ou protocolo de pacote — um `"timeout": "3000"`
// não casa, por não ter ponto.
const PAR_NOME_VERSAO = /"([@\w][\w@/.-]*)"\s*:\s*"((?:[\^~>=<]|\d)[\w.\-+*x]*\.[\w.\-+*x]*|(?:workspace|npm|file|link|github|git\+[a-z]+):[^"]*)"/g;

// Chaves que casam com o padrão acima sem serem dependência: a própria versão do pacote e o
// conteúdo de `engines`/`volta`. Sem isso, um bump de versão dispararia o hook.
const CHAVES_NAO_DEPENDENCIA = new Set(['version', 'node', 'npm', 'pnpm', 'yarn', 'bun', 'vscode']);

/** Quebra o trecho em tokens respeitando aspas simples/duplas (equivalente enxuto do shlex). */
function tokeniza(segmento) {
  const tokens = [];
  const padrao = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let achado;
  while ((achado = padrao.exec(segmento)) !== null) {
    tokens.push(achado[1] ?? achado[2] ?? achado[3]);
  }
  return tokens;
}

/** Nomes de pacote que este trecho de comando instalaria (vazio se não for instalação). */
function pacotesDoSegmento(segmento) {
  const tokens = tokeniza(segmento);

  while (tokens.length > 0 && ATRIBUICAO_DE_ENV.test(tokens[0])) {
    tokens.shift();
  }

  if (tokens.length < 2 || !GERENCIADORES.has(tokens[0])) {
    return [];
  }
  if (!SUBCOMANDOS_DE_ADICAO.has(tokens[1])) {
    return [];
  }
  // `yarn install` restaura o lockfile; só `yarn add` acrescenta dependência.
  if (tokens[0] === 'yarn' && tokens[1] !== 'add') {
    return [];
  }

  const argumentos = tokens.slice(2);
  if (argumentos.some((arg) => FLAGS_GLOBAIS.has(arg))) {
    return [];
  }

  const pacotes = [];
  let pularProximo = false;
  for (const arg of argumentos) {
    if (pularProximo) {
      pularProximo = false;
      continue;
    }
    if (arg.startsWith('-')) {
      pularProximo = FLAGS_COM_VALOR.has(arg);
      continue;
    }
    pacotes.push(arg);
  }
  return pacotes;
}

function responde(decisao, motivo) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decisao,
        permissionDecisionReason: motivo,
      },
    }),
  );
  process.exit(0);
}

function avaliaBash(entrada) {
  const comando = entrada.command ?? '';
  if (comando.includes(MARCADOR)) {
    return;
  }

  const pacotes = comando.split(SEPARADOR_DE_COMANDOS).flatMap(pacotesDoSegmento);
  if (pacotes.length === 0) {
    return;
  }

  responde(
    'deny',
    `Dependência nova detectada (${pacotes.join(', ')}). Antes de instalar, invoque a skill ` +
      '`avaliacao-de-libs` (responsabilidade já coberta pelo stack adotado? compatível com o ' +
      'runtime e os pins documentados no projeto? peer deps sem conflito?), apresente o veredito ' +
      'ao usuário e registre a justificativa onde o projeto guarda decisões (spec/plano da ' +
      'feature, CLAUDE.md, ou docs/loop/CONSTITUICAO.md, se houver). Se a avaliação já foi feita ' +
      `e aprovada, reexecute o mesmo comando prefixado com ${MARCADOR} para liberar.`,
  );
}

/** Heurística para trecho que não é um `package.json` inteiro (o `Edit` manda fragmento). */
function nomesEmFragmento(trecho) {
  const nomes = new Set();
  for (const [, nome] of trecho.matchAll(PAR_NOME_VERSAO)) {
    if (!CHAVES_NAO_DEPENDENCIA.has(nome)) {
      nomes.add(nome);
    }
  }
  return nomes;
}

/**
 * Nomes de dependência declarados no trecho. Quando ele é um `package.json` inteiro, lê os campos
 * de dependência de verdade — exato, sem falso positivo. Um fragmento (ou um JSON que não tem cara
 * de `package.json`, como `{ "@escopo/pacote": "^5.0.0" }`) cai na heurística nome→faixa-de-versão.
 */
function nomesDeDependencias(trecho) {
  if (!trecho.trim()) {
    return new Set();
  }

  try {
    const pkg = JSON.parse(trecho);
    if (pkg && typeof pkg === 'object' && CAMPOS_DE_DEPENDENCIA.some((campo) => campo in pkg)) {
      return new Set(CAMPOS_DE_DEPENDENCIA.flatMap((campo) => Object.keys(pkg[campo] ?? {})));
    }
  } catch {
    // Não é JSON válido: segue para a heurística de fragmento.
  }

  return nomesEmFragmento(trecho);
}

/**
 * Dependências já declaradas no arquivo em disco. O hook roda ANTES da escrita, então o arquivo
 * ainda tem o conteúdo antigo — baseline bem mais confiável que o `old_string` de um `Edit`
 * (fragmento) e a única baseline possível num `Write`, que não manda conteúdo antigo nenhum.
 */
function dependenciasEmDisco(caminho) {
  try {
    return nomesDeDependencias(readFileSync(caminho, 'utf8'));
  } catch {
    return null; // arquivo novo, caminho relativo que não resolve daqui, ou sem permissão
  }
}

function avaliaEdicao(entrada) {
  const caminho = entrada.file_path ?? '';
  if (!caminho.endsWith('package.json')) {
    return;
  }

  const conteudoNovo = entrada.new_string ?? entrada.content ?? '';
  const antigas = dependenciasEmDisco(caminho) ?? nomesDeDependencias(entrada.old_string ?? '');
  const adicionadas = [...nomesDeDependencias(conteudoNovo)].filter((dep) => !antigas.has(dep));
  if (adicionadas.length === 0) {
    return;
  }

  responde(
    'ask',
    `Esta edição acrescenta dependência ao ${caminho} (${[...adicionadas].sort().join(', ')}). ` +
      'Confirme que a skill `avaliacao-de-libs` já foi rodada e que a justificativa está ' +
      'registrada onde o projeto guarda decisões (spec/plano da feature, CLAUDE.md, ou ' +
      'docs/loop/CONSTITUICAO.md, se houver).',
  );
}

const pedacos = [];
for await (const pedaco of process.stdin) {
  pedacos.push(pedaco);
}

let payload;
try {
  payload = JSON.parse(Buffer.concat(pedacos).toString('utf8'));
} catch {
  // Payload ausente ou malformado: não é papel do hook derrubar a chamada da ferramenta.
  process.exit(0);
}

const entrada = payload.tool_input ?? {};
if (payload.tool_name === 'Bash') {
  avaliaBash(entrada);
} else if (payload.tool_name === 'Edit' || payload.tool_name === 'Write') {
  avaliaEdicao(entrada);
}

process.exit(0);
