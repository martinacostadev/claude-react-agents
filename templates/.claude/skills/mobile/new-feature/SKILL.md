---
name: new-feature
description: Create a complete feature module for Expo with screen, components, hooks, and services
user-invocable: true
argument-hint: [feature name, e.g., "user-profile"]
allowed-tools: Write, Read, Glob
---

Create a complete feature module following clean architecture.

## Arguments
Feature name: $ARGUMENTS

## Process

1. **Analyze Feature**
   - Determine required screens
   - Identify data requirements
   - Plan state management

2. **Create Structure**
   ```
   src/
   ├── app/
   │   └── (feature)/         # Feature route group
   │       ├── _layout.tsx
   │       └── index.tsx
   ├── components/
   │   └── features/
   │       └── feature-name/  # Feature components
   ├── domain/
   │   └── entities/
   │       └── FeatureEntity.ts
   ├── application/
   │   ├── use-cases/
   │   │   └── featureUseCases.ts
   │   └── state/
   │       └── useFeatureStore.ts
   └── infrastructure/
       └── api/
           └── featureApi.ts
   ```

## File Templates

### Entity (domain/entities/FeatureEntity.ts)
```ts
export interface FeatureEntity {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateFeatureInput {
  name: string
}

export interface UpdateFeatureInput {
  name?: string
}
```

### Repository Interface (domain/repositories/featureRepository.ts)
```ts
import type { FeatureEntity, CreateFeatureInput, UpdateFeatureInput } from '../entities/FeatureEntity'

export interface FeatureRepository {
  findAll(): Promise<FeatureEntity[]>
  findById(id: string): Promise<FeatureEntity | null>
  create(input: CreateFeatureInput): Promise<FeatureEntity>
  update(id: string, input: UpdateFeatureInput): Promise<FeatureEntity>
  delete(id: string): Promise<void>
}
```

### API Implementation (infrastructure/api/featureApi.ts)
```ts
import type { FeatureEntity, CreateFeatureInput, UpdateFeatureInput } from '@/domain/entities/FeatureEntity'
import type { FeatureRepository } from '@/domain/repositories/featureRepository'
import { apiClient } from './client'

export const featureApi: FeatureRepository = {
  async findAll() {
    const response = await apiClient.get<{ data: FeatureEntity[] }>('/features')
    return response.data
  },

  async findById(id) {
    const response = await apiClient.get<{ data: FeatureEntity }>(`/features/${id}`)
    return response.data
  },

  async create(input) {
    const response = await apiClient.post<{ data: FeatureEntity }>('/features', input)
    return response.data
  },

  async update(id, input) {
    const response = await apiClient.put<{ data: FeatureEntity }>(`/features/${id}`, input)
    return response.data
  },

  async delete(id) {
    await apiClient.delete(`/features/${id}`)
  },
}
```

### Zustand Store (application/state/useFeatureStore.ts)
```ts
import { create } from 'zustand'
import type { FeatureEntity } from '@/domain/entities/FeatureEntity'
import { featureApi } from '@/infrastructure/api/featureApi'

interface FeatureState {
  items: FeatureEntity[]
  selectedItem: FeatureEntity | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchAll: () => Promise<void>
  fetchById: (id: string) => Promise<void>
  create: (name: string) => Promise<void>
  update: (id: string, name: string) => Promise<void>
  remove: (id: string) => Promise<void>
  clearError: () => void
}

export const useFeatureStore = create<FeatureState>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await featureApi.findAll()
      set({ items, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch items', isLoading: false })
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const item = await featureApi.findById(id)
      set({ selectedItem: item, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch item', isLoading: false })
    }
  },

  create: async (name) => {
    set({ isLoading: true, error: null })
    try {
      const newItem = await featureApi.create({ name })
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to create item', isLoading: false })
    }
  },

  update: async (id, name) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await featureApi.update(id, { name })
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updated : item)),
        selectedItem: state.selectedItem?.id === id ? updated : state.selectedItem,
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to update item', isLoading: false })
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await featureApi.delete(id)
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to delete item', isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
```

### Screen Component (app/(feature)/index.tsx)
```tsx
import { useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native'
import { Stack, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFeatureStore } from '@/application/state/useFeatureStore'
import { FeatureListItem } from '@/components/features/feature-name/FeatureListItem'

export default function FeatureListScreen() {
  const { items, isLoading, error, fetchAll } = useFeatureStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Features',
          headerRight: () => (
            <Pressable onPress={() => router.push('/feature/create')}>
              <Text style={styles.addButton}>Add</Text>
            </Pressable>
          ),
        }}
      />
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeatureListItem item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 16, color: '#8E8E93' },
  errorBanner: { backgroundColor: '#FF3B30', padding: 12 },
  errorText: { color: '#ffffff', textAlign: 'center' },
  addButton: { color: '#007AFF', fontSize: 17 },
})
```

## Checklist
- [ ] Created entity and repository interface
- [ ] Created API implementation
- [ ] Created Zustand store
- [ ] Created screen components
- [ ] Added loading and error states
- [ ] Used clean architecture layers
