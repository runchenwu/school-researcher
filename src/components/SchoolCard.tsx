import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Heart, MapPin, Building2, Home, TreePine, Trophy, GraduationCap } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { School } from '../types';
import { useFavoritesStore } from '../store';
import { spacing, typography, borderRadius, colors } from '../constants/theme';

// Helper to get logo URL from school website
function getLogoUrl(website?: string): string | null {
  if (!website) return null;
  try {
    // Clean up the URL
    let cleanUrl = website.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const url = new URL(cleanUrl);
    // Extract the domain (e.g., berkeley.edu from www.berkeley.edu)
    const domain = url.hostname.replace(/^www\./, '');
    // Use Google's favicon service (more reliable, supports more domains)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

interface SchoolCardProps {
  school: School;
  onPress: () => void;
}

export function SchoolCard({ school, onPress }: SchoolCardProps) {
  const { theme } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const isFav = isFavorite(school.id);
  const [logoError, setLogoError] = useState(false);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(school.id);
    } else {
      addFavorite(school);
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Safe access to nested properties with defaults
  const location = school.location || {};
  const setting = location.setting || 'urban';
  const city = location.city || 'Unknown';
  const state = location.state || '';
  const size = school.size || {};
  const rankings = school.rankings || {};
  const admissions = school.admissions || {};
  const cost = school.cost || {};
  const academics = school.academics || {};
  const topMajors = academics.topMajors || [];
  
  // Get the primary ranking to display
  const primaryRank = rankings.overall || rankings.nationalUniversity || rankings.liberalArts;
  
  // Get logo URL
  const logoUrl = getLogoUrl(school.website);

  const SettingIcon = {
    urban: Building2,
    suburban: Home,
    rural: TreePine,
  }[setting] || Building2;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {/* School Logo */}
            <View style={[styles.logoContainer, { backgroundColor: theme.surfaceSecondary }]}>
              {logoUrl && !logoError ? (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.logo}
                  onError={() => setLogoError(true)}
                  resizeMode="contain"
                />
              ) : (
                <GraduationCap size={24} color={theme.textMuted} />
              )}
            </View>
            
            <View style={styles.headerInfo}>
              <View style={styles.titleRow}>
                {primaryRank && (
                  <View style={[styles.rankBadge, { backgroundColor: colors.accent[500] }]}>
                    <Trophy size={10} color="#fff" />
                    <Text style={styles.rankText}>#{primaryRank}</Text>
                  </View>
                )}
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
                  {school.name || 'Unknown School'}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={12} color={theme.textSecondary} />
                <Text style={[styles.location, { color: theme.textSecondary }]}>
                  {city}{state ? `, ${state}` : ''}
                </Text>
                <View style={[styles.settingBadge, { backgroundColor: theme.primaryLight }]}>
                  <SettingIcon size={10} color={theme.primary} />
                  <Text style={[styles.settingText, { color: theme.primary }]}>
                    {setting}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Favorite Button */}
            <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Heart
                size={24}
                color={isFav ? colors.accent[500] : theme.textMuted}
                fill={isFav ? colors.accent[500] : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stats}>
          {size.undergraduate != null && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {formatNumber(size.undergraduate)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                Students
              </Text>
            </View>
          )}
          
          {admissions.acceptanceRate != null && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {(admissions.acceptanceRate * 100).toFixed(0)}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                Accept Rate
              </Text>
            </View>
          )}

          {admissions.satRange && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {admissions.satRange.low}-{admissions.satRange.high}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                SAT Range
              </Text>
            </View>
          )}

          {cost.totalCOA != null && (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                ${(cost.totalCOA / 1000).toFixed(0)}k
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                Total Cost
              </Text>
            </View>
          )}
        </View>

        {topMajors.length > 0 && (
          <View style={styles.majors}>
            {topMajors.slice(0, 3).map((major, idx) => (
              <View
                key={idx}
                style={[styles.majorBadge, { backgroundColor: theme.surfaceSecondary }]}
              >
                <Text style={[styles.majorText, { color: theme.textSecondary }]}>
                  {major}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    flex: 1,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  rankText: {
    color: '#fff',
    fontSize: typography.sizes.xs,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  location: {
    fontSize: typography.sizes.xs,
  },
  settingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: spacing.xs,
    gap: 4,
  },
  settingText: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  majors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  majorBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  majorText: {
    fontSize: typography.sizes.xs,
  },
});
