---
name: new-page
description: Create a new Next.js App Router page with proper structure
user-invocable: true
argument-hint: [route path, e.g., "dashboard/settings"]
allowed-tools: Write, Read, Glob
---

Create a new Next.js page following App Router conventions.

## Arguments
Route path: $ARGUMENTS

## Process

1. **Parse Route**
   - Extract route segments from argument
   - Identify dynamic segments (e.g., [id])
   - Determine if route group needed

2. **Create Files**
   - page.tsx - Main page component
   - loading.tsx - Loading state
   - error.tsx - Error boundary
   - layout.tsx (if needed)

## File Templates

### page.tsx
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
}

interface PageProps {
  params: Promise<{ /* dynamic params */ }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Page Title</h1>
      {/* Content */}
    </main>
  )
}
```

### loading.tsx
```tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}
```

### error.tsx
```tsx
'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Try again
      </button>
    </div>
  )
}
```

## Checklist
- [ ] Created page.tsx with proper metadata
- [ ] Created loading.tsx for suspense
- [ ] Created error.tsx for error boundary
- [ ] Used Server Component by default
- [ ] Added proper TypeScript types
