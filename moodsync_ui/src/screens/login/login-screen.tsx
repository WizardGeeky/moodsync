import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { AppTextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  email?: string;
  password?: string;
};

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleLogin() {
    const nextErrors: FormErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace('/(tabs)/home');
    }, 900);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AuroraBackground variant="form" />
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Animated.View
              entering={FadeInDown.duration(600).springify().damping(14)}
              style={styles.brandRow}>
              <BrandMark size={64} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(600).springify().damping(14)}>
              <Text style={styles.heading}>Welcome Back! 👋</Text>
              <Text style={styles.subheading}>Log in to continue your journey</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(260).duration(600).springify().damping(14)}
              style={styles.form}>
              <AppTextField
                label="Email"
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
              <AppTextField
                label="Password"
                labelRight={<Text style={styles.forgotText}>Forgot?</Text>}
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                secureToggle
                placeholder="••••••••"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify().damping(14)}
              style={styles.actions}>
              <AppButton
                label="Log In"
                variant="primary"
                loading={isSubmitting}
                onPress={handleLogin}
              />
              <Pressable onPress={() => router.push('/signup')} hitSlop={8}>
                <Text style={styles.linkText}>
                  Don&apos;t have an account? <Text style={styles.linkAccent}>Sign Up</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  backButton: {
    marginLeft: Spacing.three,
    marginTop: Spacing.two,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  brandRow: {
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: Spacing.half,
  },
  form: {
    gap: Spacing.three,
  },
  actions: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
  },
  linkAccent: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
  },
});
