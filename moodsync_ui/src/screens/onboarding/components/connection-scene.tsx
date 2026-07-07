import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/context/theme-context';

const AVATAR_SIZE = 72;
const CONNECTOR_WIDTH = 110;
const CENTER_BADGE_SIZE = 44;
const HEART_SIZE = 18;

function PingRing({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false),
    );
  }, [progress, delay]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.1, 1], [0, 0.6, 0], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.9, 1.7], Extrapolation.CLAMP) },
    ],
  }));

  return <Animated.View style={[styles.ping, ringStyle]} />;
}

function Avatar({ delay, gradient }: { delay: number; gradient: readonly [string, string, string] }) {
  return (
    <View style={styles.avatarWrapper}>
      <PingRing delay={delay} />
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.avatar, { shadowColor: gradient[1] }]}>
        <Ionicons name="person" size={32} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

function CenterHeartBadge({ gradient }: { gradient: readonly [string, string, string] }) {
  const beat = useSharedValue(1);

  useEffect(() => {
    beat.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) }),
        withTiming(1.12, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 170, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
      false,
    );
  }, [beat]);

  const beatStyle = useAnimatedStyle(() => ({
    transform: [{ scale: beat.value }],
  }));

  return (
    <Animated.View style={[styles.centerBadge, beatStyle, { shadowColor: gradient[1] }]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerBadgeFill}>
        <Ionicons name="heart" size={20} color="#FFFFFF" />
      </LinearGradient>
    </Animated.View>
  );
}

function TravellingHeart({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2200, easing: Easing.linear }), -1, false),
    );
  }, [progress, delay]);

  const heartStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.08, 0.92, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, CONNECTOR_WIDTH - HEART_SIZE],
          Extrapolation.CLAMP,
        ),
      },
      { translateY: interpolate(progress.value, [0, 0.5, 1], [0, -10, 0], Extrapolation.CLAMP) },
      {
        scale: interpolate(
          progress.value,
          [0, 0.42, 0.5, 0.58, 1],
          [0.8, 1, 1.5, 1, 0.8],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.travellingHeart, heartStyle]}>
      <Text style={styles.heartEmoji}>❤️</Text>
    </Animated.View>
  );
}

export function ConnectionScene() {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      <Avatar delay={0} gradient={theme.gradient} />
      <View style={styles.connector}>
        <TravellingHeart delay={0} />
        <TravellingHeart delay={730} />
        <TravellingHeart delay={1460} />
        <View style={styles.centerBadgeSlot}>
          <CenterHeartBadge gradient={theme.gradient} />
        </View>
      </View>
      <Avatar delay={900} gradient={theme.gradient} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ping: {
    position: 'absolute',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  connector: {
    width: CONNECTOR_WIDTH,
    height: CENTER_BADGE_SIZE,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  travellingHeart: {
    position: 'absolute',
    left: 0,
    top: CENTER_BADGE_SIZE / 2 - HEART_SIZE / 2,
  },
  heartEmoji: {
    fontSize: HEART_SIZE,
  },
  centerBadgeSlot: {
    position: 'absolute',
    left: CONNECTOR_WIDTH / 2 - CENTER_BADGE_SIZE / 2,
    top: 0,
  },
  centerBadge: {
    width: CENTER_BADGE_SIZE,
    height: CENTER_BADGE_SIZE,
    borderRadius: CENTER_BADGE_SIZE / 2,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  centerBadgeFill: {
    flex: 1,
    borderRadius: CENTER_BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
