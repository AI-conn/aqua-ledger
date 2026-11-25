# Devpost submission copy — AquaLedger

Ready-to-paste draft. Fill the `[BRACKETED]` fields. Nothing here claims a win or placement.

## Project title

AquaLedger — a private, offline water-use tracker for SDG 6

## Tagline (one line)

See your water use. Change one habit. No account, no server, no tracking.

## Short description (elevator pitch)

AquaLedger is a free, offline-first single-page app that lets a person log daily water use by
category, watch a 7-day trend, and track a self-chosen daily target — turning an invisible resource
into a visible habit, with all data kept locally in the browser.

## Long description

Water use is invisible: most people have no idea how many litres they use in a day, so there is no
feedback loop to change behaviour. AquaLedger makes that feedback loop simple and private.

A user logs litres across five everyday categories — drinking, cooking, hygiene, cleaning, and
garden/other. The category inputs auto-sum into a daily total, which is stored only in the browser's
`localStorage`. The dashboard shows today's total, a 7-day average, progress against a daily target
the user sets themselves, and a 7-day bar chart where over-target days are highlighted.

The default target of 100 L/day is deliberately an *editable planning number*, not presented as an
official standard — the app says so in the interface. This keeps the tool honest and adaptable to
different climates, households, and contexts.

Design goals:

1. **Privacy by construction** — no backend, no analytics, no accounts, no network calls.
2. **Zero friction** — no install, no build step; open one HTML file and it works.
3. **Accessibility** — semantic labels, keyboard operation, visible focus, high-contrast theme,
   reduced-motion support, and chart values exposed as text.
4. **Honesty** — synthetic sample data is labelled as such; AI assistance is disclosed in the README.

The app is built with plain HTML, CSS, and vanilla JavaScript, with no external libraries, so it can
run offline on a low-end device and be audited by reading three small files.

## Problem it addresses

SDG 6 (Clean Water and Sanitation) is usually framed as infrastructure. Individual consumption is
also part of the picture, but there are few tools that make个人 water use visible without asking the
user to hand personal data to a service. AquaLedger targets that gap.

## Key features

- Five-category daily logging with auto-summed total
- User-editable daily target with progress bar
- Today's total and 7-day average
- Seven-day bar chart with over-target highlighting
- JSON export and import for data portability
- Clearly-labelled sample week for demonstration
- Dark mode, responsive layout, accessible controls

## Technologies used

HTML5, CSS3 (custom properties for theming), vanilla JavaScript, browser `localStorage`, DOM-rendered
chart. No framework, no bundler, no external API.

## How it was built

Single-page static application. State is a JSON array of `{date, total, categories}` entries persisted
to `localStorage`. All rendering is a pure `render()` pass over that state. The chart is DOM bars sized
as percentages of the max of the target and observed values, so it needs no chart library. Import
validates each row's date format and numeric total before accepting it.

## Demo video script (~60–75 s)

1. (0–8 s) Title card: "AquaLedger — see your water use. Change one habit."
2. (8–20 s) Show the empty app. Log a day: drinking 2, cooking 8, hygiene 30, cleaning 10, garden 10.
   Point out the total auto-sums to 60 L.
3. (20–32 s) Click "Load sample week". Show the 7-day chart fill and one bar turn red above the target.
4. (32–45 s) Change the daily target from 100 to 50. Show progress bar and over-target message update.
5. (45–55 s) Toggle dark mode. Show responsive narrow view by resizing the window.
6. (55–65 s) Export JSON, then import it back. Say: "Your data never leaves the browser."
7. (65–75 s) Closing card: "SDG 6. No account. No server. No tracking. MIT licensed."

Shot list: browser viewport capture at 1280×800 for steps 2–5, narrow 390×844 capture for step 6,
screen-record at 30 fps, no voiceover required if captions are burned in.

## Demo links

- Live demo: `[DEPLOY_URL]` — GitHub Pages can serve this static folder directly from the repo
- Source code: `https://github.com/AI-conn/aqua-ledger` (public, pushed 2026-11-25)
- Video: `[VIDEO_URL]` — script at lines below; not yet recorded

## Team members

`[NAME]` — `[ROLE]`

## Eligibility reminders before submitting

- Confirm this contest accepts the applicant (some are students-only or invite-only).
- Confirm AI-assistance disclosure rules and follow them.
- Replace `[BRACKETED]` placeholders and remove the synthetic sample data note from any screenshot
  if the submission requires only real data.
- No secrets, keys, or credentials in any repo, screenshot, or submission field.
