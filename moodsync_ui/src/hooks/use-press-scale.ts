import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function usePressScale(pressedScale = 0.94) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function onPressIn() {
    scale.value = withSpring(pressedScale, { damping: 15, stiffness: 300 });
  }

  function onPressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  return { animatedStyle, onPressIn, onPressOut };
}
