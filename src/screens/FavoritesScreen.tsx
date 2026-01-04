import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2, Trash2, Heart, X } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { SchoolCard, Button, EmptyState } from '../components';
import { useFavoritesStore } from '../store';
import { exportService } from '../services';
import { RootStackParamList, FavoriteSchool } from '../types';
import { spacing, typography, borderRadius, colors } from '../constants/theme';

type FavoritesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { theme } = useTheme();
  const { favorites, clearAll, removeFavorite } = useFavoritesStore();
  const [exporting, setExporting] = useState(false);

  const confirmRemoveFavorite = (schoolId: string, schoolName: string) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove ${schoolName} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(schoolId) },
      ]
    );
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (favorites.length === 0) {
      Alert.alert('No Favorites', 'Add some schools to your favorites first.');
      return;
    }

    setExporting(true);
    try {
      if (format === 'csv') {
        await exportService.exportToCSV(favorites);
      } else {
        await exportService.exportToJSON(favorites);
      }
    } catch (err) {
      Alert.alert('Export Failed', 'Unable to export your favorites.');
    } finally {
      setExporting(false);
    }
  };

  const showExportOptions = () => {
    Alert.alert('Export Favorites', 'Choose a format', [
      { text: 'CSV (Spreadsheet)', onPress: () => handleExport('csv') },
      { text: 'JSON (Data)', onPress: () => handleExport('json') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const confirmClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorited schools?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  const renderItem = ({ item }: { item: FavoriteSchool }) => (
    <View style={styles.favoriteItem}>
      <SchoolCard
        school={item.school}
        onPress={() =>
          navigation.navigate('SchoolDetail', {
            schoolId: item.schoolId,
            school: item.school,
          })
        }
      />
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.error }]}
        onPress={() => confirmRemoveFavorite(item.schoolId, item.school.name)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Favorites</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {favorites.length} {favorites.length === 1 ? 'school' : 'schools'} saved
          </Text>
        </View>
        {favorites.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={showExportOptions}
              style={[styles.iconButton, { backgroundColor: theme.primaryLight }]}
              disabled={exporting}
            >
              <Share2 size={20} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmClearAll}
              style={[styles.iconButton, { backgroundColor: theme.surfaceSecondary }]}
            >
              <Trash2 size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Favorites Yet"
          message="Start researching schools and tap the heart icon to save them here."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => item.schoolId || `fav-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  favoriteItem: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
