# 🎓 School Researcher

An AI-powered mobile app that helps high school students research colleges and universities. Built with React Native and Expo.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-50+-black)

## ✨ Features

- **🔍 AI-Powered Research** - Ask natural language questions about any college or university
- **📊 School Rankings** - View national and program-specific rankings
- **❤️ Favorites** - Save schools to your favorites list for easy comparison
- **🎯 Detailed Profiles** - Overview, admissions stats, academics, and faculty information
- **👨‍🏫 Faculty Research** - Explore faculty and research by major/department
- **📤 Export Data** - Export favorites to CSV or JSON
- **🌙 Dark Mode** - Full support for light and dark themes
- **🔐 Privacy-First** - All data stored locally, you bring your own API key

## 📱 Screenshots

| Home | School Detail | Favorites | Settings |
|------|---------------|-----------|----------|
| Search & discover | Detailed info | Your saved schools | Configure AI |

## 🛠 Tech Stack

- **Framework**: React Native + Expo (SDK 50+)
- **Language**: TypeScript
- **State Management**: Zustand with persist middleware
- **Storage**: AsyncStorage
- **Navigation**: React Navigation
- **Icons**: Lucide React Native
- **AI Providers**: OpenAI, Google Gemini, Anthropic Claude

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for testing) or Xcode/Android Studio (for builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/school-researcher.git
cd school-researcher

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Install **Expo Go** on your iOS or Android device
2. Scan the QR code from the terminal
3. The app will load on your device

### Running on Simulator

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android
```

## ⚙️ Configuration

### AI Provider Setup

The app requires an API key from one of the supported AI providers:

| Provider | Get API Key | Models |
|----------|-------------|--------|
| OpenAI | [platform.openai.com](https://platform.openai.com) | GPT-4o, GPT-4o-mini |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | Gemini 2.5 Pro/Flash |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | Claude Sonnet 4, Claude 3.5 |

1. Open the app
2. Go to **Settings** tab
3. Select your AI provider
4. Enter your API key
5. Choose a model

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── SchoolCard.tsx
│   └── ...
├── screens/        # Screen components
│   ├── HomeScreen.tsx
│   ├── SchoolDetailScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── SettingsScreen.tsx
├── hooks/          # Custom React hooks
│   └── useTheme.ts
├── store/          # Zustand stores
│   ├── settingsStore.ts
│   ├── favoritesStore.ts
│   └── searchStore.ts
├── services/       # API services
│   ├── aiService.ts
│   └── exportService.ts
├── constants/      # Theme, config
│   ├── theme.ts
│   └── index.ts
├── types/          # TypeScript interfaces
│   └── index.ts
└── navigation/     # Navigation config
    └── index.tsx
```

## 🏗 Building for Production

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### Submit to App Store

```bash
eas submit --platform ios
```

## 📄 Privacy Policy

See [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

**Key Points:**
- All data is stored locally on your device
- API keys are encrypted and never leave your device
- No analytics or tracking
- No user accounts required

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- School data powered by AI (OpenAI, Google Gemini, Anthropic)
- Icons by [Lucide](https://lucide.dev)
- Built with [Expo](https://expo.dev)

---

**Made with ❤️ for students exploring their college journey**

