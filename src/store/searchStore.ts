import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { School, ResearchResponse } from '../types';
import { STORAGE_KEYS } from '../constants';

interface SearchState {
  recentSearches: string[];
  currentResults: School[];
  lastResponse: ResearchResponse | null;
  isLoading: boolean;
  error: string | null;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  setResults: (schools: School[]) => void;
  setResponse: (response: ResearchResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
  clearRecentSearches: () => void;
}

const MAX_RECENT_SEARCHES = 10;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      currentResults: [],
      lastResponse: null,
      isLoading: false,
      error: null,

      addRecentSearch: (query) =>
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== query);
          return {
            recentSearches: [query, ...filtered].slice(0, MAX_RECENT_SEARCHES),
          };
        }),

      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        })),

      setResults: (schools) =>
        set({
          currentResults: schools,
          error: null,
        }),

      setResponse: (response) =>
        set({
          lastResponse: response,
          currentResults: response.schools || [],
          error: null,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      clearResults: () =>
        set({
          currentResults: [],
          lastResponse: null,
          error: null,
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: STORAGE_KEYS.RECENT_SEARCHES,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);

