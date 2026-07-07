import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';

export function PostsScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Posts" />
        <EmptyState
          icon="grid-outline"
          title="No posts yet"
          description="Share your first moment when you're ready — it'll show up here."
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
