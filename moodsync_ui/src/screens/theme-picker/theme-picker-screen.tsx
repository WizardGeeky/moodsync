import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';
import {
  APP_THEMES,
  type AppMode,
  type AppThemeId,
  type AppThemePalette,
  type ModeColors,
} from '@/constants/themes';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TRACK_PADDING = 4;
const TRACK_WIDTH = 240;
const OPTION_WIDTH = (TRACK_WIDTH - TRACK_PADDING * 2) / 2;

function ModeOption({
  label,
  icon,
  isActive,
  colors,
  onPress,
}: {
  label: string;
  icon: { active: ComponentProps<typeof Ionicons>['name']; inactive: ComponentProps<typeof Ionicons>['name'] };
  isActive: boolean;
  colors: ModeColors;
  onPress: () => void;
}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.toggleOption, animatedStyle]}>
      <Ionicons
        name={isActive ? icon.active : icon.inactive}
        size={16}
        color={isActive ? colors.text : colors.textMuted}
      />
      <Text style={[styles.toggleLabel, { color: isActive ? colors.text : colors.textMuted }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

function ModeToggle({
  mode,
  colors,
  accent,
  onChange,
}: {
  mode: AppMode;
  colors: ModeColors;
  accent: string;
  onChange: (mode: AppMode) => void;
}) {
  const progress = useSharedValue(mode === 'light' ? 1 : 0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * OPTION_WIDTH }],
  }));

  function handleChange(next: AppMode) {
    progress.value = withSpring(next === 'light' ? 1 : 0, { damping: 16, stiffness: 180 });
    onChange(next);
  }

  return (
    <View
      style={[
        styles.toggleTrack,
        { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
      ]}>
      <Animated.View
        style={[
          styles.toggleIndicator,
          indicatorStyle,
          { backgroundColor: colors.background, shadowColor: accent },
        ]}
      />
      <ModeOption
        label="Dark"
        icon={{ active: 'moon', inactive: 'moon-outline' }}
        isActive={mode === 'dark'}
        colors={colors}
        onPress={() => handleChange('dark')}
      />
      <ModeOption
        label="Light"
        icon={{ active: 'sunny', inactive: 'sunny-outline' }}
        isActive={mode === 'light'}
        colors={colors}
        onPress={() => handleChange('light')}
      />
    </View>
  );
}

function ThemeCard({
  palette,
  isActive,
  index,
  colors,
  onPress,
}: {
  palette: AppThemePalette;
  isActive: boolean;
  index: number;
  colors: ModeColors;
  onPress: () => void;
}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 70)
        .duration(450)
        .springify()
        .damping(16)}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        animatedStyle,
        isActive && { borderColor: palette.gradient[1] },
      ]}>
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.swatch}
      />
      <Text style={[styles.name, { color: colors.text }]}>{palette.name}</Text>
      {isActive && (
        <Animated.View entering={ZoomIn.duration(300).springify()} style={styles.check}>
          <Ionicons name="checkmark-circle" size={22} color={palette.gradient[1]} />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

export function ThemePickerScreen() {
  const { theme, themeId, setThemeId, mode, setMode, colors } = useAppTheme();
  const flashOpacity = useSharedValue(0);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  function triggerReveal() {
    flashOpacity.value = withSequence(withTiming(0.85, { duration: 120 }), withTiming(0, { duration: 320 }));
  }

  function handleSelectTheme(id: AppThemeId) {
    triggerReveal();
    setThemeId(id);
  }

  function handleSelectMode(nextMode: AppMode) {
    triggerReveal();
    setMode(nextMode);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Theme" showBell={false} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Pick a look for MoodSync. It applies everywhere, instantly.
          </Text>

          <View style={styles.toggleWrapper}>
            <ModeToggle
              mode={mode}
              colors={colors}
              accent={theme.gradient[1]}
              onChange={handleSelectMode}
            />
          </View>

          <View style={styles.grid}>
            {APP_THEMES.map((palette, index) => (
              <ThemeCard
                key={palette.id}
                palette={palette}
                isActive={palette.id === themeId}
                index={index}
                colors={colors}
                onPress={() => handleSelectTheme(palette.id)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Animated.View
        pointerEvents="none"
        style={[styles.flash, flashStyle, { backgroundColor: colors.background }]}
      />
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
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.four,
  },
  toggleWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  toggleTrack: {
    width: TRACK_WIDTH,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    padding: TRACK_PADDING,
    flexDirection: 'row',
  },
  toggleIndicator: {
    position: 'absolute',
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    width: OPTION_WIDTH,
    height: 44 - TRACK_PADDING * 2,
    borderRadius: 18,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  toggleOption: {
    width: OPTION_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  card: {
    width: '46%',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  swatch: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
