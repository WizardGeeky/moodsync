import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
const CREATE_BUTTON_SIZE = 44;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconName = ComponentProps<typeof Ionicons>['name'];
type NavTab = { kind: 'tab'; name: string; href: Href; icon: IconName; activeIcon: IconName };
type CreateItem = { kind: 'create'; name: 'create' };
type NavItem = NavTab | CreateItem;

const NAV_ITEMS: NavItem[] = [
  { kind: 'tab', name: 'home', href: '/home', icon: 'home-outline', activeIcon: 'home' },
  { kind: 'tab', name: 'posts', href: '/posts', icon: 'grid-outline', activeIcon: 'grid' },
  { kind: 'create', name: 'create' },
  {
    kind: 'tab',
    name: 'chats',
    href: '/chats',
    icon: 'chatbubble-ellipses-outline',
    activeIcon: 'chatbubble-ellipses',
  },
  { kind: 'tab', name: 'settings', href: '/settings', icon: 'settings-outline', activeIcon: 'settings' },
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

function CreateTabButton() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.9);

  return (
    <AnimatedPressable
      onPress={() => router.push('/create-post')}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel="Create post"
      style={[styles.createButton, animatedStyle, { shadowColor: theme.gradient[1] }]}>
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.createFill}>
        <Ionicons name="add" size={22} color="#FFFFFF" />
      </LinearGradient>
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
      {NAV_ITEMS.map((item) =>
        item.kind === 'create' ? (
          <CreateTabButton key={item.name} />
        ) : (
          <NavIconButton key={item.name} tab={item} isFocused={pathname === item.href} />
        ),
      )}
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
  createButton: {
    width: CREATE_BUTTON_SIZE,
    height: CREATE_BUTTON_SIZE,
    borderRadius: CREATE_BUTTON_SIZE / 2,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  createFill: {
    flex: 1,
    borderRadius: CREATE_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
