import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Info,
  GraduationCap,
  BookOpen,
  Users,
  MapPin,
  DollarSign,
  Globe,
  ChevronRight,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../hooks/useTheme';
import { Card, Button, LoadingSpinner } from '../components';
import { useFavoritesStore, useSettingsStore } from '../store';
import { aiService } from '../services';
import { RootStackParamList } from '../types';
import { spacing, typography, borderRadius, colors } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SchoolDetail'>;

type TabKey = 'overview' | 'admissions' | 'academics' | 'faculty';

export function SchoolDetailScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { school } = route.params;
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { isConfigured } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [facultyInfo, setFacultyInfo] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  if (!school) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>School not found</Text>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(school.id);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(school.id);
    } else {
      addFavorite(school);
    }
  };

  const loadFacultyForMajor = async (major: string) => {
    if (!isConfigured) return;
    
    // If same major is already loaded, just switch to faculty tab
    if (selectedMajor === major && facultyInfo) {
      setActiveTab('faculty');
      return;
    }
    
    setSelectedMajor(major);
    setFacultyInfo(null);
    setActiveTab('faculty');
    setLoadingFaculty(true);
    
    try {
      const response = await aiService.researchFaculty(school.name, major);
      setFacultyInfo(response.content);
    } catch (err) {
      setFacultyInfo('Unable to load faculty information. Please try again.');
    } finally {
      setLoadingFaculty(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: typeof Info }[] = [
    { key: 'overview', label: 'Overview', icon: Info },
    { key: 'admissions', label: 'Admissions', icon: GraduationCap },
    { key: 'academics', label: 'Academics', icon: BookOpen },
    { key: 'faculty', label: 'Faculty', icon: Users },
  ];

  const settingLabels = {
    urban: 'Urban Campus',
    suburban: 'Suburban Campus',
    rural: 'Rural Campus',
  };

  const testPolicyLabels = {
    required: 'Required',
    optional: 'Test Optional',
    'not-considered': 'Test Blind',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.schoolName, { color: theme.text }]} numberOfLines={2}>
            {school.name}
          </Text>
          <Text style={[styles.location, { color: theme.textSecondary }]}>
            {school.location.city}, {school.location.state}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Heart
            size={28}
            color={isFav ? colors.accent[500] : theme.textMuted}
            fill={isFav ? colors.accent[500] : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsContainer, { borderBottomColor: theme.border }]}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && styles.tabActive,
                isActive && { borderBottomColor: theme.primary },
              ]}
              onPress={() => {
                setActiveTab(tab.key);
              }}
            >
              <TabIcon
                size={16}
                color={isActive ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? theme.primary : theme.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <Card style={styles.card}>
              <View style={styles.statGrid}>
                <View style={styles.gridItem}>
                  <Users size={24} color={theme.primary} />
                  <Text style={[styles.gridValue, { color: theme.text }]}>
                    {school.size.undergraduate.toLocaleString()}
                  </Text>
                  <Text style={[styles.gridLabel, { color: theme.textMuted }]}>
                    Undergrads
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <MapPin size={24} color={theme.primary} />
                  <Text style={[styles.gridValue, { color: theme.text }]}>
                    {settingLabels[school.location.setting]}
                  </Text>
                  <Text style={[styles.gridLabel, { color: theme.textMuted }]}>
                    Setting
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <DollarSign size={24} color={theme.primary} />
                  <Text style={[styles.gridValue, { color: theme.text }]}>
                    ${school.cost.totalCOA.toLocaleString()}
                  </Text>
                  <Text style={[styles.gridLabel, { color: theme.textMuted }]}>
                    Total Cost
                  </Text>
                </View>
                {school.academics.studentFacultyRatio && (
                  <View style={styles.gridItem}>
                    <GraduationCap size={24} color={theme.primary} />
                    <Text style={[styles.gridValue, { color: theme.text }]}>
                      {school.academics.studentFacultyRatio}
                    </Text>
                    <Text style={[styles.gridLabel, { color: theme.textMuted }]}>
                      Student:Faculty
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Rankings Card */}
            {school.rankings && (school.rankings.overall || school.rankings.nationalUniversity || school.rankings.liberalArts) && (
              <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  Rankings
                </Text>
                <View style={styles.rankingsGrid}>
                  {(school.rankings.overall || school.rankings.nationalUniversity) && (
                    <View style={[styles.rankingItem, { backgroundColor: theme.surfaceSecondary }]}>
                      <Text style={[styles.rankingNumber, { color: theme.primary }]}>
                        #{school.rankings.overall || school.rankings.nationalUniversity}
                      </Text>
                      <Text style={[styles.rankingLabel, { color: theme.textSecondary }]}>
                        National University
                      </Text>
                    </View>
                  )}
                  {school.rankings.liberalArts && (
                    <View style={[styles.rankingItem, { backgroundColor: theme.surfaceSecondary }]}>
                      <Text style={[styles.rankingNumber, { color: theme.primary }]}>
                        #{school.rankings.liberalArts}
                      </Text>
                      <Text style={[styles.rankingLabel, { color: theme.textSecondary }]}>
                        Liberal Arts
                      </Text>
                    </View>
                  )}
                  {school.rankings.engineering && (
                    <View style={[styles.rankingItem, { backgroundColor: theme.surfaceSecondary }]}>
                      <Text style={[styles.rankingNumber, { color: theme.primary }]}>
                        #{school.rankings.engineering}
                      </Text>
                      <Text style={[styles.rankingLabel, { color: theme.textSecondary }]}>
                        Engineering
                      </Text>
                    </View>
                  )}
                  {school.rankings.business && (
                    <View style={[styles.rankingItem, { backgroundColor: theme.surfaceSecondary }]}>
                      <Text style={[styles.rankingNumber, { color: theme.primary }]}>
                        #{school.rankings.business}
                      </Text>
                      <Text style={[styles.rankingLabel, { color: theme.textSecondary }]}>
                        Business
                      </Text>
                    </View>
                  )}
                </View>
                {school.rankings.source && (
                  <Text style={[styles.rankingSource, { color: theme.textMuted }]}>
                    Source: {school.rankings.source}
                  </Text>
                )}
              </Card>
            )}

            {school.website && (
              <Button
                title="Visit Website"
                variant="outline"
                icon={<Globe size={18} color={theme.primary} />}
                onPress={() => Linking.openURL(school.website!)}
                style={styles.websiteButton}
              />
            )}
          </>
        )}

        {/* Admissions Tab */}
        {activeTab === 'admissions' && (
          <>
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Acceptance Rate
              </Text>
              {school.admissions.acceptanceRate ? (
                <View style={styles.rateContainer}>
                  <Text style={[styles.rateValue, { color: theme.primary }]}>
                    {(school.admissions.acceptanceRate * 100).toFixed(1)}%
                  </Text>
                  <View
                    style={[
                      styles.rateBar,
                      { backgroundColor: theme.surfaceSecondary },
                    ]}
                  >
                    <View
                      style={[
                        styles.rateFill,
                        {
                          backgroundColor: theme.primary,
                          width: `${school.admissions.acceptanceRate * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ) : (
                <Text style={[styles.naText, { color: theme.textMuted }]}>
                  Not available
                </Text>
              )}
            </Card>

            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Test Requirements
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.primaryLight },
                ]}
              >
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {testPolicyLabels[school.admissions.testPolicy]}
                </Text>
              </View>
            </Card>

            {school.admissions.satRange && (
              <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  SAT Score Range
                </Text>
                <View style={styles.scoreRange}>
                  <Text style={[styles.scoreValue, { color: theme.text }]}>
                    {school.admissions.satRange.low}
                  </Text>
                  <View
                    style={[
                      styles.scoreLine,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                  <Text style={[styles.scoreValue, { color: theme.text }]}>
                    {school.admissions.satRange.high}
                  </Text>
                </View>
                <Text style={[styles.scoreLabel, { color: theme.textMuted }]}>
                  25th - 75th Percentile
                </Text>
              </Card>
            )}

            {school.admissions.actRange && (
              <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  ACT Score Range
                </Text>
                <View style={styles.scoreRange}>
                  <Text style={[styles.scoreValue, { color: theme.text }]}>
                    {school.admissions.actRange.low}
                  </Text>
                  <View
                    style={[
                      styles.scoreLine,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                  <Text style={[styles.scoreValue, { color: theme.text }]}>
                    {school.admissions.actRange.high}
                  </Text>
                </View>
                <Text style={[styles.scoreLabel, { color: theme.textMuted }]}>
                  25th - 75th Percentile
                </Text>
              </Card>
            )}
          </>
        )}

        {/* Academics Tab */}
        {activeTab === 'academics' && (
          <>
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Top Majors
              </Text>
              <Text style={[styles.majorHint, { color: theme.textMuted }]}>
                Tap a major to explore faculty and research
              </Text>
              {school.academics.topMajors.map((major, idx) => {
                // Find ranking for this major
                const majorRanking = school.academics.majorRankings?.find(
                  r => r.name.toLowerCase() === major.toLowerCase()
                );
                
                return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.majorItem,
                    { borderBottomColor: theme.border },
                    idx === school.academics.topMajors.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => loadFacultyForMajor(major)}
                  disabled={!isConfigured}
                >
                  <View
                    style={[
                      styles.majorNumber,
                      { backgroundColor: theme.primaryLight },
                    ]}
                  >
                    <Text style={[styles.majorNumberText, { color: theme.primary }]}>
                      {idx + 1}
                    </Text>
                  </View>
                  <View style={styles.majorContent}>
                    <Text style={[styles.majorName, { color: theme.text }]}>
                      {major}
                    </Text>
                    {majorRanking?.rank && (
                      <View style={[styles.majorRankBadge, { backgroundColor: colors.accent[500] }]}>
                        <Text style={styles.majorRankText}>#{majorRanking.rank}</Text>
                      </View>
                    )}
                  </View>
                  {isConfigured && (
                    <ChevronRight size={20} color={theme.textMuted} />
                  )}
                </TouchableOpacity>
              );
              })}
            </Card>
            {!isConfigured && (
              <Card style={styles.card}>
                <Text style={[styles.naText, { color: theme.textMuted }]}>
                  Configure your AI API key in Settings to explore faculty by major.
                </Text>
              </Card>
            )}
          </>
        )}

        {/* Faculty Tab */}
        {activeTab === 'faculty' && (
          <>
            {selectedMajor && (
              <View style={styles.selectedMajorHeader}>
                <Text style={[styles.selectedMajorLabel, { color: theme.textMuted }]}>
                  Exploring faculty in
                </Text>
                <Text style={[styles.selectedMajorName, { color: theme.primary }]}>
                  {selectedMajor}
                </Text>
              </View>
            )}
            {loadingFaculty ? (
              <LoadingSpinner message={`Searching for ${selectedMajor} faculty...`} />
            ) : facultyInfo ? (
              <Card style={styles.card}>
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
                    link: { color: theme.primary },
                    hr: { backgroundColor: theme.border, height: 1, marginVertical: spacing.md },
                  }}
                >
                  {facultyInfo}
                </Markdown>
              </Card>
            ) : !isConfigured ? (
              <Card style={styles.card}>
                <Text style={[styles.naText, { color: theme.textMuted }]}>
                  Configure your AI API key in Settings to view faculty information.
                </Text>
              </Card>
            ) : (
              <Card style={styles.card}>
                <Text style={[styles.naText, { color: theme.textMuted }]}>
                  Select a major from the Academics tab to explore faculty and research in that department.
                </Text>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  schoolName: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
  },
  location: {
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  favoriteButton: {
    marginLeft: spacing.md,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  gridValue: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  gridLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  websiteButton: {
    marginTop: spacing.sm,
  },
  rateContainer: {
    alignItems: 'center',
  },
  rateValue: {
    fontSize: typography.sizes.xxxl,
    fontWeight: '800',
  },
  rateBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: spacing.md,
  },
  rateFill: {
    height: '100%',
    borderRadius: 4,
  },
  naText: {
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  scoreRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  scoreValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
  },
  scoreLine: {
    flex: 1,
    height: 3,
    maxWidth: 100,
    borderRadius: 2,
  },
  scoreLabel: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  majorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  majorNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  majorNumberText: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
  },
  majorName: {
    fontSize: typography.sizes.md,
  },
  majorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  majorRankBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  majorRankText: {
    color: '#fff',
    fontSize: typography.sizes.xs,
    fontWeight: '700',
  },
  majorHint: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
  },
  facultyText: {
    fontSize: typography.sizes.md,
    lineHeight: 24,
  },
  selectedMajorHeader: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  selectedMajorLabel: {
    fontSize: typography.sizes.sm,
  },
  selectedMajorName: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  // Rankings styles
  rankingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rankingItem: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: '45%',
    flex: 1,
  },
  rankingNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
  },
  rankingLabel: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  rankingSource: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});
