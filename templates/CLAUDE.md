# Claude React Agents

Professional Claude Code configuration for React Next.js and React Native Expo projects.

## Project Purpose

This repository provides a complete set of Claude Code agents, skills, hooks, and rules specifically designed for:
- **Web**: React with Next.js (App Router)
- **Mobile**: React Native with Expo

## Architecture Principles

### SOLID Principles

1. **Single Responsibility**: Each component/module has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable for their base types
4. **Interface Segregation**: Many specific interfaces over one general-purpose
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  ← UI Components, Screens
├─────────────────────────────────────────┤
│           Application Layer             │  ← Use Cases, State Management
├─────────────────────────────────────────┤
│             Domain Layer                │  ← Entities, Business Logic
├─────────────────────────────────────────┤
│         Infrastructure Layer            │  ← API, Database, External Services
└─────────────────────────────────────────┘
```

## Code Standards

### TypeScript

- Strict mode enabled always
- Explicit return types for functions
- No `any` type - use `unknown` if type is uncertain
- Prefer interfaces over types for object shapes
- Use discriminated unions for complex state

### Naming Conventions

- **Files**: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- **Components**: PascalCase (e.g., `UserProfile`)
- **Hooks**: camelCase with `use` prefix (e.g., `useUserData`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive suffix (e.g., `UserEntity`, `AuthState`)

### Folder Structure

```
src/
├── app/                    # Next.js App Router / Expo Router
├── components/
│   ├── ui/                 # Atomic UI components
│   └── features/           # Feature-specific components
├── domain/
│   ├── entities/           # Business entities
│   └── repositories/       # Repository interfaces
├── application/
│   ├── use-cases/          # Application use cases
│   └── state/              # State management
├── infrastructure/
│   ├── api/                # API clients
│   ├── storage/            # Local storage
│   └── services/           # External services
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
└── types/                  # Shared TypeScript types
```

## Testing Standards

- Unit tests for domain logic (100% coverage)
- Integration tests for use cases
- Component tests for UI
- E2E tests for critical user flows
- Test file naming: `*.test.ts` or `*.spec.ts`

## Git Workflow

- Feature branches from `main`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
- PR requires passing CI and code review

## Common Commands

### Web (Next.js)
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Mobile (Expo)
- `npx expo start` - Start development
- `npx expo build` - Build app
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Available Agents

See `.claude/agents/` for specialized agents:
- **Shared**: code-reviewer, architect, tester, refactorer
- **Web**: nextjs-developer, api-developer
- **Mobile**: expo-developer, native-module-developer

## Available Skills

See `.claude/skills/` for reusable skills:
- **Shared**: /commit, /review, /test, /refactor
- **Web**: /new-page, /new-api, /new-component
- **Mobile**: /new-screen, /new-feature

## Installation

```bash
# Copy to existing project
cp -r .claude/ /path/to/your/project/
cp CLAUDE.md /path/to/your/project/

# Install recommended skills
npx skills add vercel-labs/agent-skills
npx skills add expo/skills
```
