import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';

export function NotificationsScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Notifications" showBell={false} />
        <EmptyState
          icon="notifications-outline"
          title="You're all caught up"
          description="We'll let you know when something new happens."
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
