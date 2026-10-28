# Tried and implemented

| Date | What | Result |
|---|---|---|
| 2026-10-28 | Portable Node 26.12.1 zip from nodejs.org, SHA-256 checked against `SHASUMS256.txt`, put first on PATH for one shell | Worked. `npm rebuild` then `npx cds watch --livereload false` started the server on port 4004 |
| 2026-10-28 | `npm rebuild` after switching Node major | Needed: modules had been installed under Node 20 |
