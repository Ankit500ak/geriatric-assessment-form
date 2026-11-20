# Geriatric Care Assessment Form

A one-page form a visiting nurse fills in when checking on an elderly patient
at home. Built with React 19, TypeScript, Mantine and Zod, starting from
Mantine's Vite template.

**Live demo:** https://ankit500ak.github.io/geriatric-assessment-form/

Hosted on GitHub Pages from the `docs` folder, which holds the production
build (`yarn build` output). Vercel could not run this template's Yarn 4.18
bundle in its build environment, so Pages is used instead; the app code is
identical either way.

## Run it locally

```bash
yarn install
yarn dev
```

```bash
yarn test   # typecheck, lint, format check, unit tests and production build
```

## How it is put together

- `src/features/assessment/schema.ts` — the Zod schema from the brief, used
  exactly as given. It is the single source of truth for every rule: field
  formats, the Barthel Index steps of 5, the age-60 pathway check, the
  follow-up-after-assessment check and the polypharmacy rule.
- `src/features/assessment/AssessmentForm.tsx` — the form itself. It wires the
  schema into `@mantine/form` with `schemaResolver`, so no validation rule is
  repeated in the components. Errors appear under each field, validation runs
  on blur and on submit, and untouched fields stay quiet.
- `src/features/assessment/sample.ts` — the invented sample patient from the
  brief, loaded by the "Load sample patient" button.

Two decisions worth noting:

- The form's initial values are the *input* shape (empty strings where a
  nurse has not typed anything yet), because an empty form can never satisfy
  the schema's output type. On submit, the values are run through
  `assessmentSchema.parse`, and it is that parsed `Assessment` — not the raw
  form state — that is shown in the success alert and passed to the save
  handler.
- The Mobility dropdown options are derived from the schema's `MOBILITY`
  array, so adding a value there (for example `home_visit`) makes it appear
  in the dropdown, correctly labelled, with no other change.

Saving is faked with an ~800 ms delay and a loading button, as the brief
asked; there is no backend.

## Tests

- `schema.test.ts` — the age boundary: a patient who turns exactly 60 on the
  assessment date is accepted; one day younger is rejected, with the error on
  `dateOfBirth`.
- `AssessmentForm.test.tsx` — loads the sample patient, submits, and checks
  the save handler was called with the parsed values.

## Time spent

About an hour of building and testing, plus extra time fighting the
deployment environment (Vercel's Yarn issue above) before the demo landed on
GitHub Pages.

Nothing from the brief is left unfinished. Backend, auth, routing and custom
styling were out of scope and are intentionally not here.
