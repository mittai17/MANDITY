import { StyleSheet, Text as RNText, View as RNView, TextProps, ViewProps } from 'react-native';
import React from 'react';
import { colors, typography } from '../../constants/theme';

export const Text = (props: TextProps & { className?: string }) => {
  const { style, children, ...rest } = props;
  return (
    <RNText style={[styles.base, style]} {...rest}>
      {children}
    </RNText>
  );
};

export const Heading = (props: TextProps & { level?: 1 | 2 | 3 | 4 }) => {
  const { style, children, level = 2, ...rest } = props;
  const sizeMap: Record<number, number> = {
    1: typography.fontSize.xxl,
    2: typography.fontSize.xl,
    3: typography.fontSize.lg,
    4: typography.fontSize.md,
  };
  return (
    <RNText style={[styles.heading, { fontSize: sizeMap[level] }, style]} {...rest}>
      {children}
    </RNText>
  );
};

export const Caption = (props: TextProps) => {
  const { style, children, ...rest } = props;
  return (
    <RNText style={[styles.caption, style]} {...rest}>
      {children}
    </RNText>
  );
};

export const View = (props: ViewProps & { className?: string }) => {
  const { style, children, ...rest } = props;
  return <RNView style={style} {...rest}>{children}</RNView>;
};

export const Spacer = (props: { height?: number; width?: number }) => {
  const { height, width } = props;
  return <RNView style={{ height, width }} />;
};

const styles = StyleSheet.create({
  base: {
    color: colors.primaryText,
    fontFamily: typography.fontRegular,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  heading: {
    color: colors.primaryDark,
    fontFamily: typography.fontBold,
    lineHeight: typography.lineHeight.lg,
  },
  caption: {
    color: colors.secondaryText,
    fontFamily: typography.fontRegular,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
  },
});
