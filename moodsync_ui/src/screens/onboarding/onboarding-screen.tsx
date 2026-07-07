import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { useAppTheme } from '@/context/theme-context';
import { usePressScale } from '@/hooks/use-press-scale';
import { Spacing } from '@/constants/theme';

import { StoryDots } from './components/story-dots';
import { StorySlide, type StorySlideData } from './components/story-slide';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SLIDES: StorySlideData[] = [
  {
    scene: 'mood',
    title: 'Track Your Mood',
    description: 'Check in daily and watch your emotional patterns come to life.',
    gradient: ['#1D4ED8', '#0B1740'],
    emojis: ['📊', '💭'],
  },
  {
    scene: 'moments',
    title: 'Share Moments',
    description: 'Capture the little things and share them with people who matter.',
    gradient: ['#7C3AED', '#2E1065'],
    emojis: ['📸', '✨'],
  },
  {
    scene: 'hearts',
    title: 'Connect Hearts',
    description: 'Sync moods in real time and feel closer, no matter the distance.',
    gradient: ['#DB2777', '#4C0519'],
    emojis: ['💞', '🔥'],
  },
];

function CircularNavButton({
  isLast,
  onPress,
  gradient,
}: {
  isLast: boolean;
  onPress: () => void;
  gradient: readonly [string, string, string];
}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.9);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={isLast ? 'Get Started' : 'Next'}
      style={[styles.navButton, animatedStyle]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.navButtonFill}>
        <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={22} color="#FFFFFF" />
      </LinearGradient>
    </AnimatedPressable>
  );
}

export function OnboardingScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === SLIDES.length - 1;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  function goToSignup() {
    router.replace('/signup');
  }

  function handlePrimaryPress() {
    if (isLastSlide) {
      goToSignup();
      return;
    }
    const nextIndex = activeIndex + 1;
    runOnUI(scrollTo)(scrollRef, nextIndex * SCREEN_WIDTH, 0, true);
    setActiveIndex(nextIndex);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onMomentumScrollEnd={(event) => {
            setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
          }}
          style={styles.pager}>
          {SLIDES.map((slide, index) => (
            <StorySlide key={slide.title} {...slide} index={index} scrollX={scrollX} />
          ))}
        </Animated.ScrollView>

        <View style={styles.footer}>
          <View style={styles.skipSlot}>
            {!isLastSlide && (
              <Pressable onPress={goToSignup} hitSlop={12}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            )}
          </View>
          <StoryDots count={SLIDES.length} scrollX={scrollX} />
          <CircularNavButton isLast={isLastSlide} onPress={handlePrimaryPress} gradient={theme.gradient} />
        </View>
      </SafeAreaView>
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
  pager: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.four,
  },
  skipSlot: {
    width: 50,
  },
  skipText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: '600',
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  navButtonFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
