# AquaLedger

A free, offline-first, single-page personal water-use tracker built as a small hackathon demo
around UN Sustainable Development Goal 6 (Clean Water and Sanitation).

No account. No server. No analytics. No external dependencies. All data stays in the browser's
`localStorage`.

## What it does

- Log daily water use in litres across five categories (drinking, cooking, hygiene, cleaning, garden/other).
- Category inputs auto-sum into a total, or enter a total directly.
- Choose your own daily target (default **100 L**, an editable planning number — *not* an official standard).
- See today's total, 7-day average, target progress, and a 7-day bar chart with over-target bars highlighted.
- Delete entries, export/import JSON, and load a clearly-labelled sample week.
- Dark mode, keyboard-accessible controls, visible focus rings, reduced-motion support, responsive layout.

## Run locally

No build step. Either open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Files

- `index.html` — semantic structure and labels
- `styles.css` — theme tokens, layout, chart and accessibility styles
- `app.js` — state, localStorage persistence, chart rendering, import/export
- `SUBMISSION.md` — ready-to-paste Devpost copy and demo script
- `README.md` — this file

## Tech

Plain HTML, CSS, and vanilla JavaScript (ES5-compatible syntax, no framework, no bundler, no network calls).
Charts are rendered as DOM bars rather than a chart library so the whole app works offline.

## License

MIT.

## Disclosure

Built with AI assistance. Any submission using this project must follow the target hackathon's rules on
AI-generated work and disclose assistance where required. The sample data is synthetic and labelled as such.
No win, placement, or prize is claimed or implied.
