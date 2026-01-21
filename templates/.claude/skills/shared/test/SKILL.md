---
name: test
description: Run tests and analyze results, fix failing tests
user-invocable: true
argument-hint: [test file or pattern]
allowed-tools: Bash, Read, Write, Edit, Glob
---

Run tests and provide detailed analysis of results.

## Process

1. **Detect Test Framework**
   - Check `package.json` for test scripts
   - Look for vitest.config.ts, jest.config.ts, playwright.config.ts

2. **Run Tests**
   ```bash
   # Unit tests
   npm run test -- $ARGUMENTS

   # With coverage
   npm run test -- --coverage $ARGUMENTS

   # E2E tests
   npm run test:e2e -- $ARGUMENTS
   ```

3. **Analyze Results**
   - Parse test output
   - Identify failures
   - Check coverage metrics

4. **Fix Failures** (if requested)
   - Read failing test files
   - Identify the issue
   - Propose fix

## Test Commands by Framework

### Vitest
```bash
npx vitest run              # Run all tests
npx vitest run path/to/test # Run specific test
npx vitest --coverage       # With coverage
```

### Jest
```bash
npx jest                    # Run all tests
npx jest path/to/test       # Run specific test
npx jest --coverage         # With coverage
```

### Playwright
```bash
npx playwright test         # Run all tests
npx playwright test file    # Run specific test
npx playwright test --ui    # Interactive mode
```

## Coverage Requirements
- Domain layer: 100%
- Application layer: 90%
- Components: 80%

## Output Format

```markdown
## Test Results

### Summary
- Total: X tests
- Passed: X
- Failed: X
- Coverage: X%

### Failures
[Details of any failing tests]

### Coverage Gaps
[Files below threshold]

### Recommendations
[Suggestions for improving test coverage]
```

Target: $ARGUMENTS
