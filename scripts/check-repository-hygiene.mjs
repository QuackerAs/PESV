import { execFileSync } from 'node:child_process';

const forbidden = /(^|\/)(\.(superpowers|codex|agents|cursor|claude)|node_modules|build|target)(\/|$)|\.(keystore|jks|apk|aab|pem|key|p12|pfx)$/i;
const secret = /(?:sk-[a-zA-Z0-9_-]{20,}|AIza[a-zA-Z0-9_-]{20,}|ghp_[a-zA-Z0-9]{30,}|github_pat_[a-zA-Z0-9_]{20,}|xox[baprs]-[a-zA-Z0-9-]{20,})/;
const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const matches = files.filter((file) => forbidden.test(file));
const exposed = files.filter((file) => {
  try {
    return secret.test(execFileSync('git', ['show', `:${file}`], { encoding: 'utf8', maxBuffer: 1024 * 1024 }));
  } catch {
    return false;
  }
});

if (matches.length || exposed.length) {
  console.error(`Tracked files that must stay local:\n${[...matches, ...exposed].join('\n')}`);
  process.exit(1);
}

console.log('Repository hygiene check passed.');
