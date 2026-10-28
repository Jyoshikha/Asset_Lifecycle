# Rules

1. Visible to users means a **Build**; everything else is an **InBul** (`README.md` section 3).
2. The git tag is the source of truth for a number. Never put "(Build N)" in a commit title; never renumber or move a tag.
3. Batch about 10 fixes into one build, even when one fix is urgent.
4. Stage the change files before running `scripts/changelog.mjs --pending`.
5. `CHANGELOG.md` is generated. Never edit it by hand.
6. A build report's hand-written part is written once and never overwritten.
7. Commit only when asked. Push (commits and tags) only when explicitly told to.
8. Commits carry only the user's name: no co-author trailers, no attribution lines.
9. Record every design decision in `decisions.md` and every bug in `bugs.md`, citing the build or InBul that fixed it.
10. Do not claim something is verified unless it was run. Say "not verified" in the doc.
11. Use the project names from `README.md` section 5 in new files; leave old logs as written.
