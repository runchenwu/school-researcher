import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Search, Brain, Database, FileText, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { spacing, typography, borderRadius } from '../constants/theme';

interface ResearchStep {
  id: string;
  label: string;
  icon: typeof Search;
  status: 'pending' | 'active' | 'completed';
}

interface ResearchProgressProps {
  query: string;
  currentStep: number;
}

const RESEARCH_STEPS: Omit<ResearchStep, 'status'>[] = [
  { id: 'analyze', label: 'Analyzing your question', icon: Search },
  { id: 'thinking', label: 'AI is thinking', icon: Brain },
  { id: 'gathering', label: 'Gathering school data', icon: Database },
  { id: 'formatting', label: 'Formatting response', icon: FileText },
];

export function ResearchProgress({ query, currentStep }: ResearchProgressProps) {
  const { theme } = useTheme();
  const [pulseAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Pulse animation for active step
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  useEffect(() => {
    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / RESEARCH_STEPS.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const getStepStatus = (index: number): ResearchStep['status'] => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <Card variant="elevated" style={styles.container}>
      {/* Query display */}
      <View style={styles.queryContainer}>
        <Text style={[styles.queryLabel, { color: theme.textMuted }]}>
          Researching
        </Text>
        <Text style={[styles.queryText, { color: theme.text }]} numberOfLines={2}>
          "{query}"
        </Text>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: theme.surfaceSecondary }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.primary,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {RESEARCH_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const StepIcon = status === 'completed' ? CheckCircle2 : step.icon;
          const isActive = status === 'active';

          return (
            <Animated.View
              key={step.id}
              style={[
                styles.step,
                isActive && {
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            >
              <View
                style={[
                  styles.stepIconContainer,
                  {
                    backgroundColor:
                      status === 'completed'
                        ? theme.primary
                        : status === 'active'
                        ? theme.primaryLight
                        : theme.surfaceSecondary,
                  },
                ]}
              >
                <StepIcon
                  size={18}
                  color={
                    status === 'completed'
                      ? '#ffffff'
                      : status === 'active'
                      ? theme.primary
                      : theme.textMuted
                  }
                />
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color:
                      status === 'completed'
                        ? theme.primary
                        : status === 'active'
                        ? theme.text
                        : theme.textMuted,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {step.label}
                {isActive && '...'}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      {/* Tip */}
      <View style={[styles.tipContainer, { backgroundColor: theme.surfaceSecondary }]}>
        <Text style={[styles.tipText, { color: theme.textSecondary }]}>
          This may take a few seconds depending on the complexity of your question.
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  queryContainer: {
    marginBottom: spacing.md,
  },
  queryLabel: {
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  queryText: {
    fontSize: typography.sizes.md,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  steps: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: typography.sizes.sm,
    flex: 1,
  },
  tipContainer: {
    marginTop: spacing.lg,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  tipText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
});

