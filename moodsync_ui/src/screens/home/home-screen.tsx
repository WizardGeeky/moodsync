import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export function HomeScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar
          showBack={false}
          showProfile
          hasUnread={false}
          showStreak
          streakCount={0}
          showCoins
          coinCount={0}
        />
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>Welcome back 👋</Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            How are you feeling today?
          </Text>
        </View>
        <EmptyState
          icon="pulse-outline"
          title="Your feed is quiet"
          description="Posts from you and the people you connect with will show up here."
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.two,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
  },
  subGreeting: {
    fontSize: 14,
    marginTop: Spacing.half,
  },
});
