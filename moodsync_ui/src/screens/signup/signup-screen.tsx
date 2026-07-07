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
import { useProfile } from '@/context/profile-context';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_PATTERN = /^\d{7,15}$/;
const HANDLE_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

type FormErrors = {
  fullName?: string;
  handle?: string;
  email?: string;
  phone?: string;
};

export function SignupScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSignup() {
    const nextErrors: FormErrors = {};
    if (fullName.trim().length < 2) {
      nextErrors.fullName = 'Enter your full name';
    }
    if (!HANDLE_PATTERN.test(handle.trim())) {
      nextErrors.handle = '3-20 letters, numbers, or underscores';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!PHONE_DIGITS_PATTERN.test(phone.replace(/[\s-]/g, ''))) {
      nextErrors.phone = 'Enter a valid phone number';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      updateProfile({
        fullName: fullName.trim(),
        handle: handle.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      router.replace('/home');
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
              <Text style={styles.heading}>Create account</Text>
              <Text style={styles.subheading}>Join MoodSync today</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(260).duration(600).springify().damping(14)}
              style={styles.form}>
              <AppTextField
                label="Full Name"
                icon="person-outline"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
                autoCapitalize="words"
                placeholder="Jordan Rivera"
              />
              <AppTextField
                label="Handle"
                icon="at-outline"
                value={handle}
                onChangeText={setHandle}
                error={errors.handle}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="jordanrivera"
              />
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
                label="Phone Number"
                icon="call-outline"
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
                keyboardType="phone-pad"
                placeholder="+1 555 123 4567"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify().damping(14)}
              style={styles.actions}>
              <AppButton
                label="Sign Up"
                variant="primary"
                loading={isSubmitting}
                onPress={handleSignup}
              />
              <Pressable onPress={() => router.push('/login')} hitSlop={8}>
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkAccent}>Log In</Text>
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
});
