import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BrandMark } from '@/components/ui/brand-mark';
import { useAppTheme } from '@/context/theme-context';
import { useProfile } from '@/context/profile-context';
import { Spacing } from '@/constants/theme';
import { usePressScale } from '@/hooks/use-press-scale';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AVATAR_SIZE = 32;
const RING_SIZE = 40;

function TopBarButton({
  icon,
  onPress,
  showDot,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  showDot?: boolean;
}) {
  const { colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.iconButton,
        { backgroundColor: colors.iconButtonBackground, borderColor: colors.surfaceBorder },
        animatedStyle,
      ]}>
      <Ionicons name={icon} size={20} color={colors.text} />
      {showDot && <View style={[styles.dot, { borderColor: colors.background }]} />}
    </AnimatedPressable>
  );
}

function StatBadge({ icon, value }: { icon: ReactNode; value: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.statBadge,
        { backgroundColor: colors.iconButtonBackground, borderColor: colors.surfaceBorder },
      ]}>
      {icon}
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function ProfileAvatar() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { profile } = useProfile();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const pulse = useSharedValue(0.35);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.35, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <AnimatedPressable
      onPress={() => router.push('/settings')}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      style={[styles.avatarWrapper, animatedStyle]}>
      <Animated.View style={[styles.avatarRing, ringStyle]}>
        <LinearGradient
          colors={profile.ringGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRingFill}
        />
      </Animated.View>
      {profile.avatarUri ? (
        <Image source={{ uri: profile.avatarUri }} style={styles.avatarFill} contentFit="cover" />
      ) : (
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarFill}>
          <Ionicons name="person" size={16} color="#FFFFFF" />
        </LinearGradient>
      )}
    </AnimatedPressable>
  );
}

export type TopBarProps = {
  title?: string;
  showBack?: boolean;
  showBell?: boolean;
  showProfile?: boolean;
  showBrandMark?: boolean;
  hasUnread?: boolean;
  showStreak?: boolean;
  streakCount?: number;
  showCoins?: boolean;
  coinCount?: number;
};

export function TopBar({
  title,
  showBack = true,
  showBell = true,
  showProfile = false,
  showBrandMark = false,
  hasUnread = false,
  showStreak = false,
  streakCount = 0,
  showCoins = false,
  coinCount = 0,
}: TopBarProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/home');
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify().damping(16)}
      style={styles.container}>
      <View style={styles.side}>
        {showBack && <TopBarButton icon="chevron-back" onPress={handleBack} />}
        {!showBack && showProfile && <ProfileAvatar />}
      </View>
      <View style={styles.titleRow}>
        {showBrandMark && <BrandMark size={26} />}
        {!!title && (
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      <View style={styles.rightGroup}>
        {showStreak && (
          <StatBadge
            icon={<Ionicons name="flame" size={16} color="#FF9F43" />}
            value={streakCount}
          />
        )}
        {showCoins && (
          <StatBadge
            icon={<FontAwesome5 name="coins" size={14} color="#FFC531" solid />}
            value={coinCount}
          />
        )}
        {showBell && (
          <TopBarButton
            icon="notifications-outline"
            onPress={() => router.push('/notifications')}
            showDot={hasUnread}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 40,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5F6D',
    borderWidth: 1.5,
  },
  avatarWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    overflow: 'hidden',
  },
  avatarRingFill: {
    flex: 1,
  },
  avatarFill: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
