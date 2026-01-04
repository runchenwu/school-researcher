# School Researcher

## Overview
School Researcher is a mobile app that helps high school students research colleges using AI-powered insights.

## Core Features

### 🔍 School Research
- **Basic Info**: Location, undergraduate size, cost of attendance, campus setting (urban/suburban/rural)
- **Admissions**: SAT/ACT score ranges, standardized test requirements, admission rates
- **Academics**: Top majors, faculty information, professors by major
- **History**: Past admissions from your high school (if available)

### ⭐ Favorites System
- Favorite/unfavorite schools for quick access
- View all favorited schools in a dedicated list
- Export favorites (CSV/PDF) for sharing with parents/counselors

### 🤖 AI-Powered Research
- All research queries powered by LLM
- Configurable AI provider: OpenAI, Gemini, or Anthropic
- Natural language questions about schools

### ⚙️ Settings
- Configure LLM API provider and API key
- Set your high school (for historical admission data)
- Theme preferences

## Tech Stack
- **Framework**: Expo + React Native (TypeScript)
- **State Management**: Zustand
- **Storage**: AsyncStorage for favorites & settings
- **AI Integration**: OpenAI, Google Gemini, Anthropic APIs

## Screens
1. **Home** - Search bar + recent searches + quick actions
2. **School Detail** - Full school info with tabs (Overview, Admissions, Academics, Faculty)
3. **Favorites** - List of saved schools with export option
4. **Settings** - API configuration + preferences

## UI Design
- Clean, minimal, and student-friendly
- Card-based layouts for school info
- Smooth animations and transitions
- Dark/Light mode support
- Accessible design with good contrast

## Data Sources
- AI-generated research (primary)
- Consider integrating College Scorecard API for verified stats (future enhancement)
