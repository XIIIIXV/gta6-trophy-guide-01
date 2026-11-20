// Leonida Platinum Log — the program that hands the guide in (Node 22,
// standard library only). The guide itself is plain static files under app/
// (index.html, its modules and styles, app/data/trophies.json with the 55
// guides), and screenshots/ holds 3 or 4 renders of it in a browser. This
// program copies both into /output and writes /output/dossier.json with the
// vendored make.fun library, so the judge can read the screenshots and the
// outline of the source. vendor/makefun-frontend.ts stays untouched: the
// scorer rebuilds the dossier with its own copy and compares byte for byte.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide locally with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy the guide (app/) and its screenshots into the output directory.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): text_max_bytes shapes the
// dossier text; the other limits refuse an entry the scorer would refuse
// (more than 4 screenshots or one over 256 KiB; more than 993 files and
// directories in app/ or 48 MiB of app files — app/ counts beside /output's
// own 1000-entry cap, its screenshots/ and dossier.json).
const shotCount = readdirSync(join(outputDir, 'screenshots')).filter(
  (name) => !name.startsWith('.'),
).length;
const dossier = buildDossier(outputDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 });
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`Leonida Platinum Log handed in: app/ + ${shotCount} screenshot(s) + dossier.json (${Buffer.byteLength(dossier)} bytes) in ${outputDir}`);
