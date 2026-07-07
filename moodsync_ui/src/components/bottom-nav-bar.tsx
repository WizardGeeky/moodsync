import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

import { useAppTheme } from '@/context/theme-context';
import { usePressScale } from '@/hooks/use-press-scale';
import { hexToRgba } from '@/utils/color';

const BAR_HEIGHT = 64;
const BAR_BOTTOM_MARGIN = 20;
const BAR_HORIZONTAL_MARGIN = 24;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconName = ComponentProps<typeof Ionicons>['name'];
type NavTab = { name: string; href: Href; icon: IconName; activeIcon: IconName };

const NAV_ITEMS: NavTab[] = [
  { name: 'home', href: '/home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'posts', href: '/posts', icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'create', href: '/create-post', icon: 'add-circle-outline', activeIcon: 'add-circle' },
  {
    name: 'chats',
    href: '/chats',
    icon: 'chatbubble-ellipses-outline',
    activeIcon: 'chatbubble-ellipses',
  },
  { name: 'settings', href: '/settings', icon: 'settings-outline', activeIcon: 'settings' },
];

function NavIconButton({ tab, isFocused }: { tab: NavTab; isFocused: boolean }) {
  const router = useRouter();
  const { theme, colors } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      onPress={() => router.navigate(tab.href)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      style={[styles.tabButton, animatedStyle]}>
      {isFocused && (
        <View style={[styles.activeChip, { backgroundColor: hexToRgba(theme.gradient[1], 0.3) }]} />
      )}
      <Ionicons
        name={isFocused ? tab.activeIcon : tab.icon}
        size={22}
        color={isFocused ? colors.text : colors.textSecondary}
      />
    </AnimatedPressable>
  );
}

export function BottomNavBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.bar,
        {
          bottom: insets.bottom + BAR_BOTTOM_MARGIN,
          backgroundColor: colors.barBackground,
          borderColor: colors.barBorder,
        },
      ]}>
      {NAV_ITEMS.map((tab) => (
        <NavIconButton key={tab.name} tab={tab} isFocused={pathname === tab.href} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: BAR_HORIZONTAL_MARGIN,
    right: BAR_HORIZONTAL_MARGIN,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  tabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
  },
});
