import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

const MOODS = ['😊', '😐', '😢', '😍', '😠'];
const BAR_COUNT = 9;
const FACE_SIZE = 108;

function MoodWaveBar({ index }: { index: number }) {
  const level = useSharedValue(0.2);

  useEffect(() => {
    level.value = withDelay(
      index * 90,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420 + index * 20, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.15, { duration: 420 + index * 20, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [level, index]);

  const barStyle = useAnimatedStyle(() => ({
    height: 6 + level.value * 26,
    opacity: 0.5 + level.value * 0.5,
  }));

  return <Animated.View style={[styles.bar, barStyle]} />;
}

export function MoodSwingScene() {
  const [moodIndex, setMoodIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMoodIndex((previous) => (previous + 1) % MOODS.length);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.faceBadge}>
        <Animated.View key={moodIndex} entering={ZoomIn.duration(400).springify().damping(9)}>
          <Text style={styles.faceEmoji}>{MOODS[moodIndex]}</Text>
        </Animated.View>
      </View>
      <View style={styles.waveRow}>
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <MoodWaveBar key={index} index={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 14,
  },
  faceBadge: {
    width: FACE_SIZE,
    height: FACE_SIZE,
    borderRadius: FACE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  faceEmoji: {
    fontSize: 52,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 34,
  },
  bar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
