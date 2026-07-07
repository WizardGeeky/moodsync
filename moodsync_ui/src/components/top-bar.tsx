import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, type ComponentProps } from 'react';
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
      style={[styles.iconButton, { backgroundColor: colors.iconButtonBackground }, animatedStyle]}>
      <Ionicons name={icon} size={20} color={colors.text} />
      {showDot && <View style={[styles.dot, { borderColor: colors.background }]} />}
    </AnimatedPressable>
  );
}

function ProfileAvatar() {
  const router = useRouter();
  const { theme } = useAppTheme();
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
      <Animated.View style={[styles.avatarRing, ringStyle, { borderColor: theme.gradient[1] }]} />
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarFill}>
        <Ionicons name="person" size={16} color="#FFFFFF" />
      </LinearGradient>
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
};

export function TopBar({
  title,
  showBack = true,
  showBell = true,
  showProfile = false,
  showBrandMark = false,
  hasUnread = false,
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
      <View style={[styles.side, styles.sideRight]}>
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
  sideRight: {
    alignItems: 'flex-end',
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
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 2,
  },
  avatarFill: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
