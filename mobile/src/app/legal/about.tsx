import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Info, Sparkles, Sprout, HeartHandshake } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { Card, Heading, Text, Caption } from '../../components/ui';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <Heading style={styles.title}>About Mandity</Heading>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero Badge */}
      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Heading style={styles.appName}>Mandity</Heading>
        <Text style={styles.tagline}>Know the price. Find the buyer. Sell smarter.</Text>
        <Caption style={styles.version}>Version 1.0.0 (Production Release)</Caption>
      </View>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Sprout size={24} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Our Mission</Heading>
        </View>
        <Text style={styles.paragraph}>
          Mandity reduces information gaps between Indian farmers and agricultural produce buyers through transparent market intelligence, multilingual voice technology, and fair buyer connection.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Sparkles size={24} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Key Innovations</Heading>
        </View>
        <Text style={styles.paragraph}>
          • AI Price Forecasting: Moving average and statistical seasonal models predicting 7-day crop price directions.
        </Text>
        <Text style={styles.paragraph}>
          • Net Proceeds Calculator: Calculates real take-home earnings considering transport distance and haulage cost.
        </Text>
        <Text style={styles.paragraph}>
          • Multilingual Voice Assistant: Voice queries in Tamil, Hindi, Telugu, and English with audio speech playback.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <HeartHandshake size={24} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Data Attribution</Heading>
        </View>
        <Text style={styles.paragraph}>
          Market price records are powered by AGMARKNET (Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, Government of India) and open data sets from data.gov.in.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 100, backgroundColor: colors.ivory },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontBold,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: 4,
  },
  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  logoText: {
    color: colors.white,
    fontSize: 36,
    fontFamily: typography.fontBold,
  },
  appName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  tagline: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  version: {
    marginTop: 4,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  paragraph: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
  },
});
