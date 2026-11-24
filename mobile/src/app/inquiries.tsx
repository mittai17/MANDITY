import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChevronRight, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../constants/theme';
import { t } from '../localization';
import { Card, Button, Text, Caption } from '../components/ui';

const { width } = Dimensions.get('window');

const INQUIRIES = [
  {
    id: '1',
    crop: 'Tomato',
    farmer: 'Ravi Kumar',
    quantity: '200 kg',
    offered: '₹22/kg',
    status: 'pending' as const,
    time: '2 hours ago',
  },
  {
    id: '2',
    crop: 'Onion',
    farmer: 'Lakshmi Devi',
    quantity: '100 kg',
    offered: '₹28/kg',
    status: 'accepted' as const,
    time: '1 day ago',
  },
  {
    id: '3',
    crop: 'Paddy',
    farmer: 'Arun Prakash',
    quantity: '10 quintals',
    offered: '₹2,200/q',
    status: 'rejected' as const,
    time: '3 days ago',
  },
];

const STATUS_COLORS: Record<string, string> = {
  pending: colors.warning,
  accepted: colors.success,
  rejected: colors.error,
  negotiating: colors.primary,
  completed: colors.primary,
  cancelled: colors.secondaryText,
};

export default function InquiriesScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('my_inquiries', 'en')}</Text>
        <Caption style={styles.subtitle}>Track your purchase inquiries</Caption>
      </View>

      <View style={styles.list}>
        {INQUIRIES.map((inquiry) => (
          <TouchableOpacity
            key={inquiry.id}
            style={styles.card}
            onPress={() => router.push(`/inquiries/${inquiry.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.info}>
              <Text style={styles.crop}>{inquiry.crop}</Text>
              <Text style={styles.farmer}>{inquiry.farmer}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>{inquiry.quantity}</Text>
                <Text style={styles.metaText}>{inquiry.offered}</Text>
                <Text style={styles.metaText}>{inquiry.time}</Text>
              </View>
            </View>
            <View style={styles.status}>
              <Text style={[styles.statusText, { color: STATUS_COLORS[inquiry.status] }]}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, marginBottom: spacing.lg },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  info: { gap: 4 },
  crop: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  farmer: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
  status: { alignItems: 'flex-end' },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    textTransform: 'capitalize' as const,
  },
});
