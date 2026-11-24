import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  MessageCircle,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { getCropImageSource, getAvatarSource } from '../../constants/images';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../../components/ui';
import { api } from '../../services/api';
import type { InquiryStatus } from '../../types';

const { width } = Dimensions.get('window');

const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending Review', color: colors.warning, bg: '#FFF8E1' },
  accepted: { label: 'Accepted', color: colors.success, bg: '#E8F5E9' },
  rejected: { label: 'Declined', color: colors.error, bg: '#FFEBEE' },
  negotiating: { label: 'In Negotiation', color: colors.primary, bg: '#E0F2F1' },
  completed: { label: 'Completed', color: colors.primaryDark, bg: '#ECEFF1' },
  cancelled: { label: 'Cancelled', color: colors.secondaryText, bg: '#F5F5F5' },
};

export default function InquiryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ inquiryId: string }>();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadInquiry = useCallback(async () => {
    const data = await api.getInquiryById(params.inquiryId || '1');
    if (data) {
      setInquiry(data);
    } else {
      // Fallback
      setInquiry({
        id: params.inquiryId || '1',
        crop_name: 'Tomato',
        seller_name: 'Ravi Kumar',
        buyer_name: 'Suresh Traders',
        requested_quantity: 200,
        offered_price: 22,
        message: 'Can pick up tomorrow morning from your Chengalpattu farm.',
        status: 'pending' as InquiryStatus,
        created_at: new Date().toISOString(),
      });
    }
    setLoading(false);
  }, [params.inquiryId]);

  useEffect(() => {
    loadInquiry();
  }, [loadInquiry]);

  const handleUpdateStatus = async (newStatus: InquiryStatus) => {
    if (!inquiry) return;
    await api.updateInquiryStatus(inquiry.id, newStatus);
    setInquiry((prev: any) => ({ ...prev, status: newStatus }));
  };

  const handleChat = () => {
    router.push('/messages/1');
  };

  if (loading || !inquiry) {
    return (
      <View style={styles.loadingContainer}>
        <Caption>Loading inquiry details...</Caption>
      </View>
    );
  }

  const statusInfo = STATUS_CONFIG[inquiry.status as InquiryStatus] || STATUS_CONFIG.pending;
  const totalValue = (inquiry.requested_quantity || 1) * (inquiry.offered_price || 0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <Heading style={styles.title}>Inquiry #{inquiry.id}</Heading>
        <DemoBadge small />
      </View>

      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusInfo.bg }]}>
        <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
      </View>

      {/* Crop Overview Card */}
      <Card style={styles.cropCard}>
        <Image
          source={getCropImageSource(inquiry.crop_name)}
          style={styles.cropImage}
          resizeMode="cover"
        />
        <View style={styles.cropDetails}>
          <Text style={styles.cropName}>{inquiry.crop_name}</Text>
          <Caption>High Grade • Fresh Harvest</Caption>
          <View style={styles.dealBadge}>
            <Text style={styles.dealText}>
              Total Value: ₹{totalValue.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </Card>

      {/* Offer Summary */}
      <Card style={styles.sectionCard}>
        <Heading style={styles.sectionTitle}>Offer Details</Heading>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Caption>Offered Rate</Caption>
            <Text style={styles.gridValue}>₹{inquiry.offered_price}/kg</Text>
          </View>
          <View style={styles.gridItem}>
            <Caption>Quantity Requested</Caption>
            <Text style={styles.gridValue}>{inquiry.requested_quantity} kg</Text>
          </View>
          <View style={styles.gridItem}>
            <Caption>Estimated Value</Caption>
            <Text style={styles.gridValue}>₹{totalValue.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.gridItem}>
            <Caption>Mandi Benchmark</Caption>
            <Text style={[styles.gridValue, { color: colors.success }]}>₹24/kg</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Caption style={styles.buyerMessageLabel}>Buyer's Message</Caption>
        <Text style={styles.buyerMessageText}>
          "{inquiry.message || 'We would like to inspect and purchase this lot.'}"
        </Text>
      </Card>

      {/* Parties Info */}
      <Card style={styles.sectionCard}>
        <Heading style={styles.sectionTitle}>Parties Involved</Heading>
        <View style={styles.personRow}>
          <Image source={getAvatarSource(inquiry.seller_name)} style={styles.avatarImg} />
          <View style={styles.personInfo}>
            <Text style={styles.personName}>{inquiry.seller_name || 'Ravi Kumar'}</Text>
            <Caption>Seller (Farmer) • Chengalpattu Mandi Area</Caption>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.personRow}>
          <Image source={getAvatarSource(inquiry.buyer_name)} style={styles.avatarImg} />
          <View style={styles.personInfo}>
            <Text style={styles.personName}>{inquiry.buyer_name || 'Suresh Traders'}</Text>
            <Caption>Buyer • Verified Wholesale Trader</Caption>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {inquiry.status === 'pending' ? (
          <>
            <Button
              onPress={() => handleUpdateStatus('accepted')}
              style={{ flex: 1, backgroundColor: colors.success }}
            >
              <CheckCircle size={18} color={colors.white} /> Accept Offer
            </Button>
            <Button
              variant="outline"
              onPress={() => handleUpdateStatus('rejected')}
              style={{ flex: 1, borderColor: colors.error }}
            >
              <XCircle size={18} color={colors.error} /> Decline
            </Button>
          </>
        ) : null}

        <Button variant="outline" onPress={handleChat} fullWidth style={{ marginTop: spacing.xs }}>
          <MessageCircle size={18} color={colors.primary} /> Open Chat & Negotiate
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    backgroundColor: colors.ivory,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
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
  statusBanner: {
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontBold,
  },
  cropCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
  },
  cropImage: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
  },
  cropDetails: {
    flex: 1,
    gap: 4,
  },
  cropName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  dealBadge: {
    backgroundColor: colors.ivory,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  dealText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
  },
  sectionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: (width - 72) / 2,
    gap: 2,
  },
  gridValue: {
    color: colors.primaryText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  buyerMessageLabel: {
    marginBottom: 4,
  },
  buyerMessageText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  personInfo: {
    flex: 1,
    gap: 2,
  },
  personName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
