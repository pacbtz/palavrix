#!/usr/bin/env node
/**
 * Extracts Portuguese words from dictionary-pt (Hunspell .dic file)
 * and generates validas-N.json files (valid guess lists) for lengths 5–11.
 *
 * Usage: node scripts/generate-wordlist.js
 */

const fs = require('fs');
const path = require('path');

const dicPath = path.join(__dirname, '..', 'node_modules', 'dictionary-pt', 'index.dic');
const outDir = path.join(__dirname, '..');

const LENGTHS = [5, 6, 7, 8, 9, 10, 11];

// Regex: only Portuguese letters (a-z plus common accented chars), no hyphens or dots
const VALID_WORD = /^[a-záàâãéêíóôõúüçA-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ]+$/;

function normalize(word) {
  return word
    .toLowerCase()
    .normalize('NFC'); // ensure composed form (é not e + combining)
}

console.log('Reading dictionary-pt...');
const raw = fs.readFileSync(dicPath, 'utf8');
const lines = raw.split('\n');

// First line is the word count; skip it
const wordsByLength = {};
LENGTHS.forEach(l => { wordsByLength[l] = new Set(); });

let total = 0;
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Strip Hunspell flags (e.g. "palavra/ABCD" → "palavra")
  const slashIdx = line.indexOf('/');
  const rawWord = slashIdx !== -1 ? line.slice(0, slashIdx) : line;

  const word = normalize(rawWord);

  if (!VALID_WORD.test(word)) continue;

  const len = word.length;
  if (wordsByLength[len]) {
    wordsByLength[len].add(word);
    total++;
  }
}

console.log(`Extracted ${total} words total.`);

LENGTHS.forEach(len => {
  const words = Array.from(wordsByLength[len]).sort();
  const outFile = path.join(outDir, `validas-${len}.json`);
  fs.writeFileSync(outFile, JSON.stringify(words, null, 0));
  console.log(`  validas-${len}.json → ${words.length} words`);
});

console.log('Done.');
