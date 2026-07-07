import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { useAppTheme } from '@/context/theme-context';

const DEFAULT_SIZE = 92;

export function BrandMark({ size = DEFAULT_SIZE }: { size?: number }) {
  const { theme } = useAppTheme();
  const beat = useSharedValue(1);
  const spin = useSharedValue(0);

  useEffect(() => {
    // "lub-dub" heartbeat rhythm, not a plain breathing loop — reads unmistakably as a pulse.
    beat.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 140, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 140, easing: Easing.in(Easing.quad) }),
        withTiming(1.12, { duration: 140, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 160, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1300 }),
      ),
      -1,
      false,
    );
    spin.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1, false);
  }, [beat, spin]);

  const beatStyle = useAnimatedStyle(() => ({
    transform: [{ scale: beat.value }],
  }));

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${spin.value}deg` }],
  }));

  return (
    <Animated.View
      entering={ZoomIn.duration(700).springify().damping(12)}
      style={[styles.wrapper, { width: size, height: size }]}>
      <View
        style={[
          styles.shadowLayer,
          { width: size, height: size, borderRadius: size / 2, shadowColor: theme.gradient[1] },
        ]}>
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
          <Animated.View style={[styles.syncRing, spinStyle]}>
            <Ionicons name="sync" size={size * 0.78} color="rgba(255,255,255,0.85)" />
          </Animated.View>
          <Animated.View style={beatStyle}>
            <Ionicons name="heart" size={size * 0.3} color="#FFFFFF" />
          </Animated.View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowLayer: {
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  syncRing: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
