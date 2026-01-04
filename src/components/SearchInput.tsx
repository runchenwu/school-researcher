import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Search, XCircle } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, spacing, typography } from '../constants/theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search for colleges...',
  autoFocus = false,
}: SearchInputProps) {
  const { theme } = useTheme();

  const handleSubmit = () => {
    Keyboard.dismiss();
    onSubmit?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surfaceSecondary,
          borderColor: theme.border,
        },
      ]}
    >
      <Search
        size={20}
        color={theme.textMuted}
        style={styles.icon}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <XCircle size={20} color={theme.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    paddingVertical: 0,
  },
});
