---
name: new-component
description: Create a new React component with TypeScript and tests
user-invocable: true
argument-hint: [ComponentName]
allowed-tools: Write, Read, Glob
---

Create a new React component following project conventions.

## Arguments
Component name: $ARGUMENTS

## Process

1. **Determine Location**
   - Check if UI component (src/components/ui/)
   - Check if feature component (src/components/features/)
   - Ask if unclear

2. **Create Files**
   - ComponentName.tsx - Component implementation
   - ComponentName.test.tsx - Unit tests
   - index.ts - Barrel export

## File Templates

### ComponentName.tsx
```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface ComponentNameProps extends ComponentPropsWithoutRef<'div'> {
  /** Description of variant prop */
  variant?: 'default' | 'primary' | 'secondary'
  /** Description of size prop */
  size?: 'sm' | 'md' | 'lg'
}

const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          {
            'variant-default': variant === 'default',
            'variant-primary': variant === 'primary',
            'variant-secondary': variant === 'secondary',
          },
          {
            'size-sm': size === 'sm',
            'size-md': size === 'md',
            'size-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'

export { ComponentName }
```

### ComponentName.test.tsx
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders children correctly', () => {
    render(<ComponentName>Test content</ComponentName>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<ComponentName data-testid="component">Content</ComponentName>)
    expect(screen.getByTestId('component')).toHaveClass('variant-default')
  })

  it('applies custom variant styles', () => {
    render(<ComponentName data-testid="component" variant="primary">Content</ComponentName>)
    expect(screen.getByTestId('component')).toHaveClass('variant-primary')
  })

  it('applies size classes', () => {
    render(<ComponentName data-testid="component" size="lg">Content</ComponentName>)
    expect(screen.getByTestId('component')).toHaveClass('size-lg')
  })

  it('merges custom className', () => {
    render(<ComponentName data-testid="component" className="custom-class">Content</ComponentName>)
    expect(screen.getByTestId('component')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<ComponentName ref={ref}>Content</ComponentName>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
```

### index.ts
```ts
export { ComponentName, type ComponentNameProps } from './ComponentName'
```

## Checklist
- [ ] Created component with TypeScript props interface
- [ ] Used forwardRef for DOM element components
- [ ] Added displayName
- [ ] Created comprehensive tests
- [ ] Added barrel export
- [ ] Documented props with JSDoc
