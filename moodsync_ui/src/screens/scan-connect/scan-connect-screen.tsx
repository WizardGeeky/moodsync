import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { AppButton } from '@/components/ui/button';
import { useAppTheme } from '@/context/theme-context';
import { useConnections } from '@/context/connections-context';
import { useProfile } from '@/context/profile-context';
import { Spacing } from '@/constants/theme';
import { parseConnectPayload } from '@/utils/qr-connect';

const FRAME_SIZE = 240;

type ScanOutcome =
  | { status: 'success'; handle: string }
  | { status: 'own' }
  | { status: 'invalid' };

function ScanFrame() {
  const { theme } = useAppTheme();
  const sweep = useSharedValue(0);

  useEffect(() => {
    sweep.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [sweep]);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sweep.value * (FRAME_SIZE - 4) }],
  }));

  return (
    <View style={styles.frameRow}>
      <View style={styles.frameDim} />
      <View style={styles.frame}>
        {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((corner) => (
          <View
            key={corner}
            style={[styles.corner, styles[corner], { borderColor: theme.gradient[1] }]}
          />
        ))}
        <Animated.View style={[styles.scanLine, lineStyle, { backgroundColor: theme.gradient[1] }]} />
      </View>
      <View style={styles.frameDim} />
    </View>
  );
}

export function ScanConnectScreen() {
  const { theme, colors } = useAppTheme();
  const { profile } = useProfile();
  const { addConnection } = useConnections();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);

  useEffect(() => {
    requestPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleBarcodeScanned(event: BarcodeScanningResult) {
    if (scanned) return;
    setScanned(true);
    const handle = parseConnectPayload(event.data);
    if (!handle) {
      setOutcome({ status: 'invalid' });
      return;
    }
    if (handle === profile.handle) {
      setOutcome({ status: 'own' });
      return;
    }
    addConnection(handle);
    setOutcome({ status: 'success', handle });
  }

  function resumeScanning() {
    setOutcome(null);
    setScanned(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      ) : (
        <ScreenGlow />
      )}

      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Scan & Connect" />

        {permission?.granted ? (
          <View style={styles.scanArea}>
            <ScanFrame />
            <Animated.Text
              entering={FadeInDown.delay(150).duration(450)}
              style={styles.instruction}>
              Point your camera at a MoodSync QR code
            </Animated.Text>
          </View>
        ) : (
          <View style={styles.permissionGate}>
            <Animated.View entering={ZoomIn.duration(500).springify().damping(12)}>
              <LinearGradient
                colors={theme.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.permissionBadge}>
                <Ionicons name="camera-outline" size={36} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(150).duration(450)}
              style={styles.permissionTextBlock}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>
                Camera access needed
              </Text>
              <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
                Allow camera access to scan a friend&apos;s MoodSync QR code and connect instantly.
              </Text>
            </Animated.View>
            <AppButton label="Allow Camera Access" variant="primary" onPress={requestPermission} />
          </View>
        )}

        {outcome && (
          <Animated.View
            entering={ZoomIn.duration(400).springify().damping(14)}
            style={styles.outcomeOverlay}>
            <View style={[styles.outcomeCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              {outcome.status === 'success' ? (
                <>
                  <LinearGradient
                    colors={theme.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.outcomeBadge}>
                    <Ionicons name="checkmark" size={30} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.outcomeTitle, { color: colors.text }]}>Connected!</Text>
                  <Text style={[styles.outcomeDescription, { color: colors.textSecondary }]}>
                    You and @{outcome.handle} are now connected.
                  </Text>
                </>
              ) : (
                <>
                  <View style={[styles.outcomeBadge, { backgroundColor: colors.surfaceBorder }]}>
                    <Ionicons name="alert-circle-outline" size={30} color={colors.textSecondary} />
                  </View>
                  <Text style={[styles.outcomeTitle, { color: colors.text }]}>
                    {outcome.status === 'own' ? "That's your own code" : 'Not a MoodSync code'}
                  </Text>
                  <Text style={[styles.outcomeDescription, { color: colors.textSecondary }]}>
                    {outcome.status === 'own'
                      ? 'Ask a friend to show their MoodSync QR code instead.'
                      : "This code isn't recognized. Try scanning a MoodSync profile code."}
                  </Text>
                </>
              )}
              <AppButton label="Scan Again" variant="primary" onPress={resumeScanning} />
            </View>
          </Animated.View>
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
  scanArea: {
    flex: 1,
    justifyContent: 'center',
  },
  frameRow: {
    height: FRAME_SIZE,
    flexDirection: 'row',
  },
  frameDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    opacity: 0.85,
  },
  instruction: {
    marginTop: Spacing.four,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  permissionGate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.six,
    gap: Spacing.four,
  },
  permissionBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTextBlock: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  outcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  outcomeCard: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.five,
    borderRadius: 24,
    borderWidth: 1,
  },
  outcomeBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  outcomeDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
