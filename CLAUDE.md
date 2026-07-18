# Project: Environment and AI

## Stack
- Language: (fill in once decided)
- Framework: (fill in once decided)
- Package manager: npm

## Conventions
- Commit messages follow Conventional Commits (feat:, fix:, docs:, chore:, etc.)
- Use 2-space indentation
- Keep functions small and focused
- Write tests for new features before merging

## Workflow notes
- Run `npm install` before starting
- Run tests before committing
- Keep commits small and focused

## Rules learned from FE drill (vague vs. precise prompting)
- Forms use react-hook-form + zod for validation; never build uncontrolled inputs without a schema.
- Any UI control that claims to do something (theme toggle, language switch, etc.) must have real logic behind it — not just local state that nothing reads. If a prompt mentions a feature, specify what it should visibly do, or the AI will build a decorative control.
- Every feature request that includes behavior (validation, persistence, conditional logic) must include a verification step ("write tests and run them") — untested AI-written code can fail silently on basic setup issues (e.g. missing test environment config) that only show up when you actually execute it.