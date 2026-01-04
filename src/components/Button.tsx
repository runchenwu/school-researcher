import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, spacing, typography, colors } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const { theme } = useTheme();

  const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
      text: { fontSize: typography.sizes.sm },
    },
    md: {
      container: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg },
      text: { fontSize: typography.sizes.md },
    },
    lg: {
      container: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
      text: { fontSize: typography.sizes.lg },
    },
  };

  const variantStyles: Record<
    string,
    { container: ViewStyle; text: TextStyle }
  > = {
    primary: {
      container: { backgroundColor: theme.primary },
      text: { color: '#ffffff' },
    },
    secondary: {
      container: { backgroundColor: theme.primaryLight },
      text: { color: theme.primary },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.primary,
      },
      text: { color: theme.primary },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: theme.primary },
    },
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        sizeStyles[size].container,
        variantStyles[variant].container,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#ffffff' : theme.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              sizeStyles[size].text,
              variantStyles[variant].text,
              icon ? { marginLeft: spacing.xs } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

