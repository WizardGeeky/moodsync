import { Ionicons } from '@expo/vector-icons';
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

import { AppButton } from '@/components/ui/button';
import { useAppTheme } from '@/context/theme-context';
import { BottomTabInset, Spacing } from '@/constants/theme';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😔', label: 'Reflective' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🥰', label: 'Loved' },
];

type PostType = 'post' | 'poll' | 'moment' | 'live';

const POST_TYPES: { key: PostType; label: string; icon: ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'post', label: 'Post', icon: 'chatbubble-outline' },
  { key: 'poll', label: 'Poll', icon: 'stats-chart-outline' },
  { key: 'moment', label: 'Moment', icon: 'image-outline' },
  { key: 'live', label: 'Live', icon: 'radio-outline' },
];

const TYPE_COPY: Record<
  PostType,
  { headerTitle: string; buttonLabel: string; promptLabel?: string; placeholder?: string }
> = {
  post: {
    headerTitle: 'New Post',
    buttonLabel: 'Post',
  },
  poll: {
    headerTitle: 'New Poll',
    buttonLabel: 'Post Poll',
  },
  moment: {
    headerTitle: 'New Moment',
    buttonLabel: 'Post Moment',
    promptLabel: 'Add a caption',
    placeholder: 'Say something about this moment...',
  },
  live: {
    headerTitle: 'Go Live',
    buttonLabel: 'Go Live',
    promptLabel: "What's your live about?",
    placeholder: 'Let people know what to expect...',
  },
};

const MIN_POLL_OPTIONS = 2;
const MAX_POLL_OPTIONS = 6;

