import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

type FloatingEmojiProps = {
  emoji: string;
  top: `${number}%`;
  left: `${number}%`;
  delay: number;
};

export function FloatingEmoji({ emoji, top, left, delay }: FloatingEmojiProps) {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [bob, delay]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (bob.value - 0.5) * 16 },
      { rotate: `${(bob.value - 0.5) * 10}deg` },
    ],
  }));

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(500).springify().damping(10)}
      style={[styles.wrapper, { top, left }, bobStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  emoji: {
    fontSize: 28,
  },
});
