import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, MessageSquare, Clock } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../constants/theme';
import { getCropImageSource } from '../constants/images';
import { t } from '../localization';
import { Card, Text, Heading, Caption, DemoLabel as DemoBadge } from '../components/ui';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending: { color: colors.warning, bg: '#FFF8E1' },
  accepted: { color: colors.success, bg: '#E8F5E9' },
  rejected: { color: colors.error, bg: '#FFEBEE' },
  negotiating: { color: colors.primary, bg: '#E0F2F1' },
  completed: { color: colors.primaryDark, bg: '#ECEFF1' },
  cancelled: { color: colors.secondaryText, bg: '#F5F5F5' },
};

export default function InquiriesScreen() {
  const router = useRouter();
  const [inquiries, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInquiries = useCallback(async () => {
    try {
      const data = await api.getInquiries();
      setListings(data);
    } catch (e) {
      console.error('Failed to load inquiries', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const onRefresh = () => {
    setRefreshing(true);
    loadInquiries();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <Heading style={styles.title}>{t('my_inquiries', 'en')}</Heading>
        <View style={{ width: 40 }} />
      </View>
      <Caption style={styles.subtitle}>Track your buyer & farmer purchase inquiries</Caption>

      <View style={styles.list}>
        {inquiries.map((inquiry) => {
          const statusStyle = STATUS_COLORS[inquiry.status] || STATUS_COLORS.pending;
          return (
            <TouchableOpacity
              key={inquiry.id}
              style={styles.card}
              onPress={() => router.push(`/inquiries/${inquiry.id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={getCropImageSource(inquiry.crop_name || inquiry.crop)}
                style={styles.cropThumb}
              />
              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={styles.crop}>{inquiry.crop_name || inquiry.crop}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>
                      {inquiry.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.farmer}>
                  {inquiry.seller_name || inquiry.farmer} • {inquiry.buyer_name || 'Buyer'}
                </Text>
                <View style={styles.meta}>
                  <Text style={styles.metaPrice}>₹{inquiry.offered_price || 22}/kg</Text>
                  <Text style={styles.metaQty}>{inquiry.requested_quantity || 200} kg</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
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
  subtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  cropThumb: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
  },
  info: { flex: 1, gap: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crop: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
    textTransform: 'capitalize',
  },
  farmer: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 4,
    alignItems: 'center',
  },
  metaPrice: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontBold,
  },
  metaQty: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
});
