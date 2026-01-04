import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIProvider, AppSettings } from '../types';
import { DEFAULT_AI_SETTINGS, STORAGE_KEYS } from '../constants';

interface SettingsState {
  settings: AppSettings;
  isConfigured: boolean;
  setAIProvider: (provider: AIProvider) => void;
  setAPIKey: (key: string) => void;
  setModel: (model: string) => void;
  setHighSchool: (name: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resetSettings: () => void;
}

const initialSettings: AppSettings = {
  ai: DEFAULT_AI_SETTINGS,
  theme: 'system',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: initialSettings,
      isConfigured: false,

      setAIProvider: (provider) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ai: { ...state.settings.ai, provider },
          },
        })),

      setAPIKey: (apiKey) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ai: { ...state.settings.ai, apiKey },
          },
          isConfigured: apiKey.length > 0,
        })),

      setModel: (model) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ai: { ...state.settings.ai, model },
          },
        })),

      setHighSchool: (highSchoolName) =>
        set((state) => ({
          settings: { ...state.settings, highSchoolName },
        })),

      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      resetSettings: () =>
        set({
          settings: initialSettings,
          isConfigured: false,
        }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

