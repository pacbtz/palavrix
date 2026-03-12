# Palavrix

Portuguese Wordle clone — a single-page static game. No build system, no dependencies, no package manager.

## Architecture

Everything is self-contained in one file:

- [index.html](index.html) — all HTML, CSS, and JS in a single file
- [data/palavras-5.json](data/palavras-5.json) — 5-letter target word list
- [data/palavras-5-expanded.json](data/palavras-5-expanded.json) — 5-letter valid guesses (superset)
- [data/palavras-6.json](data/palavras-6.json) — 6-letter target word list
- [data/palavras-6-expanded.json](data/palavras-6-expanded.json) — 6-letter valid guesses
- [data/serve.py](data/serve.py) — simple local dev server (needed for `fetch()` CORS)

## Local Development

Run a local server from the repo root (required because the game fetches JSON files):

```sh
python3 data/serve.py
# then open http://localhost:8000
```

## Key Game Logic (index.html)

- `EPOCH = 2024-01-01` — day 0 for word index calculation
- `dateToWordIndex()` — maps a date string to a word list index
- `WORD_LENGTH` — 5 or 6, toggled via UI or URL hash
- `wordList` — target words loaded from `palavras-N.json`
- `validWords` — accepted guesses loaded from `palavras-N-expanded.json`
- `evaluateGuess()` — returns `correct` / `present` / `absent` per letter
- `revealRow()` — animates tile flip and calls `updateKey()`

## URL Routing (hash-based)

- Default: today's 5-letter word
- `#6` — switch to 6-letter mode
- `#5/20260309` — 5-letter word for a specific date
- `#6/20260309` — 6-letter word for a specific date

## Deployment

Static files served via GitHub Pages: https://pacbtz.github.io/palavrix/

Push to `main` branch to deploy.

## Tile States

| Class | Color | Meaning |
|-------|-------|---------|
| `correct` | Green `#538d4e` | Right letter, right position |
| `present` | Yellow `#b59f3b` | Right letter, wrong position |
| `absent` | Grey `#3a3a3c` | Letter not in word |
