import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Heart, MapPin, Building2, Home, TreePine, Trophy } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { School } from '../types';
import { useFavoritesStore } from '../store';
import { spacing, typography, borderRadius, colors } from '../constants/theme';

interface SchoolCardProps {
  school: School;
  onPress: () => void;
}

export function SchoolCard({ school, onPress }: SchoolCardProps) {
  const { theme } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const isFav = isFavorite(school.id);

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

  const SettingIcon = {
    urban: Building2,
    suburban: Home,
    rural: TreePine,
  }[setting] || Building2;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {primaryRank && (
              <View style={[styles.rankBadge, { backgroundColor: colors.accent[500] }]}>
                <Trophy size={12} color="#fff" />
                <Text style={styles.rankText}>#{primaryRank}</Text>
              </View>
            )}
            <Text style={[styles.name, { color: theme.text }, primaryRank && styles.nameWithRank]} numberOfLines={1}>
              {school.name || 'Unknown School'}
            </Text>
            <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Heart
                size={24}
                color={isFav ? colors.accent[500] : theme.textMuted}
                fill={isFav ? colors.accent[500] : 'transparent'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={theme.textSecondary} />
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              {city}{state ? `, ${state}` : ''}
            </Text>
            <View style={[styles.settingBadge, { backgroundColor: theme.primaryLight }]}>
              <SettingIcon size={12} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.primary }]}>
                {setting}
              </Text>
            </View>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  nameWithRank: {
    marginLeft: spacing.sm,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  rankText: {
    color: '#fff',
    fontSize: typography.sizes.sm,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  location: {
    fontSize: typography.sizes.sm,
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
