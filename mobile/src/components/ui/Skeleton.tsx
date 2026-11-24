import { ActivityIndicator, StyleSheet, View as RNView, ViewProps, DimensionValue } from 'react-native';
import React from 'react';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Text, Caption } from './Text';

export const Skeleton = (props: ViewProps & { width?: DimensionValue; height?: DimensionValue }) => {
  const { width = 120, height = 120, style, ...rest } = props;
  return (
    <RNView style={[styles.skeleton, { width, height }, style]} {...rest} />
  );
};

export const SkeletonText = (props: ViewProps & { width?: DimensionValue; height?: DimensionValue; count?: number }) => {
  const { width = '100%', height = 16, count = 3, style, ...rest } = props;
  return (
    <RNView style={[styles.skeletonText, style]} {...rest}>
      {Array.from({ length: count }).map((_, i) => (
        <RNView key={i} style={[styles.line, { width: i === count - 1 ? '60%' : width, height }]} />
      ))}
    </RNView>
  );
};

export const LoadingSpinner = (props: { size?: 'small' | 'large' | number; color?: string; style?: any }) => {
  const { size = 'small', color = colors.primary, style } = props;
  return (
    <ActivityIndicator style={[styles.spinner, style]} size={size} color={color} />
  );
};

export const EmptyState = (props: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) => {
  const { title, subtitle, icon, action } = props;
  return (
    <RNView style={styles.emptyContainer}>
      {icon && <RNView style={styles.iconWrapper}>{icon}</RNView>}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Caption style={styles.emptySubtitle}>{subtitle}</Caption>}
      {action && <RNView style={styles.action}>{action}</RNView>}
    </RNView>
  );
};

export const DemoLabel = (props: ViewProps & { small?: boolean }) => {
  const { small, style, ...rest } = props;
  return (
    <RNView style={[styles.demoLabel, small && styles.demoLabelSmall, style]} {...rest}>
      <Text style={[styles.demoText, small && styles.demoTextSmall]}>Demo data</Text>
    </RNView>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.muted,
    borderRadius: 8,
  },
  skeletonText: { gap: spacing.sm },
  line: { backgroundColor: colors.muted, borderRadius: 4 },
  spinner: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconWrapper: { marginBottom: spacing.lg },
  emptyTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontBold,
    fontSize: typography.fontSize.lg,
    textAlign: 'center' as const,
  },
  emptySubtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
    textAlign: 'center' as const,
    marginTop: spacing.xs,
  },
  action: { marginTop: spacing.lg },
  demoLabel: {
    backgroundColor: colors.limeAccent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  demoLabelSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoText: {
    color: colors.primaryDark,
    fontFamily: typography.fontMedium,
    fontSize: typography.fontSize.xs,
  },
  demoTextSmall: {
    fontSize: 10,
    fontWeight: '600',
  },
});
