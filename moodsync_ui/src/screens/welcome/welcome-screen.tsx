import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { BrandName, BrandTagline } from '@/constants/brand';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AuroraBackground />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <BrandMark />
          <Animated.Text
            entering={FadeInDown.delay(150).duration(600).springify().damping(14)}
            style={styles.brandName}>
            {BrandName}
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(280).duration(600).springify().damping(14)}
            style={styles.tagline}>
            {BrandTagline}
          </Animated.Text>
        </View>

        <Animated.View
          entering={FadeInDown.delay(420).duration(600).springify().damping(14)}
          style={styles.actions}>
          <AppButton
            label="Get Started"
            variant="primary"
            onPress={() => router.push('/onboarding')}
          />
          <AppButton label="Login" variant="secondary" onPress={() => router.push('/login')} />
        </Animated.View>
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.four,
    justifyContent: 'space-between',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  brandName: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.65)',
  },
  actions: {
    gap: Spacing.three,
  },
});
