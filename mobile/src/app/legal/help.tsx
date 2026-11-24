import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Phone, HelpCircle, Mail, MessageSquare, ExternalLink } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { Card, Heading, Text, Caption, Button } from '../../components/ui';

export default function HelpScreen() {
  const router = useRouter();

  const handleCallKisan = () => {
    Linking.openURL('tel:18001801551');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <Heading style={styles.title}>Help & Support</Heading>
        <View style={{ width: 40 }} />
      </View>

      {/* Kisan Helpline Banner */}
      <Card style={styles.helplineCard}>
        <Phone size={28} color={colors.white} />
        <View style={{ flex: 1 }}>
          <Heading style={styles.helplineTitle}>Kisan Call Centre (Toll-Free)</Heading>
          <Text style={styles.helplineNumber}>1800-180-1551</Text>
          <Caption style={styles.helplineDesc}>
            Govt. of India 24x7 Agricultural Helpline in 22 regional languages.
          </Caption>
        </View>
        <Button size="sm" variant="outline" onPress={handleCallKisan} style={styles.callBtn}>
          Call
        </Button>
      </Card>

      {/* Frequently Asked Questions */}
      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <HelpCircle size={22} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Frequently Asked Questions</Heading>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQ}>How are market prices updated?</Text>
          <Text style={styles.faqA}>
            Prices are updated daily from AGMARKNET mandi feeds and historical commodity observation data across major regulated APMC markets.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.faqItem}>
          <Text style={styles.faqQ}>How does Net Proceeds calculation work?</Text>
          <Text style={styles.faqA}>
            Formula: Net Proceeds = (Modal Price × Quantity) - Estimated Transport Cost. Mandity highlights the mandi giving you the highest net money in hand.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.faqItem}>
          <Text style={styles.faqQ}>How do I list my produce?</Text>
          <Text style={styles.faqA}>
            Tap "Sell Produce" on the Home or Marketplace screen, select your crop, enter quantity, rate, and upload photos. Nearby buyers will discover your listing immediately.
          </Text>
        </View>
      </Card>

      {/* Mandity Support */}
      <Card style={styles.card}>
        <View style={styles.iconRow}>
          <Mail size={22} color={colors.primary} />
          <Heading style={styles.sectionTitle}>Contact Mandity Support</Heading>
        </View>
        <Text style={styles.faqA}>
          Email: support@mandity.ag
        </Text>
        <Text style={styles.faqA}>
          Helpline: +91 44 2855 0000 (Mon–Sat, 8 AM – 8 PM)
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
  helplineCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  helplineTitle: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  helplineNumber: {
    color: colors.limeAccent,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
    marginTop: 2,
  },
  helplineDesc: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  callBtn: {
    borderColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  faqItem: {
    gap: 4,
  },
  faqQ: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontBold,
  },
  faqA: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
