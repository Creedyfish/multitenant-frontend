# Project Context Template for AI Models

This document provides comprehensive context about the project structure, tech stack, and architecture. Share this with AI models to help them understand the codebase quickly and make better decisions.

---

## Project Overview

**Project Name:** multitenant-frontend

**Description:** A modern, full-stack React application built with TanStack Start for server-side rendering and client-side interactivity. This is a multitenant SaaS frontend with comprehensive integrations for forms, data fetching, error tracking, and component development.

**Primary Language:** TypeScript (React)

---

## Tech Stack

### Core Framework

- **TanStack Start** (^1.132.0) - Full-stack React framework with file-based routing
- **React** (^19.2.0) - UI library
- **React DOM** (^19.2.0) - React rendering engine
- **TypeScript** (^5.7.2) - Type safety

### State Management & Forms

- **TanStack React Query** (^5.66.5) - Server state management, caching, data fetching
- **TanStack React Form** (^1.0.0) - Form state management with validation
- **TanStack React Store** (^0.9.1) - Client-side state management
- **TanStack Store** (^0.9.1) - Core store library

### Data & Validation

- **Zod** (^4.1.11) - TypeScript-first schema validation
- **TanStack React Table** (^8.21.2) - Headless table component
- **@faker-js/faker** (^10.0.0) - Fake data generation for development

### Routing

- **TanStack React Router** (^1.132.0) - File-based routing
- **TanStack Router Plugin** (^1.132.0) - Vite plugin for router
- **TanStack React Router SSR Query** (^1.131.7) - SSR support for queries

### Styling

- **Tailwind CSS** (^4.1.18) - Utility-first CSS framework
- **@tailwindcss/vite** (^4.1.18) - Vite plugin for Tailwind
- **@tailwindcss/typography** (^0.5.16) - Typography plugin
- **prettier-plugin-tailwindcss** (^0.7.2) - Tailwind class sorting

### Error Tracking & Monitoring

- **@sentry/tanstackstart-react** (^10.34.0) - Sentry error tracking and monitoring

### Component Development

- **Storybook** (^10.1.10) - Component documentation and development
- **@storybook/react-vite** (^10.1.10) - Storybook React Vite plugin

### Development Tools

- **Devtools Suite:**
  - @tanstack/react-devtools (^0.7.0)
  - @tanstack/react-query-devtools (^5.84.2)
  - @tanstack/react-router-devtools (^1.132.0)
  - @tanstack/devtools-vite (^0.3.11)
  - @tanstack/devtools-event-client (^0.4.0)
- **Lucide React** (^0.545.0) - Icon library

### Code Quality

- **ESLint** - Linting (uses @tanstack/eslint-config)
- **Prettier** (^3.8.1) - Code formatting
- **Vitest** (^3.0.5) - Unit testing

### Environment & Build

- **@t3-oss/env-core** (^0.13.8) - Type-safe environment variables
- **Vite** (^7.1.7) - Build tool and dev server
- **vite-tsconfig-paths** (^5.1.4) - TypeScript path support
- **dotenv-cli** (^11.0.0) - Environment variable management
- **@vitejs/plugin-react** (^5.0.4) - React Vite plugin
- **babel-plugin-react-compiler** (^1.0.0) - React compiler

### Testing Libraries

- **@testing-library/react** (^16.2.0) - React testing utilities
- **@testing-library/dom** (^10.4.0) - DOM testing utilities
- **jsdom** (^27.0.0) - DOM implementation for testing

---

## Project Structure

```
multitenant-frontend/
├── public/                           # Static assets
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/                   # Reusable React components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── demo.FormComponents.tsx
│   │   └── storybook/                # Storybook component stories
│   │       ├── button.tsx & button.stories.ts
│   │       ├── dialog.tsx & dialog.stories.tsx
│   │       ├── input.tsx & input.stories.ts
│   │       ├── radio-group.tsx & radio-group.stories.ts
│   │       ├── slider.tsx & slider.stories.ts
│   │       └── index.ts
│   ├── data/                         # Static data and seeds
│   │   └── demo-table-data.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── demo.form.ts              # Forms using TanStack Forms
│   │   └── demo.form-context.ts
│   ├── integrations/                 # Third-party integrations
│   │   └── tanstack-query/
│   │       ├── devtools.tsx
│   │       └── root-provider.tsx
│   ├── lib/                          # Utility functions and helpers
│   │   ├── demo-store.ts             # TanStack Store setup
│   │   └── demo-store-devtools.tsx
│   ├── routes/                       # TanStack Router file-based routes
│   │   ├── __root.tsx                # Root layout
│   │   ├── index.tsx                 # Home page
│   │   ├── about.tsx
│   │   ├── api/
│   │   │   └── tunnel.ts             # API routes
│   │   └── demo/
│   │       ├── form.simple.tsx       # Form demo
│   │       ├── form.address.tsx
│   │       ├── store.tsx             # State management demo
│   │       ├── table.tsx             # TanStack Table demo
│   │       ├── tanstack-query.tsx    # Query demo
│   │       ├── storybook.tsx
│   │       └── sentry.testing.tsx    # Error tracking demo
│   ├── env.ts                        # Type-safe environment config
│   ├── router.tsx                    # Router setup
│   ├── routeTree.gen.ts              # Generated route tree
│   ├── server.ts                     # Server configuration
│   ├── start.ts                      # Entry point
│   └── styles.css                    # Global styles with Tailwind
├── eslint.config.js                  # ESLint configuration
├── prettier.config.js                # Prettier configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
├── package.json                      # Dependencies and scripts
├── instrument.server.mjs             # Server instrumentation (Sentry)
└── README.md                         # Project documentation
```

