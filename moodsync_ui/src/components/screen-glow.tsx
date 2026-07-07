import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/context/theme-context';

const BLOB_SIZE = 380;

/**
 * A single soft, slowly drifting brand-colored glow anchored top-right — deliberately lighter
 * than the multi-blob `AuroraBackground` (whose colors are fixed-dark only) so it stays legible
 * behind main-app content in both light and dark mode.
 */
export function ScreenGlow() {
  const { theme, mode } = useAppTheme();
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [drift]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (drift.value - 0.5) * 40 },
      { translateY: (drift.value - 0.5) * 30 },
      { scale: 0.95 + drift.value * 0.12 },
    ],
  }));

  const opacity = mode === 'dark' ? 0.22 : 0.1;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.blob, animatedStyle]}>
        <LinearGradient
          colors={[theme.gradient[1], 'transparent']}
          style={[styles.fill, { opacity }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    top: -BLOB_SIZE * 0.35,
    right: -BLOB_SIZE * 0.35,
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
  },
  fill: {
    flex: 1,
    borderRadius: BLOB_SIZE / 2,
  },
});
