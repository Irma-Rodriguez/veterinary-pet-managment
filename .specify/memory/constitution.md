# Veterinary Pet Management Constitution

Governing principles for a web application for managing pets, veterinarians, and appointments. Structure based on the Spec-Kit v0.0.90 constitution template.

## Core Principles

### I. Strict TypeScript

- `strict` mode stays enabled in `tsconfig.json`.
- `any` is not allowed. Use precise types, or `unknown` with narrowing, for untrusted data.
- Anything received from a request is validated on the server before use.

### II. Utility-First Tailwind

- Style with Tailwind CSS utility classes in the markup.
- Custom CSS is added to `app/globals.css` only when utilities cannot express it, such as theme tokens.
- Every view must be responsive, starting from mobile widths.

### III. Next.js App Router Patterns

- Routes are file-based, under `app/`. API endpoints are Route Handlers in `route.ts` files under `app/api/`.
- Components are Server Components by default. Add `"use client"` only for state, effects, or browser APIs, and keep client components as small as possible.
- Request-time logic that runs before a route renders, such as auth redirects, goes in `proxy.ts`. The `middleware` convention is deprecated in the installed Next.js version.
- Team members check the docs in `node_modules/next/dist/docs/` for the installed version, because it may differ from older tutorials.

### IV. Testing and Quality Gates

- `npm run lint`, `npm run format:check`, and `npm run build` must pass before a pull request is merged.
- Each pull request is checked against the acceptance scenarios of the user story it implements.
- Automated tests are expected for authentication, authorization, and data-validation logic once a test framework is chosen. [NEEDS CLARIFICATION: test framework not selected]

### V. Simplicity (MVP First)

- Build only what the current user story needs. Prefer a simple solution that can be adjusted later.
- New dependencies must solve a current problem and be mentioned in the pull request description.

## Naming Conventions

| Item                                          | Convention                     | Example                |
| --------------------------------------------- | ------------------------------ | ---------------------- |
| Components and their files                    | `PascalCase`                   | `PetCard.tsx`          |
| Variables, functions, and non-component files | `camelCase`                    | `formatDate.ts`        |
| Route folders                                 | `kebab-case`                   | `app/my-pets/page.tsx` |
| Types and interfaces                          | `PascalCase`                   | `Appointment`          |
| Constants                                     | `UPPER_SNAKE_CASE`             | `MAX_PETS_PER_PAGE`    |
| Database tables                               | `snake_case`, plural           | `appointments`         |
| Git branches                                  | `feature/<task>`, `fix/<task>` | `feature/user-auth`    |

## Team Collaboration

- `main` is protected: no direct pushes.
- All work happens on a feature branch named after its feature or task.
- Pull requests are required to merge into `main` and need approval from at least one other team member.
- Each pull request links its GitHub issue, and work is tracked on the team's GitHub Project Board.
- Code is formatted with the shared `.prettierrc` (`npm run format`) and linted with ESLint (`npm run lint`).
- Secrets are never committed. Local values go in `.env*` files, which are ignored by Git.

## Governance

This constitution takes priority over individual preferences. Reviewers check that pull requests follow it. Changes are proposed by pull request and need agreement from the team.

**Version**: 0.1.0 (draft, pending team review) | **Ratified**: pending team review | **Last Amended**: 2026-11-05
