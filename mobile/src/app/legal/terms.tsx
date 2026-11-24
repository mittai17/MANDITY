import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { Card, Heading, Text, Caption } from '../../components/ui';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <Heading style={styles.title}>Terms of Service</Heading>
        <View style={{ width: 40 }} />
      </View>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <FileText size={24} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Mandity Platform Agreement</Heading>
        </View>
        <Text style={styles.paragraph}>
          Welcome to Mandity. By accessing or using our mobile application, you agree to comply with the terms and conditions outlined below.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <AlertTriangle size={22} color={colors.warning} />
          <Heading style={styles.sectionTitle}>1. Market Price Estimates Disclaimer</Heading>
        </View>
        <Text style={styles.paragraph}>
          Price intelligence, forecasts, and net-proceeds calculations provided in Mandity are indicative estimates generated from AGMARKNET records and statistical forecasting models.
        </Text>
        <Text style={styles.paragraph}>
          Mandity does not guarantee actual transactional closing prices at physical mandis. Farmers and buyers negotiate and finalize rates independently.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <CheckCircle2 size={22} color={colors.success} />
          <Heading style={styles.sectionTitle}>2. Marketplace Code of Conduct</Heading>
        </View>
        <Text style={styles.paragraph}>
          • Accurate Listings: Produce listings must represent actual available crop volume and realistic harvest dates.
        </Text>
        <Text style={styles.paragraph}>
          • Fair Negotiation: Buyers and sellers must maintain professional conduct in 1-to-1 chats and inquiries.
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
