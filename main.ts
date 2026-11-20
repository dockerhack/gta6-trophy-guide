// THE LEONIDA FILES — entry program for gta6-trophy-guide-01.
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with the kit's vendored
// buildDossier, so the sealed scorer can check the entry exactly as
// the judge will see it. Run with Node 22+ (type stripping handles
// the .ts import); outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output.

import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL(".", import.meta.url).pathname;
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 48 * 1024 * 1024,
  app_path_max_bytes: 1000,
};

function copyTree(name: string): void {
  const from = join(repoRoot, name);
  const to = join(outputDir, name);
  if (!existsSync(from)) throw new Error(`main.ts: missing ${name}/ in the repository`);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree("app");
copyTree("screenshots");
const dossier = buildDossier(outputDir, dossierCaps);
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log(
  `leonida-files: dossier.json written (${dossier.length} bytes) from app/ + screenshots/ into ${outputDir}`,
);