export function CreatePostScreen() {
  const router = useRouter();
  const { theme, colors } = useAppTheme();
  const [postType, setPostType] = useState<PostType>('post');
  const [selectedMood, setSelectedMood] = useState(MOODS[0].label);

  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [hashtagDraft, setHashtagDraft] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);

  const [error, setError] = useState<string | undefined>();
  const [isPosting, setIsPosting] = useState(false);
  const copy = TYPE_COPY[postType];

  function addHashtag() {
    const cleaned = hashtagDraft.trim().replace(/^#/, '').replace(/\s+/g, '');
    if (!cleaned) return;
    setHashtags((previous) => (previous.includes(cleaned) ? previous : [...previous, cleaned]));
    setHashtagDraft('');
  }

  function removeHashtag(tag: string) {
    setHashtags((previous) => previous.filter((item) => item !== tag));
  }

  function updatePollOption(index: number, value: string) {
    setPollOptions((previous) => previous.map((option, i) => (i === index ? value : option)));
  }

  function addPollOption() {
    setPollOptions((previous) =>
      previous.length >= MAX_POLL_OPTIONS ? previous : [...previous, ''],
    );
  }

  function removePollOption(index: number) {
    setPollOptions((previous) => previous.filter((_, i) => i !== index));
    setCorrectOptionIndex((previous) => {
      if (previous === null) return previous;
      if (previous === index) return null;
      return previous > index ? previous - 1 : previous;
    });
  }

  function handlePost() {
    if (postType === 'poll') {
      if (pollQuestion.trim().length === 0) {
        setError('Add a question for your poll');
        return;
      }
      if (pollOptions.some((option) => option.trim().length === 0)) {
        setError('Fill in all poll options');
        return;
      }
      if (correctOptionIndex === null) {
        setError('Select the correct answer');
        return;
      }
    } else if (postType === 'post') {
      if (heading.trim().length === 0 || text.trim().length === 0) {
        setError('Add a heading and description');
        return;
      }
    } else if (text.trim().length === 0) {
      setError('Share a few words about your moment');
      return;
    }

    setError(undefined);
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      router.back();
    }, 900);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={[styles.closeButton, { backgroundColor: colors.iconButtonBackground }]}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{copy.headerTitle}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text
              style={[styles.sectionLabel, styles.sectionLabelFirst, { color: colors.textSecondary }]}>
              Post type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodRow}>
              {POST_TYPES.map((type) => {
                const isSelected = type.key === postType;
                return (
                  <Pressable
                    key={type.key}
                    onPress={() => setPostType(type.key)}
                    style={[
                      styles.moodChip,
                      { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                      isSelected && {
                        backgroundColor: theme.gradient[1],
                        borderColor: theme.gradient[1],
                      },
                    ]}>
                    <Ionicons
                      name={type.icon}
                      size={16}
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.moodLabel,
                        { color: colors.textSecondary },
                        isSelected && styles.moodLabelSelected,
                      ]}>
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              How are you feeling?
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodRow}>
              {MOODS.map((mood) => {
                const isSelected = mood.label === selectedMood;
                return (
                  <Pressable
                    key={mood.label}
                    onPress={() => setSelectedMood(mood.label)}
                    style={[
                      styles.moodChip,
                      { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                      isSelected && {
                        backgroundColor: theme.gradient[1],
                        borderColor: theme.gradient[1],
                      },
                    ]}>
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        { color: colors.textSecondary },
                        isSelected && styles.moodLabelSelected,
                      ]}>
                      {mood.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {postType === 'poll' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Question
                </Text>
                <View
                  style={[
                    styles.iconFieldWrap,
                    styles.fieldShadow,
                    { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                  ]}>
                  <Ionicons name="help-circle-outline" size={18} color={colors.textMuted} />
                  <TextInput
                    value={pollQuestion}
                    onChangeText={setPollQuestion}
                    placeholder="e.g. Which mood matches your day?"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.iconFieldInput, { color: colors.text }]}
                  />
                </View>

                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Options
                </Text>
                {pollOptions.map((option, index) => {
                  const isCorrect = correctOptionIndex === index;
                  return (
                    <View key={index} style={styles.pollOptionRow}>
                      <Pressable
                        onPress={() => setCorrectOptionIndex(index)}
                        accessibilityLabel={`Mark option ${index + 1} as correct`}
                        style={[
                          styles.correctToggle,
                          { borderColor: colors.surfaceBorder },
                          isCorrect && {
                            backgroundColor: theme.gradient[1],
                            borderColor: theme.gradient[1],
                          },
                        ]}>
                        {isCorrect && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </Pressable>
                      <TextInput
                        value={option}
                        onChangeText={(value) => updatePollOption(index, value)}
                        placeholder={`Option ${index + 1}`}
                        placeholderTextColor={colors.textMuted}
                        style={[
                          styles.pollOptionInput,
                          styles.fieldShadow,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.surfaceBorder,
                            color: colors.text,
                          },
                        ]}
                      />
                      {pollOptions.length > MIN_POLL_OPTIONS && (
                        <Pressable
                          onPress={() => removePollOption(index)}
                          hitSlop={8}
                          accessibilityLabel={`Remove option ${index + 1}`}>
                          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                        </Pressable>
                      )}
                    </View>
                  );
                })}
                {pollOptions.length < MAX_POLL_OPTIONS && (
                  <Pressable
                    onPress={addPollOption}
                    style={[styles.addOptionButton, { borderColor: colors.surfaceBorder }]}>
                    <Ionicons name="add" size={16} color={colors.textSecondary} />
                    <Text style={[styles.addOptionText, { color: colors.textSecondary }]}>
                      Add option
                    </Text>
                  </Pressable>
                )}
                <Text style={[styles.hintText, { color: colors.textMuted }]}>
                  Tap the circle next to an option to mark it as the correct answer.
                </Text>
              </>
            )}

            {postType === 'post' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Heading
                </Text>
                <View
                  style={[
                    styles.iconFieldWrap,
                    styles.fieldShadow,
                    { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                  ]}>
                  <Ionicons name="bulb-outline" size={18} color={colors.textMuted} />
                  <TextInput
                    value={heading}
                    onChangeText={setHeading}
                    placeholder="Your idea or thought"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.iconFieldInput, { color: colors.text }]}
                  />
                </View>

                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Description
                </Text>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Share a moment, a feeling, anything..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.textInput,
                    styles.fieldShadow,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.surfaceBorder,
                      color: colors.text,
                    },
                  ]}
                  multiline
                  textAlignVertical="top"
                />

                <View style={[styles.addPhoto, { borderColor: colors.surfaceBorder }]}>
                  <Ionicons name="image-outline" size={20} color={colors.textSecondary} />
                  <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
                    Add Photo
                  </Text>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Hashtags
                </Text>
                <View style={styles.hashtagRow}>
                  <View
                    style={[
                      styles.hashtagInputWrap,
                      styles.fieldShadow,
                      { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                    ]}>
                    <Ionicons name="pricetag-outline" size={16} color={colors.textMuted} />
                    <TextInput
                      value={hashtagDraft}
                      onChangeText={setHashtagDraft}
                      placeholder="Add a hashtag"
                      placeholderTextColor={colors.textMuted}
                      style={[styles.hashtagInput, { color: colors.text }]}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={addHashtag}
                    />
                  </View>
                  <Pressable
                    onPress={addHashtag}
                    accessibilityLabel="Add hashtag"
                    style={[styles.hashtagAddButton, { backgroundColor: theme.gradient[1] }]}>
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </Pressable>
                </View>
                {hashtags.length > 0 && (
                  <View style={styles.hashtagList}>
                    {hashtags.map((tag) => (
                      <View
                        key={tag}
                        style={[
                          styles.hashtagChip,
                          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
                        ]}>
                        <Text style={[styles.hashtagChipText, { color: colors.text }]}>#{tag}</Text>
                        <Pressable
                          onPress={() => removeHashtag(tag)}
                          hitSlop={6}
                          accessibilityLabel={`Remove hashtag ${tag}`}>
                          <Ionicons name="close" size={14} color={colors.textMuted} />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            {(postType === 'moment' || postType === 'live') && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  {copy.promptLabel}
                </Text>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder={copy.placeholder}
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.textInput,
                    styles.fieldShadow,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.surfaceBorder,
                      color: colors.text,
                    },
                  ]}
                  multiline
                  textAlignVertical="top"
                />
                {postType === 'moment' && (
                  <View style={[styles.addPhoto, { borderColor: colors.surfaceBorder }]}>
                    <Ionicons name="image-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
                      Add Photo
                    </Text>
                  </View>
                )}
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AppButton
              label={copy.buttonLabel}
              variant="primary"
              loading={isPosting}
              onPress={handlePost}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    paddingHorizontal: Spacing.five,
    paddingBottom: BottomTabInset,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  sectionLabelFirst: {
    marginTop: 0,
  },
  moodRow: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    borderWidth: 1,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  moodLabelSelected: {
    color: '#FFFFFF',
  },
  fieldShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
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
  textInput: {
    minHeight: 130,
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#FF8FA3',
    marginTop: Spacing.two,
  },
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hashtagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  hashtagInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  hashtagInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  hashtagAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hashtagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    borderWidth: 1,
  },
  hashtagChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  correctToggle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollOptionInput: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: Spacing.one,
  },
  addOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    marginTop: Spacing.two,
  },
});
