import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertCircle, KeyRound, X, Trash2 } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../hooks/useTheme';
import { SearchInput, SchoolCard, Button, Card, ResearchProgress, EmptyState } from '../components';
import { useSearchStore, useSettingsStore } from '../store';
import { aiService } from '../services';
import { RootStackParamList } from '../types';
import { spacing, typography, colors } from '../constants/theme';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [researchStep, setResearchStep] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { settings, isConfigured } = useSettingsStore();
  const {
    recentSearches,
    currentResults,
    lastResponse,
    isLoading,
    error,
    addRecentSearch,
    removeRecentSearch,
    setResponse,
    setLoading,
    setError,
    clearResults,
    clearRecentSearches,
  } = useSearchStore();

  useEffect(() => {
    if (isConfigured) {
      aiService.configure(settings.ai);
    }
  }, [settings.ai, isConfigured]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    if (!isConfigured) {
      Alert.alert(
        'API Key Required',
        'Please configure your AI API key in Settings to use the research feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Reset and start progress
    setSearchQuery(query.trim());
    setResearchStep(0);
    setLoading(true);
    addRecentSearch(query.trim());

    // Simulate progress steps - cycles through steps 0-2 while waiting
    let step = 0;
    let cycleCount = 0;
    progressIntervalRef.current = setInterval(() => {
      step += 1;
      if (step <= 2) {
        setResearchStep(step);
      } else if (cycleCount < 2) {
        // After first cycle, stay on step 2 (AI thinking) but cycle count tracks time
        cycleCount += 1;
      }
      // After cycling, it stays at step 2 until API returns
    }, 1200);

    try {
      const response = await aiService.research(query.trim());
      
      // Clear interval and show final step
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setResearchStep(3);
      
      // Brief delay to show completion state, then show results
      await new Promise(resolve => setTimeout(resolve, 400));
      setResponse(response);
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const quickSearches = [
    { label: 'Top CS Schools', query: 'What are the top computer science schools?' },
    { label: 'Best Value', query: 'Which schools offer the best value for education?' },
    { label: 'Test Optional', query: 'Which top schools are test optional?' },
    { label: 'Small Colleges', query: 'What are the best small liberal arts colleges?' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            School Researcher
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            AI-powered college research
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onSubmit={handleSearch}
            placeholder="Ask anything about colleges..."
          />
          <Button
            title="Search"
            onPress={handleSearch}
            loading={isLoading}
            disabled={!query.trim()}
            style={styles.searchButton}
          />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick Searches */}
          {!lastResponse && !isLoading && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Quick Searches
              </Text>
              <View style={styles.quickSearches}>
                {quickSearches.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.quickSearchChip,
                      { backgroundColor: theme.primaryLight },
                    ]}
                    onPress={() => {
                      setQuery(item.query);
                    }}
                  >
                    <Text style={[styles.quickSearchText, { color: theme.primary }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Recent Searches */}
          {!lastResponse && !isLoading && recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Clear Search History',
                      'Are you sure you want to clear all recent searches?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear All', style: 'destructive', onPress: clearRecentSearches },
                      ]
                    );
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Trash2 size={18} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              {recentSearches.slice(0, 5).map((search, idx) => (
                <View key={idx} style={styles.recentItem}>
                  <TouchableOpacity
                    style={styles.recentItemContent}
                    onPress={() => handleRecentSearch(search)}
                  >
                    <Clock size={18} color={theme.textMuted} />
                    <Text
                      style={[styles.recentText, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {search}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeRecentSearch(search)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Loading State with Progress */}
          {isLoading && (
            <ResearchProgress query={searchQuery} currentStep={researchStep} />
          )}

          {/* Error State */}
          {error && (
            <Card style={styles.errorCard}>
              <View style={styles.errorContent}>
                <AlertCircle size={24} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {error}
                </Text>
              </View>
              <Button
                title="Try Again"
                variant="outline"
                size="sm"
                onPress={handleSearch}
              />
            </Card>
          )}

          {/* AI Response */}
          {lastResponse && !isLoading && (
            <View style={styles.section}>
              <View style={styles.responseHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  AI Response
                </Text>
                <TouchableOpacity onPress={clearResults}>
                  <Text style={{ color: theme.primary }}>Clear</Text>
                </TouchableOpacity>
              </View>
              <Card>
                <Markdown
                  style={{
                    body: { color: theme.text, fontSize: typography.sizes.md, lineHeight: 24 },
                    heading1: { color: theme.text, fontSize: typography.sizes.xl, fontWeight: '700', marginBottom: spacing.sm, marginTop: spacing.md },
                    heading2: { color: theme.text, fontSize: typography.sizes.lg, fontWeight: '700', marginBottom: spacing.sm, marginTop: spacing.md },
                    heading3: { color: theme.text, fontSize: typography.sizes.md, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.sm },
                    paragraph: { color: theme.text, marginBottom: spacing.sm },
                    strong: { color: theme.text, fontWeight: '700' },
                    em: { color: theme.textSecondary, fontStyle: 'italic' },
                    bullet_list: { marginBottom: spacing.sm },
                    ordered_list: { marginBottom: spacing.sm },
                    list_item: { color: theme.text, marginBottom: spacing.xs },
                    bullet_list_icon: { color: theme.primary },
                    code_inline: { backgroundColor: theme.surfaceSecondary, color: theme.primary, paddingHorizontal: 4, borderRadius: 4, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
                    fence: { backgroundColor: theme.surfaceSecondary, padding: spacing.sm, borderRadius: 8, marginBottom: spacing.sm },
                    code_block: { color: theme.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
                    link: { color: theme.primary },
                    hr: { backgroundColor: theme.border, height: 1, marginVertical: spacing.md },
                  }}
                >
                  {lastResponse.content}
                </Markdown>
              </Card>
            </View>
          )}

          {/* School Results */}
          {currentResults.length > 0 && !isLoading && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Schools Found
              </Text>
              {currentResults.map((school, index) => (
                <SchoolCard
                  key={school.id || `school-${index}`}
                  school={school}
                  onPress={() =>
                    navigation.navigate('SchoolDetail', {
                      schoolId: school.id || `school-${index}`,
                      school,
                    })
                  }
                />
              ))}
            </View>
          )}

          {/* Empty state for configured but no search */}
          {!isConfigured && !isLoading && (
            <EmptyState
              icon={KeyRound}
              title="Setup Required"
              message="Add your AI API key in Settings to start researching colleges."
              action={
                <Button
                  title="Go to Settings"
                  onPress={() => {
                    // @ts-ignore - navigation type
                    navigation.getParent()?.navigate('Settings');
                  }}
                />
              }
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  searchButton: {
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  quickSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickSearchChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  quickSearchText: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  recentItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recentText: {
    fontSize: typography.sizes.md,
    flex: 1,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  responseText: {
    fontSize: typography.sizes.md,
    lineHeight: 24,
  },
  errorCard: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
});
