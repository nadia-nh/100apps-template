# AGENTS.md - Developer Guide

This document provides guidelines for agents working on this codebase.

## Project Overview

This is a 100-apps challenge project - a collection of 50+ mini React applications deployed on Cloudflare Pages with D1 database support. Each app lives in its own directory under `src/` (e.g., `src/pomodoro-flow/index.tsx`).

## Commands

### Development
```bash
yarn dev          # Start Vite dev server
```

### Building
```bash
yarn build        # TypeScript check + Wrangler Pages build
yarn preview      # Preview production build
yarn deploy       # Build and deploy to Cloudflare Pages
```

### Linting & Formatting
```bash
yarn lint         # Run Biome linter
yarn format       # Format code with Biome
```

### Type Checking
```bash
tsc -b           # Run TypeScript compiler check
```

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** - All TypeScript strict checks are on
- Use `type` for type aliases, `interface` for object shapes
- Use explicit return types for functions where beneficial
- Avoid `any` - use `unknown` if type is truly unknown
- Use `as` casts only when absolutely necessary

### React Patterns
- Use functional components with hooks
- Each app is a standalone component in its own directory
- Export default for the main component
- Co-locate styles using `<style>` tag in component (see examples)
- Use CSS custom properties for theming

### Naming Conventions
- **Files**: kebab-case (e.g., `pomodoro-flow/index.tsx`)
- **Components**: PascalCase (e.g., `PomodoroFlow`)
- **Functions/variables**: camelCase
- **Types/interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE

### Import Order (Biome auto-organizes)
1. React/Node built-ins
2. External libraries (react-router-dom, etc.)
3. Relative imports (./, ../)
4. CSS imports last

### Error Handling
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Handle edge cases explicitly in components
- Use TypeScript type guards when needed
- Wrap potentially failing code in try/catch for async operations

### CSS & Styling
- Use CSS custom properties for colors and spacing
- Use inline styles for dynamic values
- Use `<style>` tag for component-scoped styles
- Follow the existing pattern: dark theme with gradient backgrounds

### Cloudflare Pages Functions
- Place functions in `functions/` directory
- Use Pages Functions signature: `export const onRequest: PagesFunction<Env>`
- Access D1 via `context.env.DB`

### Common Patterns

**State management** - Use useState for local state:
```tsx
const [value, setValue] = useState<Type>(initialValue);
```

**Refs for timers/intervals**:
```tsx
const intervalRef = useRef<number | null>(null);
// Cleanup in useEffect return
```

**Type-safe event handlers**:
```tsx
onChange={(e) => setValue(e.target.value)}
```

**Conditional rendering**:
```tsx
{condition && <Component />}
{condition ? <TrueComponent /> : <FalseComponent />}
```

## Architecture

- `src/App.tsx` - Main router with gallery and app wrapper
- `src/*/` - Individual app directories with index.tsx
- `functions/` - Cloudflare Pages Functions
- `public/` - Static assets

## Key Dependencies

- React 19 with React Router 7
- Vite 7 for bundling
- Biome for linting/formatting
- Wrangler for Cloudflare deployment
- D1 for database (when needed)
