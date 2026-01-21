---
paths:
  - "app/**/*.tsx"
  - "src/**/*.tsx"
---

# Expo / React Native Standards

## Component Structure

### Screen Components
```tsx
import { View, StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Screen' }} />
      <View style={styles.content}>
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
  content: {
    flex: 1,
    padding: 16,
  },
})
```

## Styling Rules

### Use StyleSheet.create
```tsx
// Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

// Bad - recreated every render
<View style={{ flex: 1 }} />
```

### Avoid Inline Styles
- Exception: Dynamic values that change frequently
- Use StyleSheet for static styles
- Consider NativeWind for Tailwind-like DX

## Navigation

### Expo Router Patterns
```tsx
// Navigate
import { router } from 'expo-router'

router.push('/profile')
router.replace('/home')
router.back()

// With params
router.push({
  pathname: '/user/[id]',
  params: { id: '123' }
})

// Read params
import { useLocalSearchParams } from 'expo-router'

const { id } = useLocalSearchParams<{ id: string }>()
```

### Deep Linking
- Configure in `app.json` or `app.config.ts`
- Test on both platforms
- Handle universal links properly

## Performance

### List Optimization
```tsx
// Good - use FlashList for long lists
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  estimatedItemSize={80}
/>

// Bad - FlatList for very long lists
<FlatList data={items} />
```

### Image Optimization
```tsx
// Good - use expo-image
import { Image } from 'expo-image'

<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  placeholder={blurhash}
  transition={200}
/>
```

### Heavy Computations
```tsx
// Move to separate thread
import { runOnJS } from 'react-native-reanimated'

// Or use InteractionManager
import { InteractionManager } from 'react-native'

InteractionManager.runAfterInteractions(() => {
  // Heavy computation
})
```

## Platform-Specific Code

### File-based
```
Component.tsx        # Shared
Component.ios.tsx    # iOS only
Component.android.tsx # Android only
Component.web.tsx    # Web only
```

### Runtime
```tsx
import { Platform } from 'react-native'

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
})
```

## Forbidden Patterns

- Using deprecated `<ListView>`
- Not handling keyboard (KeyboardAvoidingView)
- Blocking JS thread with heavy computations
- Large images without optimization
- Synchronous AsyncStorage operations
- Not testing on both platforms
- Missing safe area handling
