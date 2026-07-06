import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';

export type AppTextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  labelRight?: ReactNode;
  icon: ComponentProps<typeof Ionicons>['name'];
  error?: string;
  secureToggle?: boolean;
};

export function AppTextField({
  label,
  labelRight,
  icon,
  error,
  secureToggle = false,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}: AppTextFieldProps) {
  const focus = useSharedValue(0);
  const shake = useSharedValue(0);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  useEffect(() => {
    if (!error) return;
    shake.value = withSequence(
      withTiming(-6, { duration: 45 }),
      withTiming(6, { duration: 45 }),
      withTiming(-4, { duration: 45 }),
      withTiming(4, { duration: 45 }),
      withTiming(0, { duration: 45 }),
    );
  }, [error, shake]);

  const fieldStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [error ? 'rgba(255,107,129,0.6)' : 'rgba(255,255,255,0.15)', '#8B5CF6'],
    ),
    transform: [{ translateX: shake.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelRight}
      </View>
      <Animated.View style={[styles.inputRow, fieldStyle]}>
        <Ionicons name={icon} size={18} color="rgba(255,255,255,0.55)" />
        <TextInput
          {...rest}
          secureTextEntry={isSecure}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          onFocus={(event) => {
            focus.value = withTiming(1, { duration: 180 });
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focus.value = withTiming(0, { duration: 180 });
            onBlur?.(event);
          }}
        />
        {secureToggle && (
          <Pressable onPress={() => setIsSecure((previous) => !previous)} hitSlop={8}>
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={18}
              color="rgba(255,255,255,0.55)"
            />
          </Pressable>
        )}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1.5,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: Spacing.one,
  },
  error: {
    fontSize: 12,
    color: '#FF8FA3',
  },
});