---

## Key Features & Patterns

### 1. File-Based Routing (TanStack Router)

- Routes are located in `src/routes/` as `.tsx` files
- The `__root.tsx` file defines the root layout
- Dynamic routes use brackets, e.g., `[userId].tsx`
- API routes are defined with `server` property in route definitions

### 2. Form Management (TanStack Forms + Zod)

- Forms use `@tanstack/react-form` with Zod validation
- Custom hook `useAppForm` wraps form logic
- Located in: `src/hooks/demo.form.ts`
- Example: `src/routes/demo/form.simple.tsx`

### 3. Data Fetching (TanStack Query)

- Server state is managed with TanStack Query
- Devtools are integrated for debugging queries
- Example: `src/routes/demo/tanstack-query.tsx`

### 4. State Management

- Client-side state: TanStack Store (`src/lib/demo-store.ts`)
- Server state: TanStack Query
- Form state: TanStack Forms

### 5. Table Component

- Uses TanStack Table (headless table)
- Features: sorting, filtering, pagination
- Example: `src/routes/demo/table.tsx`

### 6. Error Tracking

- Sentry integration for production monitoring
- Configuration: `instrument.server.mjs`
- Demo: `src/routes/demo/sentry.testing.tsx`

### 7. Component Development

- Storybook for isolated component development
- Stories located in: `src/components/storybook/`
- Run with: `npm run storybook`

---

## Scripts

| Script                    | Purpose                               |
| ------------------------- | ------------------------------------- |
| `npm run dev`             | Start development server on port 3000 |
| `npm run build`           | Build for production                  |
| `npm run preview`         | Preview production build              |
| `npm run test`            | Run tests with Vitest                 |
| `npm run start`           | Start production server               |
| `npm run storybook`       | Start Storybook on port 6006          |
| `npm run build-storybook` | Build Storybook                       |
| `npm run lint`            | Run ESLint                            |
| `npm run format`          | Check code formatting                 |
| `npm run check`           | Format and lint fix                   |

---

## Environment Variables

Configure these in `.env.local`:

```bash
# Sentry error tracking
VITE_SENTRY_DSN=your-sentry-dsn-here

# Other app-specific variables
VITE_APP_TITLE=Your App Title
```

Type-safe environment variables are defined in `src/env.ts` using `@t3-oss/env-core`.

---

## Development Workflow

### Setup

```bash
npm install
npm run dev
```

### Code Quality

```bash
npm run lint           # Check for linting issues
npm run format         # Check formatting
npm run check          # Fix all issues
```

### Testing

```bash
npm run test            # Run tests
```

### Component Development

```bash
npm run storybook      # Develop components in isolation
```

### Production Build

```bash
npm run build          # Create optimized build
npm run start          # Run production server
```

---

## Important Conventions

### Demo Files

Files prefixed with `demo` (e.g., `demo.form.ts`, `demo.FormComponents.tsx`) are provided as examples and can be safely deleted when setting up the actual application.

### Naming Conventions

- Components: PascalCase (e.g., `Header.tsx`, `ThemeToggle.tsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useAppForm`)
- Files: kebab-case for utilities (e.g., `demo-store.ts`)
- Routes: kebab-case (e.g., `form.simple.tsx`)

### Type Safety

- All code is written in TypeScript
- Environment variables are type-safe via `src/env.ts`
- Form validation uses Zod schemas
- TanStack Query operations are fully typed

---

## Integration Points for AI Models

When working with this codebase, AI models should be aware of:

1. **File-based routing**: All routes are in `src/routes/`. Adding a new route is as simple as creating a new `.tsx` file.
2. **Type safety**: The project extensively uses TypeScript and Zod. Always provide types for new code.
3. **State management layering**: Keep server state (API data) in TanStack Query and client state in TanStack Store.
4. **Styling**: Use Tailwind CSS utility classes. The prettierrc plugin will automatically sort classes.
5. **Error handling**: Use Sentry for production errors. Errors in route components are automatically captured.
6. **Component isolation**: New UI components should have accompanying Storybook stories.
7. **Testing**: Write tests for business logic and complex components using Vitest and Testing Library.

---

## Related Documentation

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Forms](https://tanstack.com/form/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [TanStack Store](https://tanstack.com/store/latest)
- [Sentry Documentation](https://docs.sentry.io/)
- [Storybook](https://storybook.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod Validation](https://zod.dev/)

---

## Tips for AI Models

When prompting AI models about this project:

1. **Provide this file**: Reference this context file when asking for changes
2. **Be specific about location**: Mention route names or component paths
3. **State management queries**: Specify whether data is server-state (Query) or client-state (Store)
4. **Type requirements**: Always request types to be included
5. **Testing expectations**: Clarify if tests should be updated/created
6. **Styling approach**: Confirm the use of Tailwind CSS for any UI changes

---

_Last Updated: March 3, 2026_
