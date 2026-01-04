import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteSchool, School } from '../types';
import { STORAGE_KEYS } from '../constants';

interface FavoritesState {
  favorites: FavoriteSchool[];
  addFavorite: (school: School, notes?: string) => void;
  removeFavorite: (schoolId: string) => void;
  updateNotes: (schoolId: string, notes: string) => void;
  isFavorite: (schoolId: string) => boolean;
  clearAll: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (school, notes) =>
        set((state) => {
          // Don't add duplicates
          if (state.favorites.some((f) => f.schoolId === school.id)) {
            return state;
          }
          return {
            favorites: [
              ...state.favorites,
              {
                schoolId: school.id,
                school,
                addedAt: new Date(),
                notes,
              },
            ],
          };
        }),

      removeFavorite: (schoolId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.schoolId !== schoolId),
        })),

      updateNotes: (schoolId, notes) =>
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.schoolId === schoolId ? { ...f, notes } : f
          ),
        })),

      isFavorite: (schoolId) => {
        return get().favorites.some((f) => f.schoolId === schoolId);
      },

      clearAll: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

