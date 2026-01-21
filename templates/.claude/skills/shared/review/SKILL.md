---
name: review
description: Review code changes for quality, security, and best practices
user-invocable: true
argument-hint: [file path or PR number]
allowed-tools: Read, Glob, Grep, Bash
---

Review code changes following senior developer standards.

## Review Process

1. **Gather Context**
   - If PR number provided, run `gh pr view $ARGUMENTS --json files,body`
   - If file path provided, read the file
   - If nothing provided, run `git diff` for unstaged changes

2. **Analyze Changes**
   - Check for SOLID principle violations
   - Look for security issues
   - Identify performance concerns
   - Review TypeScript types
   - Check test coverage

3. **Generate Report**

## Review Checklist

### Code Quality
- [ ] Clear, descriptive naming
- [ ] Functions under 50 lines
- [ ] No code duplication
- [ ] Proper error handling

### TypeScript
- [ ] No `any` types
- [ ] Explicit return types
- [ ] Proper null handling

### React Patterns
- [ ] Hooks rules followed
- [ ] Proper dependency arrays
- [ ] No unnecessary re-renders

### Security
- [ ] Input validation
- [ ] No XSS vulnerabilities
- [ ] No exposed secrets

## Output Format

```markdown
## Code Review Summary

### Overview
[Brief description of changes]

### Strengths
- [What's done well]

### Issues
#### Critical
- [Must fix before merge]

#### Suggestions
- [Recommended improvements]

### Security
[Any security concerns]
```

Target: $ARGUMENTS
