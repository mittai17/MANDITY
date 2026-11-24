import { StyleSheet, View as RNView, Text as RNText, ViewProps, TextProps } from 'react-native';
import React from 'react';
import { colors, spacing, radius, shadows, typography } from '../../constants/theme';

export const Card = React.forwardRef<any, ViewProps & { padding?: number; elevated?: boolean }>(
  ({ children, style, padding = spacing.lg, elevated = true, ...rest }, ref) => {
    return (
      <RNView
        ref={ref}
        style={[
          styles.container,
          padding !== undefined && { padding },
          elevated && shadows.md,
          style,
        ]}
        {...rest}
      >
        {children}
      </RNView>
    );
  }
);

Card.displayName = 'Card';

export const Badge = React.forwardRef<any, TextProps & { variant?: 'success' | 'warning' | 'info' | 'demo' | 'neutral' }>(
  ({ children, style, variant = 'neutral', ...rest }, ref) => {
    const variantStyles: Record<string, { bg: string; color: string }> = {
      success: { bg: colors.success, color: colors.white },
      warning: { bg: colors.warning, color: colors.white },
      info: { bg: colors.primary, color: colors.white },
      demo: { bg: colors.limeAccent, color: colors.primaryDark },
      neutral: { bg: colors.muted, color: colors.primaryText },
    };
    const v = variantStyles[variant] || variantStyles.neutral;
    return (
      <RNText
        ref={ref}
        style={[
          badgeStyles.container,
          { backgroundColor: v.bg, color: v.color },
          style,
        ]}
        {...rest}
      >
        {children}
      </RNText>
    );
  }
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

const badgeStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
    textAlign: 'center' as const,
    overflow: 'hidden',
  },
});
