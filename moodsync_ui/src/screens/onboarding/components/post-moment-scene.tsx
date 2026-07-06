import { Ionicons } from '@expo/vector-icons';
import { useEffect, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const CYCLE_DURATION = 3600;

const STATS: {
  icon: ComponentProps<typeof Ionicons>['name'];
  count: string;
  popStart: number;
}[] = [
  { icon: 'heart', count: '24', popStart: 0.24 },
  { icon: 'chatbubble-outline', count: '8', popStart: 0.36 },
  { icon: 'share-social-outline', count: '3', popStart: 0.48 },
];

function StatPop({
  progress,
  icon,
  count,
  popStart,
}: {
  progress: SharedValue<number>;
  icon: ComponentProps<typeof Ionicons>['name'];
  count: string;
  popStart: number;
}) {
  const statStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, popStart, popStart + 0.06, 0.82, 0.9, 1],
      [0, 0, 1, 1, 0, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, popStart, popStart + 0.06, popStart + 0.12, 0.82, 0.9, 1],
          [0, 0, 1.25, 1, 1, 0.8, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.statItem, statStyle]}>
      <Ionicons name={icon} size={14} color="rgba(255,255,255,0.9)" />
      <Text style={styles.statText}>{count}</Text>
    </Animated.View>
  );
}

export function PostMomentScene({ emoji }: { emoji: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: CYCLE_DURATION, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.1, 0.85, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 0.1, 0.85, 1],
          [24, 0, 0, -20],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{emoji}</Text>
          </View>
          <View style={styles.lines}>
            <View style={[styles.line, styles.lineWide]} />
            <View style={[styles.line, styles.lineNarrow]} />
          </View>
        </View>
        <View style={styles.footerRow}>
          {STATS.map((stat) => (
            <StatPop
              key={stat.icon}
              progress={progress}
              icon={stat.icon}
              count={stat.count}
              popStart={stat.popStart}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
  },
  card: {
    width: '100%',
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  lines: {
    flex: 1,
    gap: 6,
  },
  line: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  lineWide: {
    width: '85%',
  },
  lineNarrow: {
    width: '55%',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
});
