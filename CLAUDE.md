<!-- Add project-specific facts here. -->

## Conventions (via mise)

<!-- mise:plugins:start -->

This project uses mise's coding conventions, installed as Claude Code
plugins. Invoke a skill as `/<plugin>:<skill>`, or let Claude reach for it
automatically.

- **typescript**
  - `conventions` — Type declaration style, enums, any/unknown and Array<T> - stated TypeScript preferences, split between what ESLint enforces and what needs judgment
  - `setup` — Install and wire up @pindakaasman/tsconfig, @pindakaasman/eslint-config and @pindakaasman/prettier-config in the current project, and migrate existing code onto the TypeScript conventions
- **architecture**
  - `data-flow` — Reads and writes both through tRPC, loading/error state threaded explicitly through props, and Context reserved for values that never change
  - `design-system` — The published @pindakaasman/design-system package - a typed, breakpoint-aware accessor over theme tokens with light/dark color modes - and how it's scaffolded and provided as the styled-components theme - see /Users/ramon/.claude/plugins/marketplaces/mise/packages/design-system/README.md
  - `folder-structure` — Where things live - atomic design layout, component/hook/util folder shapes, and app-level providers
  - `functional-style` — General code-style preferences - arrow functions, array methods over loops, composition, early returns
  - `module-boundaries` — What's public vs. private - component/package import boundaries and the one-way atomic tier dependency direction
  - `setup` — Scaffold and migrate the current project onto the atomic folder structure and the design-system theme, and audit existing code against the functional-style, state, module-boundary and data-flow conventions
  - `state-management` — Jotai vs Zustand, where client state lives relative to [[folder-structure]], and keeping server-cache data out of it
  - `styling` — styled-components conventions - the SSR registry and the Server/Client Component boundary. See [[design-system]] for how theme tokens are structured and accessed.
- **react**
  - `component-patterns` — Loading/empty/loaded branching, and when a render-body helper should be a real subcomponent instead
  - `setup` — Audit existing components against component-patterns and migrate violations - no install, no scaffold
- **testing**
  - `conventions` — Which tool tests what - Vitest for pure logic, Storybook for component behavior, Playwright for e2e user tasks
  - `setup` — Install Vitest always, Storybook and Playwright only when the project actually has a UI or pages to exercise, and migrate misplaced tests
- **verification**
  - `conventions` — What to run to verify a change and when - related tests while developing, the pre-commit gate before every commit, e2e/Storybook when a change touches them, and how to handle a failing check
  - `setup` — Install husky + lint-staged as the pre-commit gate (format, lint, typecheck, full test suite) and add the standard verification scripts

Re-run `/init:setup` after installing or updating a mise plugin to refresh
this section.
<!-- mise:plugins:end -->
