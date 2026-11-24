import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, Lock, Eye, Database } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { Card, Heading, Text, Caption } from '../../components/ui';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <Heading style={styles.title}>Privacy Policy</Heading>
        <View style={{ width: 40 }} />
      </View>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Shield size={24} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Farmer-First Data Protection</Heading>
        </View>
        <Text style={styles.paragraph}>
          Mandity is designed with a farmer-first philosophy. We only collect the minimal information needed to connect you with agricultural markets and buyers.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Lock size={22} color={colors.primary} />
          <Heading style={styles.sectionTitle}>1. Information We Collect</Heading>
        </View>
        <Text style={styles.paragraph}>
          • Phone Number: Used solely for secure OTP authentication.
        </Text>
        <Text style={styles.paragraph}>
          • District & Mandi Location: Used to display relevant nearby mandi prices and calculate accurate transport estimates.
        </Text>
        <Text style={styles.paragraph}>
          • Produce Listings: Photographs and crop descriptions uploaded to the marketplace.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Eye size={22} color={colors.primary} />
          <Heading style={styles.sectionTitle}>2. Transparency & Control</Heading>
        </View>
        <Text style={styles.paragraph}>
          We never sell your personal data or farm information to third-party advertisers. All market data displayed is sourced from official public data (AGMARKNET) or clearly labelled demo benchmarks.
        </Text>
      </Card>

      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Database size={22} color={colors.primary} />
          <Heading style={styles.sectionTitle}>3. Contact Our Data Officer</Heading>
        </View>
        <Text style={styles.paragraph}>
          For privacy inquiries or data removal requests, contact privacy@mandity.ag or reach out through our Help & Support section.
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
