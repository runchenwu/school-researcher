export * from './theme';

export const AI_MODELS = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'o4-mini', 'o3-mini'],
  gemini: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
  anthropic: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
} as const;

export const DEFAULT_AI_SETTINGS = {
  provider: 'openai' as const,
  apiKey: '',
  model: 'gpt-4o-mini',
};

export const STORAGE_KEYS = {
  SETTINGS: '@school_researcher/settings',
  FAVORITES: '@school_researcher/favorites',
  RECENT_SEARCHES: '@school_researcher/recent_searches',
};

