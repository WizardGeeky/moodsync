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

import {
  AuroraBackgroundColor,
  AuroraBlobs,
  AuroraBlobsCompact,
  type AuroraBlobConfig,
} from '@/constants/brand';

function AuroraBlob({
  blob,
  index,
  dim,
}: {
  blob: AuroraBlobConfig;
  index: number;
  dim: boolean;
}) {
  const drift = useSharedValue(0);
  const opacityScale = dim ? 0.55 : 1;

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 9000 + index * 2500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [drift, index]);

  const animatedStyle = useAnimatedStyle(() => {
    const range = 36 + index * 10;
    return {
      transform: [
        { translateX: (drift.value - 0.5) * range },
        { translateY: (drift.value - 0.5) * range * 0.7 },
        { scale: 0.92 + drift.value * 0.16 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.blobWrapper,
        animatedStyle,
        {
          width: blob.size,
          height: blob.size,
          top: blob.top,
          left: blob.left,
        },
      ]}>
      <LinearGradient
        colors={[blob.colors[0], blob.colors[1], 'transparent']}
        style={[styles.blobFill, { borderRadius: blob.size / 2, opacity: 0.55 * opacityScale }]}
      />
      <LinearGradient
        colors={[blob.colors[0], 'transparent']}
        style={[
          styles.blobFill,
          styles.blobCore,
          {
            width: blob.size * 0.55,
            height: blob.size * 0.55,
            borderRadius: (blob.size * 0.55) / 2,
            opacity: 0.7 * opacityScale,
          },
        ]}
      />
    </Animated.View>
  );
}

export type AuroraBackgroundVariant = 'hero' | 'form';

export function AuroraBackground({ variant = 'hero' }: { variant?: AuroraBackgroundVariant }) {
  const blobs = variant === 'form' ? AuroraBlobsCompact : AuroraBlobs;
  const dim = variant === 'form';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: AuroraBackgroundColor }]} />
      {blobs.map((blob, index) => (
        <AuroraBlob key={index} blob={blob} index={index} dim={dim} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  blobWrapper: {
    position: 'absolute',
  },
  blobFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blobCore: {
    top: '22.5%',
    left: '22.5%',
  },
});
