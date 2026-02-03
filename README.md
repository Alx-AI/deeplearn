# DeepLearn

A spaced-repetition learning platform for mastering deep learning and multi-agent reinforcement learning through structured lessons, review cards, and quizzes.

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Database:** Neon PostgreSQL (serverless)
- **Auth:** NextAuth.js 5 (credentials)
- **State:** Zustand 5
- **Styling:** Tailwind CSS 4, custom design system
- **Animation:** Framer Motion
- **SRS Engine:** ts-fsrs

## Features

- **Multi-book curriculum** — Deep Learning with Python (3rd Ed.) and Multi-Agent Reinforcement Learning, organized into modules and lessons
- **Spaced repetition** — review cards embedded inline within lessons, scheduled by the FSRS algorithm
- **Quizzes** — round-based knowledge checks at the end of each lesson
- **Progress tracking** — per-user mastery percentage, cards due, daily review count, section-level read state
- **Design system** — Dieter Rams-inspired palette (warm off-whites, calibrated grays, refined gold accent), light and dark modes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret
