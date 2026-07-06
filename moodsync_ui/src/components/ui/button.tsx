import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BrandGradient } from '@/constants/brand';
import { Spacing } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export function AppButton({ label, variant = 'primary', loading = false, ...rest }: AppButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  const isDisabled = loading || Boolean(rest.disabled);

  return (
    <AnimatedPressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.pill, animatedStyle]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={BrandGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pillFill}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <ThemedText style={styles.label}>{label}</ThemedText>}
        </LinearGradient>
      ) : loading ? (
        <ActivityIndicator color="#FFFFFF" style={styles.secondaryLabel} />
      ) : (
        <ThemedText style={[styles.label, styles.secondaryLabel]}>{label}</ThemedText>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  pillFill: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLabel: {
    paddingVertical: Spacing.three,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 999,
  },
});
