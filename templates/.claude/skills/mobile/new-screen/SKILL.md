---
name: new-screen
description: Create a new Expo Router screen with proper structure
user-invocable: true
argument-hint: [screen path, e.g., "profile" or "(tabs)/settings"]
allowed-tools: Write, Read, Glob
---

Create a new Expo Router screen following project conventions.

## Arguments
Screen path: $ARGUMENTS

## Process

1. **Parse Route**
   - Extract route segments
   - Identify if tab, modal, or regular screen
   - Determine if dynamic route ([id])

2. **Create Files**
   - screen.tsx - Screen component
   - _layout.tsx (if needed for group)

## File Templates

### Regular Screen
```tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ScreenName() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Screen Title',
          headerShown: true,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Screen Title</Text>
        {/* Content */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
})
```

### Dynamic Route Screen ([id].tsx)
```tsx
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  // TODO: Fetch data based on id
  const isLoading = false
  const data = null

  if (isLoading) {
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
          title: 'Detail',
          headerShown: true,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>ID: {id}</Text>
        {/* Content */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
})
```

### Tab Layout (_layout.tsx for tabs)
```tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type IconName = keyof typeof Ionicons.glyphMap

interface TabConfig {
  name: string
  title: string
  icon: IconName
  iconFocused: IconName
}

const tabs: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'search', title: 'Search', icon: 'search-outline', iconFocused: 'search' },
  { name: 'profile', title: 'Profile', icon: 'person-outline', iconFocused: 'person' },
]

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
```

### Modal Screen
```tsx
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          presentation: 'modal',
          title: 'Modal Title',
          headerRight: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#007AFF" />
            </Pressable>
          ),
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Modal Content</Text>
        {/* Content */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
})
```

## Checklist
- [ ] Created screen component
- [ ] Added Stack.Screen options
- [ ] Used SafeAreaView appropriately
- [ ] Added loading state if data fetching
- [ ] Used StyleSheet.create for styles
- [ ] Added proper TypeScript types
