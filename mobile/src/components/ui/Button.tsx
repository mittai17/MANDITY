import { StyleSheet, Pressable, PressableProps, DimensionValue } from 'react-native';
import React from 'react';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: any;
}

export const Button = React.forwardRef<any, ButtonProps>(
  ({ variant = 'primary', disabled, loading, fullWidth, size = 'md', onPress, children, style, ...rest }, ref) => {
    const variants: Record<ButtonVariant, { bg: string; color: string; border?: string }> = {
      primary: { bg: colors.primary, color: colors.white },
      secondary: { bg: colors.primaryLight, color: colors.white },
      outline: { bg: 'transparent', color: colors.primary, border: colors.primary },
      ghost: { bg: 'transparent', color: colors.primaryText },
      danger: { bg: colors.error, color: colors.white },
    };
    const v = variants[variant] || variants.primary;
    const isDisabled = disabled || loading;
    const sizes: Record<string, { px: number; py: number; fontSize: number; minHeight: number }> = {
      sm: { px: 10, py: 6, fontSize: 14, minHeight: 40 },
      md: { px: 16, py: 12, fontSize: 16, minHeight: 52 },
      lg: { px: 20, py: 16, fontSize: 18, minHeight: 60 },
    };
    const s = sizes[size] || sizes.md;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        onPress={onPress}
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          {
            paddingHorizontal: s.px,
            paddingVertical: s.py,
            minHeight: s.minHeight,
            backgroundColor: isDisabled ? colors.muted : v.bg,
            borderColor: v.border || 'transparent',
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
        {...rest}
      >
        {isDisabled && loading ? (
          <Text style={[styles.label, { fontSize: s.fontSize, color: 'rgba(255,255,255,0.7)' }]}>Loading...</Text>
        ) : (
          <Text style={[styles.label, { fontSize: s.fontSize, color: v.color }]}>{children}</Text>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 52,
    ...shadows.sm,
  },
  fullWidth: { width: '100%' },
  label: {
    fontFamily: typography.fontMedium,
    fontSize: typography.fontSize.md,
  },
});
