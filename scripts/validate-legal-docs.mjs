import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LATEST_PATH = path.join(ROOT, 'legal-docs', 'manifests', 'latest.json');
const DOC_TYPES = new Set(['terms', 'privacy', 'cookie']);

function fail(message) {
  throw new Error(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validateEntry(platform, docType, lang, entry) {
  if (!isObject(entry)) {
    fail(`Entry for ${platform}/${docType}/${lang} must be an object`);
  }

  const version = Number(entry.version);
  if (!Number.isInteger(version) || version < 1) {
    fail(`Invalid version for ${platform}/${docType}/${lang}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.effectiveDate || ''))) {
    fail(`Invalid effectiveDate for ${platform}/${docType}/${lang}`);
  }

  if (!/^[a-f0-9]{64}$/.test(String(entry.sha256 || ''))) {
    fail(`Invalid sha256 for ${platform}/${docType}/${lang}`);
  }

  const url = String(entry.url || '');
  if (!url.startsWith('/legal-docs/documents/')) {
    fail(`Invalid url for ${platform}/${docType}/${lang}`);
  }
  if (!url.endsWith('.pdf')) {
    fail(`URL must point to a PDF for ${platform}/${docType}/${lang}`);
  }
}

async function main() {
  const raw = await fs.readFile(LATEST_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!isObject(parsed) || !isObject(parsed.latest)) {
    fail('latest.json must contain a top-level "latest" object');
  }

  for (const [platform, byType] of Object.entries(parsed.latest)) {
    if (!isObject(byType)) {
      fail(`Platform ${platform} must be an object`);
    }

    for (const [docType, byLang] of Object.entries(byType)) {
      if (!DOC_TYPES.has(docType)) {
        fail(`Invalid docType ${docType} under platform ${platform}`);
      }
      if (!isObject(byLang)) {
        fail(`DocType ${platform}/${docType} must be an object`);
      }

      for (const [lang, entry] of Object.entries(byLang)) {
        if (!lang) {
          fail(`Empty language key under ${platform}/${docType}`);
        }
        validateEntry(platform, docType, lang, entry);
      }
    }
  }

  console.log('Validation passed: legal-docs/manifests/latest.json');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
