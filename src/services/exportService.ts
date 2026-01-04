import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { FavoriteSchool } from '../types';

class ExportService {
  async exportToCSV(favorites: FavoriteSchool[]): Promise<void> {
    const headers = [
      'School Name',
      'City',
      'State',
      'Setting',
      'Undergraduate Size',
      'Acceptance Rate',
      'SAT Range',
      'ACT Range',
      'Test Policy',
      'Total Cost',
      'Top Majors',
      'Notes',
      'Date Added',
    ];

    const rows = favorites.map((fav) => {
      const s = fav.school;
      return [
        this.escapeCSV(s.name),
        this.escapeCSV(s.location.city),
        this.escapeCSV(s.location.state),
        s.location.setting,
        s.size.undergraduate.toString(),
        s.admissions.acceptanceRate
          ? `${(s.admissions.acceptanceRate * 100).toFixed(1)}%`
          : 'N/A',
        s.admissions.satRange
          ? `${s.admissions.satRange.low}-${s.admissions.satRange.high}`
          : 'N/A',
        s.admissions.actRange
          ? `${s.admissions.actRange.low}-${s.admissions.actRange.high}`
          : 'N/A',
        s.admissions.testPolicy,
        `$${s.cost.totalCOA.toLocaleString()}`,
        this.escapeCSV(s.academics.topMajors.join('; ')),
        this.escapeCSV(fav.notes || ''),
        new Date(fav.addedAt).toLocaleDateString(),
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const fileName = `school-favorites-${Date.now()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Favorite Schools',
      });
    }
  }

  async exportToJSON(favorites: FavoriteSchool[]): Promise<void> {
    const data = {
      exportDate: new Date().toISOString(),
      totalSchools: favorites.length,
      schools: favorites.map((fav) => ({
        ...fav.school,
        notes: fav.notes,
        addedAt: fav.addedAt,
      })),
    };

    const json = JSON.stringify(data, null, 2);

    const fileName = `school-favorites-${Date.now()}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Export Favorite Schools',
      });
    }
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

export const exportService = new ExportService();

