import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SettingRowData = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
};

const ACCOUNT_ROWS: SettingRowData[] = [
  { icon: 'person-outline', label: 'Edit Profile' },
  { icon: 'lock-closed-outline', label: 'Privacy' },
];

const SUPPORT_ROWS: SettingRowData[] = [
  { icon: 'help-circle-outline', label: 'Help Center' },
  { icon: 'information-circle-outline', label: 'About MoodSync' },
];

function SettingsRow({ icon, label, onPress }: SettingRowData & { onPress?: () => void }) {
  const { colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.98);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.row, animatedStyle]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceBorder }]}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </AnimatedPressable>
  );
}

function ThemeRow() {
  const router = useRouter();
  const { theme, colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.98);

  return (
    <AnimatedPressable
      onPress={() => router.push('/theme-picker')}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.row, animatedStyle]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceBorder }]}>
        <Ionicons name="color-palette-outline" size={18} color={colors.text} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text }]}>Theme</Text>
      <View style={[styles.swatchDot, { backgroundColor: theme.swatch[0] }]} />
      <Text style={[styles.rowValue, { color: colors.textMuted }]}>{theme.name}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </AnimatedPressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  const { colors } = useAppTheme();
  return <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{children}</Text>;
}

export function SettingsScreen() {
  const router = useRouter();
  const { theme, colors } = useAppTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { animatedStyle: logoutStyle, onPressIn: logoutPressIn, onPressOut: logoutPressOut } =
    usePressScale(0.97);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Settings" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(450).springify().damping(16)}>
            <SectionTitle>Account</SectionTitle>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {ACCOUNT_ROWS.map((row) => (
                <SettingsRow key={row.label} {...row} />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(450).springify().damping(16)}>
            <SectionTitle>Appearance</SectionTitle>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <ThemeRow />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(450).springify().damping(16)}>
            <SectionTitle>Preferences</SectionTitle>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: colors.surfaceBorder }]}>
                  <Ionicons name="notifications-outline" size={18} color={colors.text} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Push Notifications</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ true: theme.gradient[1], false: colors.surfaceBorder }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: colors.surfaceBorder }]}>
                  <Ionicons name="volume-high-outline" size={18} color={colors.text} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Sound Effects</Text>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ true: theme.gradient[1], false: colors.surfaceBorder }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(450).springify().damping(16)}>
            <SectionTitle>Support</SectionTitle>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {SUPPORT_ROWS.map((row) => (
                <SettingsRow key={row.label} {...row} />
              ))}
            </View>
          </Animated.View>

          <AnimatedPressable
            entering={FadeInDown.delay(320).duration(450).springify().damping(16)}
            onPress={() => router.replace('/')}
            onPressIn={logoutPressIn}
            onPressOut={logoutPressOut}
            style={[styles.logoutButton, logoutStyle]}>
            <Ionicons name="log-out-outline" size={18} color="#FF8FA3" />
            <Text style={styles.logoutText}>Log Out</Text>
          </AnimatedPressable>
        </ScrollView>
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
  content: {
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 13,
  },
  swatchDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: 14,
    backgroundColor: 'rgba(255,107,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,129,0.3)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF8FA3',
  },
});
