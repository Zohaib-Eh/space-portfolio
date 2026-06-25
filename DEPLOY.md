# Deployment Guide

## Pre-deploy Checklist

### 1. Set Environment Variables in Vercel

In the Vercel dashboard, add the following environment variable:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (from resend.com) |

Steps:
1. Go to vercel.com → Your project → Settings → Environment Variables
2. Add `RESEND_API_KEY` with your key value
3. Redeploy after adding

### 2. Replace the OG Image

Replace `public/og-image.png` with a real 1200×630 px image before launch.

This image appears when your portfolio link is shared on social media.

See `public/og-image-placeholder.txt` for tool suggestions.

### 3. Fill In Social Handles (Easter Egg)

Update the real Discord tag and Instagram handle in:
`components/easter-eggs/RubiksModal.tsx`

Search for placeholder values like `@yourhandle` and replace with your actual handles.

### 4. Fill In Project Descriptions

Update the project entries in `lib/data/projects.ts` with real descriptions for:
- Ripple
- Codaline
- Carma
- GoFish
- LLM-Ontology

### 5. Deploy to Vercel

```bash
git add .
git commit -m "chore: deploy prep"
git push origin main
```

Then:
1. Go to vercel.com → New Project → Import your GitHub repo
2. Framework will be auto-detected as Next.js (confirmed by `vercel.json`)
3. Add the `RESEND_API_KEY` environment variable
4. Click Deploy

## Domain

Update the `url` field in `app/layout.tsx` openGraph config once you have a real domain:

```typescript
url: 'https://your-actual-domain.com',
```
