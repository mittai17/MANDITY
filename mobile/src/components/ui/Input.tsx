import { StyleSheet, TextInput as RNTextInput, TextInputProps, View as RNView } from 'react-native';
import React from 'react';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Text, Caption } from './Text';

export const Input = React.forwardRef<
  any,
  TextInputProps & { label?: string; error?: string; containerStyle?: any }
>(({ label, error, containerStyle, style, ...rest }, ref) => {
  return (
    <RNView style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor={colors.secondaryText}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </RNView>
  );
});

Input.displayName = 'Input';

export const SectionHeader = (props: { title: string; subtitle?: string; style?: any }) => {
  const { title, subtitle, style } = props;
  return (
    <RNView style={[sectionStyles.section, style]}>
      <Text style={sectionStyles.sectionTitle}>{title}</Text>
      {subtitle && <Caption style={sectionStyles.sectionSubtitle}>{subtitle}</Caption>}
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    color: colors.primaryText,
    fontFamily: typography.fontMedium,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    minHeight: 52,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    fontFamily: typography.fontRegular,
  },
});

const sectionStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontBold,
    fontSize: typography.fontSize.lg,
  },
  sectionSubtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
});
