---
name: commit
description: Create a well-formatted conventional commit with proper message
user-invocable: true
argument-hint: [commit type or description]
allowed-tools: Bash
---

Create a git commit following conventional commits specification.

## Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding tests
- `docs`: Documentation
- `style`: Formatting (no code change)
- `perf`: Performance improvement
- `chore`: Maintenance tasks

## Process

1. Run `git status` to see changes
2. Run `git diff --staged` to review staged changes
3. If no staged changes, suggest files to stage
4. Generate commit message based on changes:
   - Use conventional commit format: `type(scope): description`
   - Keep subject line under 72 characters
   - Use imperative mood ("add" not "added")
   - Include body for complex changes

## Commit Message Format

```
type(scope): short description

[optional body with more details]

[optional footer with breaking changes or issue references]
```

## Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth2 login with Google provider"

# Bug fix
git commit -m "fix(api): handle null response from external service"

# Refactor
git commit -m "refactor(hooks): extract useAuth logic into separate hook"
```

If argument provided: $ARGUMENTS
