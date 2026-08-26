#!/usr/bin/env node
/**
 * Gate de auditoria de dependências: roda `npm audit` no workspace corrente e falha só se
 * sobrar vulnerabilidade alta/crítica cujo advisory (GHSA) não está registrado em
 * `audit-allowlist.json` na raiz — com justificativa e critério de reavaliação, não um "ignore"
 * silencioso. Sem dependência nova: só `node:child_process`/`node:fs`, nativos.
 *
 * Uso: node scripts/check-audit.mjs [--dir <workspace>]
 * Sem --dir, roda no diretório corrente (process.cwd()).
 *
 * Formato de audit-allowlist.json (adaptado do audit-allowlist-template.json desta pasta):
 * {
 *   "exceptions": [
 *     {
 *       "id": "GHSA-xxxx-xxxx-xxxx",
 *       "package": "nome-do-pacote",
 *       "justificativa": "por que essa vulnerabilidade não se aplica ou não tem correção viável",
 *       "reavaliarQuando": "condição que torna a exceção obsoleta (nova versão, mudança de uso)"
 *     }
 *   ]
 * }
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const dirIndex = argv.indexOf('--dir');
  return { workspaceDir: dirIndex >= 0 ? argv[dirIndex + 1] : process.cwd() };
}

function runNpmAudit(cwd) {
  let saida;
  try {
    // exit code não-zero quando há vulnerabilidade — captura via try/catch, stdout ainda vem no erro.
    saida = execFileSync('npm', ['audit', '--audit-level=high', '--json'], {
      cwd,
      encoding: 'utf8',
    });
  } catch (error) {
    if (!error.stdout) {
      throw error;
    }
    saida = error.stdout;
  }

  const relatorio = JSON.parse(saida);

  // `npm audit` também devolve JSON quando NÃO auditou nada (ex.: ENOLOCK, sem lockfile).
  // Sem esta checagem o relatório de erro passaria como "nenhuma vulnerabilidade" — um gate de
  // segurança verde sem ter auditado coisa alguma.
  if (relatorio.error) {
    const { code, summary } = relatorio.error;
    throw new Error(`npm audit não conseguiu auditar ${cwd} (${code ?? 'erro'}): ${summary ?? ''}`);
  }
  if (!relatorio.vulnerabilities) {
    throw new Error(
      `npm audit devolveu um relatório sem o campo "vulnerabilities" em ${cwd} — resultado inconclusivo, não tratado como aprovado.`,
    );
  }

  return relatorio;
}

/** Extrai todo advisory GHSA (id + severidade) referenciado em qualquer `via` do relatório —
 * cobre tanto pacotes com vulnerabilidade direta quanto os que só a herdam transitivamente. */
function extractAdvisories(auditJson) {
  const advisories = new Map(); // id -> { id, packages: Set, severity }

  for (const vuln of Object.values(auditJson.vulnerabilities ?? {})) {
    for (const via of vuln.via ?? []) {
      if (typeof via !== 'object' || !via.url) {
        continue; // string = nome de outro pacote (cadeia transitiva), não um advisory em si
      }
      const id = via.url.split('/').pop();
      if (!advisories.has(id)) {
        advisories.set(id, { id, packages: new Set(), severity: via.severity });
      }
      advisories.get(id).packages.add(vuln.name);
    }
  }

  return [...advisories.values()].filter((a) => a.severity === 'high' || a.severity === 'critical');
}

function loadAllowlist() {
  const caminho = join(REPO_ROOT, 'audit-allowlist.json');
  let raw;
  try {
    raw = readFileSync(caminho, 'utf8');
  } catch {
    throw new Error(
      `audit-allowlist.json não encontrado em ${caminho}. Crie-o com {"exceptions": []} — a ausência do arquivo não é tratada como "nenhuma exceção".`,
    );
  }
  const { exceptions } = JSON.parse(raw);
  if (!Array.isArray(exceptions)) {
    throw new Error(`${caminho} precisa ter um array "exceptions" (use [] se não houver exceção).`);
  }
  return new Set(exceptions.map((e) => e.id));
}

function main() {
  const { workspaceDir } = parseArgs(process.argv.slice(2));
  const auditJson = runNpmAudit(workspaceDir);
  const highOrCritical = extractAdvisories(auditJson);
  const allowlist = loadAllowlist();

  const uncovered = highOrCritical.filter((a) => !allowlist.has(a.id));

  if (uncovered.length > 0) {
    console.error(`❌ Vulnerabilidade alta/crítica sem exceção registrada em ${workspaceDir}:`);
    for (const advisory of uncovered) {
      console.error(
        `   ${[...advisory.packages].join(', ')} (${advisory.id}) — corrija com \`npm audit fix\` ou registre uma exceção justificada em audit-allowlist.json.`,
      );
    }
    process.exit(1);
  }

  console.log(`✅ ${workspaceDir}: sem vulnerabilidade alta/crítica fora do audit-allowlist.json.`);
}

try {
  main();
} catch (error) {
  // Falha ao auditar não é aprovação: reporta e falha o gate, em vez de vazar stack trace.
  console.error(`❌ Auditoria não concluída: ${error.message}`);
  process.exit(1);
}
