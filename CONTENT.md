# Portfolio Content Guide

A map of what's where and what you should review/update before launch.

---

## Status: What's Already Done

Most of your real content is already in. The data files drive the whole site — you edit one file, it updates everywhere (experience section, terminal, resume all share the same source).

---

## 1. Hero Section

**File:** `components/sections/Hero.tsx`

What to check:
- The rotating subtitle text → `components/ui/RotatingText.tsx` (open and update the list)
- "See My Work" and "Mission Control" buttons are fine as-is

---

## 2. About Section

**File:** `components/sections/About.tsx`

The two paragraphs are **hardcoded directly in the JSX** (not in a data file).

What to update:
- Paragraph 1 — your background / degree summary
- Paragraph 2 — hackathon wins, what you care about
- GitHub and LinkedIn URLs (currently correct: `Zohaib-Eh` / `zohaib-ehtesham`)

> This is the only section where bio text lives in the component itself rather than a data file.

---

## 3. Experience & Awards

**File:** `lib/data/experience.ts`

This file drives both the neural network visualization and the terminal `jobs` command. Edit here, it updates both.

What to check:
- All 4 jobs are filled in — review bullets for accuracy
- All 6 awards are listed — verify dates and names
- `connectedTo` arrays draw lines between nodes in the visualization (e.g. NVIDIA → ELOQUENCE)

Structure of each entry:
```ts
{
  id: 'unique-id',
  type: 'job' | 'award',
  title: 'Your Title',
  subtitle: 'Company / Event',
  year: 2025,
  period: 'Month Year – Month Year',   // jobs only
  bullets: ['bullet 1', 'bullet 2'],   // jobs only
  connectedTo: ['other-node-id'],       // optional, draws connection lines
}
```

---

## 4. Projects

**File:** `lib/data/projects.ts`

10 projects are listed. Each card shows title, description, tags, and a GitHub link. Clicking opens a modal with more detail.

What to check per project:
- `description` — one-sentence summary shown on the card
- `tags` — tech stack badges
- `githubUrl` — make sure all repos are public or adjust
- `isHackathonWin: true` — shows a gold badge; set accurately
- `hackathonLabel` — the badge text (e.g. `"Encode AI — 1st Prize"`)
- `hackathonAffiliate` — shown on non-winning hackathon entries

To **add a project**, copy an existing entry and give it a new `id`.

To **remove a project**, delete its entry from the array.

---

## 5. Skills (Skill-teroids)

**File:** `lib/data/skills.ts`

17 skills are shown as floating asteroids. Each has an icon from CDN (devicons or simpleicons) and a background colour.

To **add a skill:**
```ts
{ name: 'Rust', cluster: 'backend', iconUrl: DI('rust'), bg: '#B7410E' }
```

To **change clusters** (affects the color grouping in the visualization):
`'aiml' | 'backend' | 'frontend' | 'devops'`

---

## 6. Resume Page

**File:** `app/resume/page.tsx`

The resume is hardcoded HTML (intentional — avoids PDF viewer issues). It has:

- Header: name, phone, GitHub, LinkedIn, email
- Education
- Experience (4 roles)
- Technical Skills
- Projects (3 featured)
- Leadership & Activities
- Awards

**What to check:**
- Phone number: `+44 7513 376637` — confirm this is correct / you want it public
- PDF download button links to `/ZohaibE. Resume 2026.pdf` — make sure this file is in `public/`
- The resume content here is **separate** from `lib/data/experience.ts` — changes in one don't sync to the other. Keep them consistent.

---

## 7. Terminal (Mission Control)

**File:** `lib/data/terminal.ts`

The `>_ Mission Control` button in the hero opens a terminal. Commands:
- `about` — bio text
- `skills` — skills list
- `awards` — awards table
- `contact` — contact info
- `experience` / `jobs <id>` — job details
- `projects` / `project <id>` — project details

What to update:
- `about` — the bio paragraph (separate from About section)
- `skills` — the text list of skills
- `contact` — email, GitHub, LinkedIn (currently has `zohaib.ehtesham@gmail.com`)
- `jobs` object — short summaries of each role (separate from `experience.ts`)
- `projectDetails` object — short summaries of featured projects
- The `secret` command response (`"nice try :)"`) — optional easter egg

---

## 8. Contact Section

**File:** `components/sections/Contact.tsx`

The email shown publicly: `zohaib.ehtesham@gmail.com` (line 33) — update if needed.

The contact form POSTs to `/api/contact`. Check `app/api/contact/route.ts` for where emails go.

---

## 9. Metadata & SEO

**File:** `app/layout.tsx`

Update:
- `title` — page title shown in browser tab
- `description` — used by search engines and link previews
- OG image — check `public/og-image.png` exists and looks right

---

## Quick Reference: Where Is What

| Content | File |
|---|---|
| Bio paragraphs | `components/sections/About.tsx` |
| Jobs & awards data | `lib/data/experience.ts` |
| Projects list | `lib/data/projects.ts` |
| Skills list | `lib/data/skills.ts` |
| Terminal command responses | `lib/data/terminal.ts` |
| Resume HTML | `app/resume/page.tsx` |
| Resume PDF file | `public/ZohaibE. Resume 2026.pdf` |
| Contact email shown | `components/sections/Contact.tsx` line 33 |
| Page title & SEO | `app/layout.tsx` |
| Rotating hero subtitles | `components/ui/RotatingText.tsx` |

---

## Things That Are Duplicated (keep in sync manually)

The resume page and `lib/data/experience.ts` are **independent**. If you update a job bullet in the data file, the resume page won't update automatically — you need to edit both. Same for the terminal `jobs` object vs `experience.ts`.

If this becomes annoying, I can refactor the resume page to read from the data file.
