import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from 'react-native';
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
  const content = loading ? (
    <ActivityIndicator color="#FFFFFF" />
  ) : (
    <ThemedText style={styles.label}>{label}</ThemedText>
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.pressable,
        variant === 'primary' && styles.primaryShadow,
        animatedStyle,
        isDisabled && styles.disabled,
      ]}>
      <View style={styles.clip}>
        {variant === 'primary' ? (
          <LinearGradient
            colors={BrandGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.pillFill}>
            {content}
          </LinearGradient>
        ) : (
          <View style={[styles.pillFill, styles.secondaryFill]}>{content}</View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  primaryShadow: {
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  clip: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  pillFill: {
    paddingVertical: Spacing.three + Spacing.half,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryFill: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
