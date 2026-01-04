// School types
export interface MajorRanking {
  name: string;
  rank?: number;
  source?: string;
}

export interface SchoolRankings {
  overall?: number;
  nationalUniversity?: number;
  liberalArts?: number;
  engineering?: number;
  business?: number;
  source?: string; // e.g., "US News 2024"
}

export interface School {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    setting: 'urban' | 'suburban' | 'rural';
  };
  size: {
    undergraduate: number;
    total?: number;
  };
  rankings?: SchoolRankings;
  admissions: {
    acceptanceRate?: number;
    satRange?: {
      low: number;
      high: number;
    };
    actRange?: {
      low: number;
      high: number;
    };
    testPolicy: 'required' | 'optional' | 'not-considered';
  };
  cost: {
    tuition: number;
    roomAndBoard?: number;
    totalCOA: number;
  };
  academics: {
    topMajors: string[];
    majorRankings?: MajorRanking[];
    studentFacultyRatio?: string;
  };
  website?: string;
  imageUrl?: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  title: string;
  researchAreas?: string[];
  email?: string;
}

// Favorites
export interface FavoriteSchool {
  schoolId: string;
  school: School;
  addedAt: Date;
  notes?: string;
}

// AI Provider types
export type AIProvider = 'openai' | 'gemini' | 'anthropic';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

// App Settings
export interface AppSettings {
  ai: AISettings;
  highSchoolName?: string;
  theme: 'light' | 'dark' | 'system';
}

// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  SchoolDetail: { schoolId: string; school?: School };
};

// AI Research types
export interface ResearchQuery {
  query: string;
  schoolName?: string;
  type: 'general' | 'admissions' | 'academics' | 'faculty' | 'comparison';
}

export interface ResearchResponse {
  content: string;
  schools?: School[];
  timestamp: Date;
}

