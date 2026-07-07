import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenGlow } from '@/components/screen-glow';
import { SearchBar } from '@/components/search-bar';
import { TopBar } from '@/components/top-bar';
import { useAppTheme } from '@/context/theme-context';

export function ChatsScreen() {
  const { colors } = useAppTheme();
  const [query, setQuery] = useState('');
  const isSearching = query.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenGlow />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Chats" />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search conversations" />
        {isSearching ? (
          <EmptyState
            icon="search-outline"
            title="No matches found"
            description={`No conversations match "${query.trim()}".`}
          />
        ) : (
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No conversations yet"
            description="When you connect with someone, your chats will appear here."
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
});
