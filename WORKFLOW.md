# Workflow Comparison: Vague vs. Precise Prompting

## Setup
Same feature (a settings form with validation) was built twice, in separate branches, using fresh AI sessions each time to avoid context contamination. Round 1 used a single lazy sentence: "Make a settings form." Round 2 used a detailed prompt with exact fields, validation rules, example behaviors, an accessibility requirement, and a verification step requiring automated tests.

## Correctness
Round 1 invented 13 fields (displayName, bio, theme, timezone, multiple notification toggles, privacy/security settings) that were never requested, instead of the 4 fields actually needed. Its dark mode and language controls were purely cosmetic: `theme` and `language` were tracked in form state but never referenced anywhere else in the component — no `useEffect`, no `document.documentElement`, no actual re-render logic. Round 2 implemented exactly the four specified fields, with dark mode wired to `document.documentElement.dataset.theme` and `localStorage`, and language switching driven by a real `translations` object used throughout the JSX.

## Accessibility
Round 1's `Field` component rendered `<label>{label}</label>` with no `htmlFor`, disconnected from its input — a screen reader can't associate the two. Round 2 paired every input with a matching `id`/`htmlFor`, satisfying the accessibility requirement explicitly stated in the prompt.

## Edge cases
Round 1's validation was inconsistent — some fields (email format) worked, others (name length) didn't reflect intended rules clearly, and there was no explicit minimum length or split between first/last name. Round 2's Zod schema matched the spec precisely (`firstName`/`lastName` min 2 characters, exact "Invalid email address" message), and its 6 automated tests explicitly assert empty-field errors, invalid email, and successful submission.

## AI mistake caught
Round 2's first test run failed immediately with `ReferenceError: expect is not defined`. The AI had written `SettingsForm.test.jsx` assuming Vitest's globals were configured, but never actually added a `test` block to `vite.config.js` or created a setup file importing `@testing-library/jest-dom`. This was only caught because the verification step required actually running the tests — without that step, this gap would have shipped silently. Adding `test: { globals: true, environment: 'jsdom', setupFiles: './src/test-setup.js' }` and a `src/test-setup.js` file fixed it; all 6 tests then passed.

## Review effort
Round 1 required almost no upfront thinking but needed a full rebuild once actual requirements (specific fields, working dark mode, working language switch) became clear — effectively wasted effort. Round 2 took noticeably longer up front (writing the prompt, working through a plan-confirm step, fixing the test config), but needed zero corrective rework afterward: every specified behavior worked on the first real test run once the config was fixed. Round 2 was slower to start but faster end-to-end, since Round 1's output wasn't usable without a near-total rewrite.

## Takeaway
A vague prompt doesn't save time — it just moves the cost from "writing a good prompt" to "reviewing and rebuilding bad output," and that cost is invisible until you actually try to use what was built.
