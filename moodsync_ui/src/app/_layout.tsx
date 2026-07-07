import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { AppThemeProvider } from '@/context/theme-context';
import { ConnectionsProvider } from '@/context/connections-context';
import { ProfileProvider } from '@/context/profile-context';

SplashScreen.preventAutoHideAsync();

const MAIN_APP_ROUTES = [
  '/home',
  '/posts',
  '/chats',
  '/settings',
  '/notifications',
  '/theme-picker',
  '/create-post',
  '/edit-profile',
  '/my-qr',
  '/scan-connect',
];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const showBottomNav = MAIN_APP_ROUTES.includes(pathname);

  return (
    <AppThemeProvider>
      <ProfileProvider>
        <ConnectionsProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="home" />
              <Stack.Screen name="posts" />
              <Stack.Screen name="chats" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="create-post" options={{ presentation: 'modal' }} />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="theme-picker" />
              <Stack.Screen name="edit-profile" />
              <Stack.Screen name="my-qr" />
              <Stack.Screen name="scan-connect" />
            </Stack>
            {showBottomNav && <BottomNavBar />}
          </ThemeProvider>
        </ConnectionsProvider>
      </ProfileProvider>
    </AppThemeProvider>
  );
}
