# TypeScript Style Guide

## Naming Conventions

- **Variables/functions:** camelCase (`getUserData`, `totalCalories`)
- **Classes/components:** PascalCase (`FoodEntry`, `CalorieDashboard`)
- **Interfaces:** PascalCase, no prefix (`FoodEntry`, `UserProfile`)
- **Types:** PascalCase, use `type` over `interface` for unions/utility types
- **Constants:** UPPER_SNAKE_CASE only for truly immutable magic values (`MAX_CALORIES`)
- **Files:** camelCase for utilities (`formatDate.ts`), PascalCase for components (`CalorieRing.tsx`)
- **Booleans:** Prefix with `is`, `has`, `should` (`isLoading`, `hasData`)

## Imports

- Group imports: 1) built-in/node, 2) external libs, 3) internal aliases (`@/`), 4) relative
- Use `@/` path aliases for all project imports. Avoid deep relative paths (`../../`).
- Import types explicitly: `import type { FoodEntry } from "./types"`

## Types

- Prefer explicit return types on public functions and server actions
- Use `unknown` instead of `any` when type is truly uncertain
- Use `Record<string, T>` over index signatures for dictionaries
- Use const assertions for literal types: `as const`
- Leverage `satisfies` operator for type validation without widening

## Best Practices

- `strict: true` in tsconfig (already configured)
- No `@ts-ignore` — use `@ts-expect-error` with a comment explaining why
- Use optional chaining (`?.`) and nullish coalescing (`??`) over `&&` for optional access
- Use `Promise.all` for parallel async operations
- Prefer `for...of` over `.forEach` for async operations
- Use `as` assertions sparingly and only when you have a guarantee the type is correct
