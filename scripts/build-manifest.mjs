import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LATEST_PATH = path.join(ROOT, 'legal-docs', 'manifests', 'latest.json');

async function main() {
  const raw = await fs.readFile(LATEST_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  const normalized = JSON.stringify(parsed, null, 2) + '\n';
  await fs.writeFile(LATEST_PATH, normalized, 'utf8');
  console.log('Manifest normalized');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
