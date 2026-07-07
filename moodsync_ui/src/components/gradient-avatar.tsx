import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/context/theme-context';

export type GradientAvatarProps = {
  uri: string | null;
  ringGradient: readonly [string, string];
  size: number;
  ringWidth?: number;
};

export function GradientAvatar({ uri, ringGradient, size, ringWidth = 3 }: GradientAvatarProps) {
  const { theme, colors } = useAppTheme();
  const innerSize = size - ringWidth * 2;

  return (
    <LinearGradient
      colors={ringGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: colors.background,
          },
        ]}>
        {uri ? (
          <Image source={{ uri }} style={styles.fill} contentFit="cover" />
        ) : (
          <LinearGradient
            colors={theme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fill}>
            <Ionicons name="person" size={innerSize * 0.45} color="#FFFFFF" />
          </LinearGradient>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
