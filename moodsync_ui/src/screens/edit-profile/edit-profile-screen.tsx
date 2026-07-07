import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenGlow } from '@/components/screen-glow';
import { TopBar } from '@/components/top-bar';
import { AppButton } from '@/components/ui/button';
import { useAppTheme } from '@/context/theme-context';
import {
  RING_GRADIENT_OPTIONS,
  useProfile,
  type Gender,
  type RingGradient,
} from '@/context/profile-context';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { ModeColors } from '@/constants/themes';

const AVATAR_RING_SIZE = 96;
const BANNER_HEIGHT = 150;

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
  { key: 'non_binary', label: 'Non-binary' },
  { key: 'prefer_not_to_say', label: 'Prefer not to say' },
];

function ReadOnlyField({
  icon,
  label,
  value,
  colors,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  colors: ModeColors;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.readOnlyRow,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        ]}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={[styles.readOnlyValue, { color: colors.textMuted }]} numberOfLines={1}>
          {value || '—'}
        </Text>
        <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
      </View>
    </View>
  );
}

export function EditProfileScreen() {
  const router = useRouter();
  const { theme, colors } = useAppTheme();
  const { profile, updateProfile } = useProfile();

  const [fullName, setFullName] = useState(profile.fullName);
  const [gender, setGender] = useState<Gender | null>(profile.gender);
  const [avatarUri, setAvatarUri] = useState<string | null>(profile.avatarUri);
  const [bannerUri, setBannerUri] = useState<string | null>(profile.bannerUri);
  const [ringGradient, setRingGradient] = useState<RingGradient>(profile.ringGradient);
  const [error, setError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  async function pickImage(kind: 'avatar' | 'banner') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Allow photo access to choose an image');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: kind === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    setError(undefined);
    const uri = result.assets[0].uri;
    if (kind === 'avatar') {
      setAvatarUri(uri);
    } else {
      setBannerUri(uri);
    }
  }

  function handleSave() {
    if (fullName.trim().length === 0) {
      setError('Add your full name');
      return;
    }
    setError(undefined);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateProfile({ fullName: fullName.trim(), gender, avatarUri, bannerUri, ringGradient });
      router.back();
    }, 600);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Edit Profile" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.bannerSection}>
              <View style={[styles.bannerWrap, { backgroundColor: colors.surface }]}>
                {bannerUri ? (
                  <Image source={{ uri: bannerUri }} style={styles.bannerImage} contentFit="cover" />
                ) : (
                  <LinearGradient
                    colors={theme.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.bannerImage}
                  />
                )}
                <Pressable
                  onPress={() => pickImage('banner')}
                  style={styles.bannerEditButton}
                  accessibilityLabel="Change banner image">
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                  <Text style={styles.bannerEditText}>Edit banner</Text>
                </Pressable>
              </View>

              <View style={styles.avatarEditWrap}>
                <View style={styles.avatarEditInner}>
                  <LinearGradient
                    colors={ringGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarEditRing}>
                    <View
                      style={[styles.avatarEditInnerCircle, { backgroundColor: colors.background }]}>
                      {avatarUri ? (
                        <Image
                          source={{ uri: avatarUri }}
                          style={styles.avatarEditImage}
                          contentFit="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.avatarEditPlaceholder,
                            { backgroundColor: colors.surfaceBorder },
                          ]}>
                          <Ionicons name="person" size={32} color={colors.textSecondary} />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                  <Pressable
                    onPress={() => pickImage('avatar')}
                    style={[
                      styles.avatarEditBadge,
                      { backgroundColor: theme.gradient[1], borderColor: colors.background },
                    ]}
                    accessibilityLabel="Change profile picture">
                    <Ionicons name="camera" size={13} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.fieldBlock}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Full Name
                </Text>
                <View
                  style={[
                    styles.iconFieldWrap,
                    { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                  ]}>
                  <Ionicons name="person-outline" size={18} color={colors.textMuted} />
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Your full name"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    style={[styles.iconFieldInput, { color: colors.text }]}
                  />
                </View>
              </View>

              <ReadOnlyField
                icon="at-outline"
                label="Handle"
                value={profile.handle ? `@${profile.handle}` : ''}
                colors={colors}
              />
              <ReadOnlyField icon="mail-outline" label="Email" value={profile.email} colors={colors} />
              <ReadOnlyField
                icon="call-outline"
                label="Phone Number"
                value={profile.phone}
                colors={colors}
              />

              <View style={styles.fieldBlock}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Gender</Text>
                <View style={styles.chipRow}>
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = option.key === gender;
                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => setGender(option.key)}
                        style={[
                          styles.chip,
                          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                          isSelected && {
                            backgroundColor: theme.gradient[1],
                            borderColor: theme.gradient[1],
                          },
                        ]}>
                        <Text
                          style={[
                            styles.chipLabel,
                            { color: colors.textSecondary },
                            isSelected && styles.chipLabelSelected,
                          ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Profile Border Color
                </Text>
                <View style={styles.swatchRow}>
                  {RING_GRADIENT_OPTIONS.map((option) => {
                    const isSelected =
                      option.colors[0] === ringGradient[0] && option.colors[1] === ringGradient[1];
                    return (
                      <Pressable
                        key={option.name}
                        onPress={() => setRingGradient(option.colors)}
                        accessibilityLabel={`Use ${option.name} profile border`}
                        style={[styles.swatch, isSelected && { borderColor: colors.text }]}>
                        <LinearGradient
                          colors={option.colors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.swatchFill}>
                          {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                        </LinearGradient>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <AppButton
                label="Save Changes"
                variant="primary"
                loading={isSaving}
                onPress={handleSave}
              />
            </View>
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
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: BottomTabInset,
  },
  bannerSection: {
    position: 'relative',
    marginHorizontal: Spacing.four,
    marginBottom: AVATAR_RING_SIZE / 2 + Spacing.three,
  },
  bannerWrap: {
    height: BANNER_HEIGHT,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerEditButton: {
    position: 'absolute',
    right: Spacing.three,
    bottom: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  bannerEditText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarEditWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -(AVATAR_RING_SIZE / 2),
    alignItems: 'center',
  },
  avatarEditInner: {
    width: AVATAR_RING_SIZE,
    height: AVATAR_RING_SIZE,
  },
  avatarEditRing: {
    width: AVATAR_RING_SIZE,
    height: AVATAR_RING_SIZE,
    borderRadius: AVATAR_RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditInnerCircle: {
    width: AVATAR_RING_SIZE - 8,
    height: AVATAR_RING_SIZE - 8,
    borderRadius: (AVATAR_RING_SIZE - 8) / 2,
    overflow: 'hidden',
  },
  avatarEditImage: {
    width: '100%',
    height: '100%',
  },
  avatarEditPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: Spacing.five,
  },
  fieldBlock: {
    marginBottom: Spacing.four,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  iconFieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  iconFieldInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  readOnlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    opacity: 0.75,
  },
  readOnlyValue: {
    flex: 1,
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchFill: {
    flex: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#FF8FA3',
    marginBottom: Spacing.three,
  },
});
