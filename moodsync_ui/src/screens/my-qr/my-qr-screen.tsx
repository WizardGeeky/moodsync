import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';

import { EmptyState } from '@/components/empty-state';
import { GradientAvatar } from '@/components/gradient-avatar';
import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';
import { useProfile } from '@/context/profile-context';
import { Spacing } from '@/constants/theme';
import { buildConnectPayload } from '@/utils/qr-connect';

const QR_SIZE = 200;
const AVATAR_SIZE = 72;

export function MyQrScreen() {
  const { colors } = useAppTheme();
  const { profile } = useProfile();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="My QR Code" />
        {profile.handle ? (
          <View style={styles.content}>
            <Animated.View
              entering={FadeInDown.duration(450).springify().damping(16)}
              style={styles.identity}>
              <GradientAvatar
                uri={profile.avatarUri}
                ringGradient={profile.ringGradient}
                size={AVATAR_SIZE}
                ringWidth={3}
              />
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {profile.fullName || 'MoodSync user'}
              </Text>
              <Text style={[styles.handle, { color: colors.textSecondary }]}>
                @{profile.handle}
              </Text>
            </Animated.View>

            <Animated.View
              entering={ZoomIn.delay(120).duration(500).springify().damping(14)}
              style={[styles.qrCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <View style={styles.qrFrame}>
                <QRCode
                  value={buildConnectPayload(profile.handle)}
                  size={QR_SIZE}
                  backgroundColor="#FFFFFF"
                  color="#12121A"
                />
              </View>
              <Text style={[styles.qrHint, { color: colors.textSecondary }]}>
                Scan this with Scan &amp; Connect in Settings to add each other instantly.
              </Text>
            </Animated.View>
          </View>
        ) : (
          <EmptyState
            icon="qr-code-outline"
            title="Your code isn't ready yet"
            description="Finish setting up your profile handle to get your personal QR code."
          />
        )}
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.four,
  },
  identity: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  handle: {
    fontSize: 14,
  },
  qrCard: {
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.five,
    padding: Spacing.four,
    borderRadius: 24,
    borderWidth: 1,
  },
  qrFrame: {
    padding: Spacing.three,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  qrHint: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
  },
});
