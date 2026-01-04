import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Sun,
  Moon,
  Smartphone,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, Button } from '../components';
import { OpenAIIcon, GeminiIcon, AnthropicIcon } from '../components/AIProviderIcons';
import { useSettingsStore } from '../store';
import { AIProvider } from '../types';
import { AI_MODELS } from '../constants';
import { spacing, typography, borderRadius, colors } from '../constants/theme';

export function SettingsScreen() {
  const { theme } = useTheme();
  const {
    settings,
    isConfigured,
    setAIProvider,
    setAPIKey,
    setModel,
    setHighSchool,
    setTheme,
    resetSettings,
  } = useSettingsStore();
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.ai.apiKey);

  const providers: { id: AIProvider; name: string; icon: React.FC<{ size?: number; color?: string }> }[] = [
    { id: 'openai', name: 'OpenAI', icon: OpenAIIcon },
    { id: 'gemini', name: 'Gemini', icon: GeminiIcon },
    { id: 'anthropic', name: 'Anthropic', icon: AnthropicIcon },
  ];

  const themeOptions: { id: 'light' | 'dark' | 'system'; name: string; icon: typeof Sun }[] = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Smartphone },
  ];

  const handleSaveApiKey = () => {
    setAPIKey(apiKeyInput.trim());
    Alert.alert('Saved', 'Your API key has been saved.');
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will clear your API key and all preferences. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetSettings();
            setApiKeyInput('');
          },
        },
      ]
    );
  };

  const currentModels = AI_MODELS[settings.ai.provider];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConfigured ? colors.success : colors.warning },
              ]}
            />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              {isConfigured ? 'AI configured' : 'API key required'}
            </Text>
          </View>
        </View>

        {/* AI Provider */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            AI Provider
          </Text>
          <View style={styles.providerGrid}>
            {providers.map((provider) => {
              const ProviderIcon = provider.icon;
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    { backgroundColor: theme.surfaceSecondary },
                    settings.ai.provider === provider.id && {
                      borderColor: theme.primary,
                      borderWidth: 2,
                      backgroundColor: theme.primaryLight,
                    },
                  ]}
                  onPress={() => setAIProvider(provider.id)}
                >
                  <ProviderIcon
                    size={24}
                    color={settings.ai.provider === provider.id ? theme.primary : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.providerName,
                      {
                        color:
                          settings.ai.provider === provider.id
                            ? theme.primary
                            : theme.text,
                      },
                    ]}
                  >
                    {provider.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* API Key */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            API Key
          </Text>
          <View style={styles.apiKeyRow}>
            <TextInput
              style={[
                styles.apiKeyInput,
                {
                  backgroundColor: theme.surfaceSecondary,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder={`Enter your ${settings.ai.provider} API key`}
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showApiKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowApiKey(!showApiKey)}
              style={styles.eyeButton}
            >
              {showApiKey ? (
                <EyeOff size={22} color={theme.textMuted} />
              ) : (
                <Eye size={22} color={theme.textMuted} />
              )}
            </TouchableOpacity>
          </View>
          <Button
            title="Save API Key"
            onPress={handleSaveApiKey}
            disabled={!apiKeyInput.trim()}
            style={styles.saveButton}
          />
        </Card>

        {/* Model Selection */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Model
          </Text>
          <View style={styles.modelList}>
            {currentModels.map((model) => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.modelItem,
                  { borderBottomColor: theme.border },
                ]}
                onPress={() => setModel(model)}
              >
                <Text style={[styles.modelName, { color: theme.text }]}>
                  {model}
                </Text>
                {settings.ai.model === model && (
                  <CheckCircle2 size={22} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* High School */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your High School
          </Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Optional. Used for historical admission data.
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.surfaceSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            value={settings.highSchoolName || ''}
            onChangeText={setHighSchool}
            placeholder="Enter your high school name"
            placeholderTextColor={theme.textMuted}
          />
        </Card>

        {/* Theme */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          <View style={styles.themeGrid}>
            {themeOptions.map((option) => {
              const ThemeIcon = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.themeOption,
                    { backgroundColor: theme.surfaceSecondary },
                    settings.theme === option.id && {
                      borderColor: theme.primary,
                      borderWidth: 2,
                      backgroundColor: theme.primaryLight,
                    },
                  ]}
                  onPress={() => setTheme(option.id)}
                >
                  <ThemeIcon
                    size={24}
                    color={settings.theme === option.id ? theme.primary : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.themeName,
                      {
                        color:
                          settings.theme === option.id ? theme.primary : theme.text,
                      },
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Reset */}
        <Button
          title="Reset All Settings"
          variant="ghost"
          onPress={handleResetSettings}
          style={styles.resetButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.sizes.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
  },
  providerGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  providerCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  providerName: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  apiKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  apiKeyInput: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    fontSize: typography.sizes.md,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xs,
  },
  modelList: {},
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  modelName: {
    fontSize: typography.sizes.md,
  },
  textInput: {
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    fontSize: typography.sizes.md,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  themeName: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: spacing.lg,
  },
});
