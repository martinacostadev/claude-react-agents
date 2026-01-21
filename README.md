# Claude React Agents

> Professional Claude Code configuration for React Next.js and React Native Expo projects.

Turn Claude Code into a senior developer with SOLID principles, clean architecture, and production-ready patterns.

---

## Installation

```bash
npx claude-react-agents init
```

That's it. The CLI will auto-detect your project type and install the right configuration.

### Options

| Command | Description |
|---------|-------------|
| `npx claude-react-agents init` | Interactive setup (recommended) |
| `npx claude-react-agents init --web` | Next.js configuration only |
| `npx claude-react-agents init --mobile` | Expo/React Native only |
| `npx claude-react-agents init --yes` | Skip prompts, install both |
| `npx claude-react-agents init --force` | Overwrite existing config |

---

## What You Get

### Agents (AI Specialists)

| Agent | What it does |
|-------|--------------|
| `code-reviewer` | Reviews code for quality, security, SOLID violations |
| `architect` | Designs system architecture, makes tech decisions |
| `tester` | Writes tests, analyzes coverage, fixes failures |
| `refactorer` | Improves code without changing behavior |
| `nextjs-developer` | Next.js App Router, RSC, Server Actions expert |
| `api-developer` | API routes, validation, error handling |
| `expo-developer` | Expo Router, React Native components |
| `native-module-developer` | Custom native modules, EAS Build |

### Skills (Commands)

| Command | What it does |
|---------|--------------|
| `/commit` | Creates conventional commit messages |
| `/review` | Reviews staged changes or specific files |
| `/test` | Runs tests and analyzes results |
| `/new-page` | Creates Next.js page with loading/error states |
| `/new-api` | Creates API route with Zod validation |
| `/new-component` | Creates React component with tests |
| `/new-screen` | Creates Expo screen with navigation |
| `/new-feature` | Creates full feature module (clean architecture) |

### Rules (Auto-Applied)

- **TypeScript**: Strict mode, no `any`, explicit types
- **React**: Hooks rules, performance patterns, composition
- **Next.js**: Server Components, App Router patterns
- **Expo**: Platform-specific code, performance optimization
- **Security**: Input validation, XSS prevention, secrets protection
- **Testing**: AAA pattern, Testing Library best practices

---

## Architecture

The configuration enforces **Clean Architecture**:

```
src/
├── app/                 # Routes (Next.js/Expo Router)
├── components/
│   ├── ui/              # Design system
│   └── features/        # Feature components
├── domain/
│   ├── entities/        # Business objects
│   └── repositories/    # Interfaces
├── application/
│   ├── use-cases/       # Business logic
│   └── state/           # State management
├── infrastructure/
│   ├── api/             # API clients
│   └── storage/         # Persistence
├── hooks/               # Custom hooks
└── types/               # Shared types
```

And **SOLID Principles**:
- **S**ingle Responsibility - One reason to change
- **O**pen/Closed - Extend, don't modify
- **L**iskov Substitution - Subtypes are substitutable
- **I**nterface Segregation - Small, focused interfaces
- **D**ependency Inversion - Depend on abstractions

---

## Customization

### Add Your Own Rules

Create `.claude/rules/my-rule.md`:

```yaml
---
paths:
  - "src/my-folder/**"
---

# My Custom Rule

Your instructions here...
```

### Add Your Own Skills

Create `.claude/skills/my-skill/SKILL.md`:

```yaml
---
name: my-skill
description: What this does
allowed-tools: Read, Write, Bash
---

Instructions for Claude...
```

### Local Overrides

```bash
cp .claude/settings.local.json.example .claude/settings.local.json
```

Edit for your environment. This file is gitignored.

---

## Post-Install (Optional)

Add community skills:

```bash
# Next.js
npx skills add vercel-labs/agent-skills

# Expo
npx skills add expo/skills
```

---

## Security

Built-in protections:
- Blocks modification of `.env`, secrets, credentials
- Prevents `rm -rf`, `sudo`, force pushes
- Auto-formats code on save
- Validates file paths before edits

---

## Update

```bash
npx claude-react-agents@latest init --force
```

---

## License

MIT

---

**Built for developers who want AI that codes like a senior engineer.**
