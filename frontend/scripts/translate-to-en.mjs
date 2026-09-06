import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set');
  process.exit(1);
}

const frPath = join(__dirname, '../locales/fr/common.json');
const enPath = join(__dirname, '../locales/en/common.json');

const frContent = readFileSync(frPath, 'utf-8');
const frJson = JSON.parse(frContent);

console.log(`File loaded: ${Object.keys(frJson).length} top-level keys`);
console.log('Calling Haiku...');

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `Translate the values of this JSON from French to English.
Rules:
- Keep all JSON keys exactly as-is
- Only translate the string values
- Preserve any placeholders like {{variable}}, {count}, etc.
- Return ONLY valid JSON, no explanation

${frContent}`,
      },
    ],
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error('API error:', response.status, err);
  process.exit(1);
}

const data = await response.json();
const usage = data.usage;
console.log(`Tokens used — input: ${usage.input_tokens}, output: ${usage.output_tokens}`);
console.log(`Cost estimate: $${((usage.input_tokens * 0.8 + usage.output_tokens * 4) / 1_000_000).toFixed(4)}`);

const rawText = data.content[0].text.trim();

// Strip markdown code block if present
const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');

let translated;
try {
  translated = JSON.parse(jsonText);
} catch (e) {
  console.error('Failed to parse response as JSON:', e.message);
  writeFileSync(enPath + '.raw', rawText, 'utf-8');
  console.log('Raw response saved to en/common.json.raw for inspection');
  process.exit(1);
}

writeFileSync(enPath, JSON.stringify(translated, null, 2), 'utf-8');
console.log(`Done! Written to ${enPath}`);
