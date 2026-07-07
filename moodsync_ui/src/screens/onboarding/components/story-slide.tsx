import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { useAppTheme } from '@/context/theme-context';
import { Spacing } from '@/constants/theme';

import { ConnectionScene } from './connection-scene';
import { FloatingEmoji } from './floating-emoji';
import { MoodSwingScene } from './mood-swing-scene';
import { PostMomentScene } from './post-moment-scene';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.5;

const EMOJI_POSITIONS: { top: `${number}%`; left: `${number}%` }[] = [
  { top: '12%', left: '12%' },
  { top: '10%', left: '68%' },
];

export type StorySlideData = {
  scene: 'mood' | 'moments' | 'hearts';
  title: string;
  description: string;
  gradient: readonly [string, string];
  emojis: readonly [string, string];
};

type StorySlideProps = StorySlideData & {
  index: number;
  scrollX: SharedValue<number>;
};

export function StorySlide({
  scene,
  title,
  description,
  gradient,
  emojis,
  index,
  scrollX,
}: StorySlideProps) {
  const { theme } = useAppTheme();
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const sceneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(scrollX.value, inputRange, [0.75, 1, 0.75], Extrapolation.CLAMP) },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollX.value, inputRange, [24, 0, 24], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <View style={{ width: SCREEN_WIDTH }}>
      <View style={styles.hero}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {emojis.map((emoji, emojiIndex) => (
          <FloatingEmoji
            key={emojiIndex}
            emoji={emoji}
            top={EMOJI_POSITIONS[emojiIndex].top}
            left={EMOJI_POSITIONS[emojiIndex].left}
            delay={emojiIndex * 180}
          />
        ))}
        <Animated.View style={sceneStyle}>
          {scene === 'mood' && <MoodSwingScene />}
          {scene === 'moments' && <PostMomentScene emoji={emojis[0]} />}
          {scene === 'hearts' && <ConnectionScene />}
        </Animated.View>
        <LinearGradient colors={['transparent', theme.background]} style={styles.heroFade} />
      </View>
      <Animated.View style={[styles.textBlock, textStyle]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT * 0.55,
  },
  textBlock: {
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.five,
    gap: Spacing.two,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'left',
  },
});
