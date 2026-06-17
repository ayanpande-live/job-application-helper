# FitSignal Prototype

A private Phase 1 prototype for an AI job-fit and application strategy tool.

The product direction is:

> Know if you fit before you apply.

This is **not** wired to OpenAI, Supabase, HubSpot, Gmail, or n8n yet. The frontend and API routes are real Next.js code, but the API routes return mock data so the flow can be tested safely first.

## What is included

- Landing page
- Input form
- Loading state
- Results dashboard
- Fit verdict and gap diagnosis
- Application strategy section
- Tailored CV draft
- Cover letter draft
- Outreach drafts
- Role Readiness Plan modal
- Email capture modal
- Stubbed API routes

## What is intentionally not included yet

- Login
- Payments
- Real OpenAI calls
- Supabase database wiring
- n8n webhook wiring
- PDF upload
- Public launch features

## File structure

```txt
app/
  layout.tsx
  globals.css
  page.tsx
  analyze/page.tsx
  results/[jobId]/page.tsx
  api/analyze/route.ts
  api/email-capture/route.ts
  api/improvement-plan/route.ts
components/
  LandingPage.tsx
  InputForm.tsx
  LoadingScreen.tsx
  ResultsDashboard.tsx
  EmailCaptureModal.tsx
  ImprovementPlanModal.tsx
  ui/Button.tsx
  ui/Card.tsx
  ui/Modal.tsx
  ui/Logo.tsx
  ui/icons.tsx
lib/
  api.ts
  mock-data.ts
  types.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the local development server:

```bash
npm run dev
```

3. Open:

```txt
http://localhost:3000
```

## Useful commands

```bash
npm run dev
npm run build
npm run typecheck
```

## Environment variables

Copy `.env.example` to `.env.local` when you start wiring real services.

```bash
cp .env.example .env.local
```

Current variables are placeholders only:

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_EMAIL_CAPTURE_WEBHOOK_URL=
N8N_IMPROVEMENT_PLAN_WEBHOOK_URL=
```

## Next implementation step

After the mock frontend is approved, replace `/app/api/analyze/route.ts` with a real OpenAI Responses API call that returns the same `AnalysisResult` shape defined in `lib/types.ts`.

Do not change the UI shape until the backend returns stable structured JSON.
