---
name: new-api
description: Create a new Next.js API route handler with validation
user-invocable: true
argument-hint: [api route path, e.g., "users" or "posts/[id]"]
allowed-tools: Write, Read, Glob
---

Create a new Next.js API route handler following REST conventions.

## Arguments
API route path: $ARGUMENTS

## Process

1. **Parse Route**
   - Determine if CRUD endpoint or single action
   - Identify dynamic parameters
   - Determine HTTP methods needed

2. **Create Files**
   - route.ts - Route handler
   - schema.ts - Zod validation schemas (optional)

## File Templates

### route.ts (Collection - /api/resource)
```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schemas
const createSchema = z.object({
  name: z.string().min(1).max(255),
  // Add fields
})

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
})

// Types
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: { code: string; message: string; details?: unknown }
  meta?: { page: number; limit: number; total: number }
}

// GET - List all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    // TODO: Implement fetch logic
    const items: unknown[] = []
    const total = 0

    return NextResponse.json<ApiResponse<unknown[]>>({
      success: true,
      data: items,
      meta: { page: query.page, limit: query.limit, total },
    })
  } catch (error) {
    return handleError(error)
  }
}

// POST - Create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createSchema.parse(body)

    // TODO: Implement create logic
    const created = { id: '1', ...validated }

    return NextResponse.json<ApiResponse<unknown>>(
      { success: true, data: created },
      { status: 201 }
    )
  } catch (error) {
    return handleError(error)
  }
}

// Error handler
function handleError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof z.ZodError) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        },
      },
      { status: 400 }
    )
  }

  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
    },
    { status: 500 }
  )
}
```

### route.ts (Single Item - /api/resource/[id])
```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  // Add fields
})

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // TODO: Implement fetch logic
    const item = { id }

    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    return handleError(error)
  }
}

// PUT - Update
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = updateSchema.parse(body)

    // TODO: Implement update logic
    const updated = { id, ...validated }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return handleError(error)
  }
}

// DELETE - Delete
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // TODO: Implement delete logic

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    return handleError(error)
  }
}

function handleError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid data', details: error.errors } },
      { status: 400 }
    )
  }

  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
    { status: 500 }
  )
}
```

## Checklist
- [ ] Created route.ts with proper handlers
- [ ] Added Zod validation schemas
- [ ] Implemented error handling
- [ ] Used consistent response format
- [ ] Added proper TypeScript types
