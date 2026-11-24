import { StyleSheet, View, ScrollView, Dimensions, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChevronRight, MapPin, Phone, MessageCircle, Share2, MoreVertical } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../../components/ui';
import { useAuthStore } from '../../store';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ listingId: string }>();
  const { user } = useAuthStore();
  const [listing] = useState({
    id: params.listingId || '1',
    crop: 'Tomato',
    quantity: '500 kg',
    price: '₹24/kg',
    location: 'Chengalpattu, Tamil Nadu',
    farmer: 'Ravi Kumar',
    posted: '2 hours ago',
    verified: true,
    description: 'Fresh tomatoes harvested today. Premium quality, organically grown. Available for immediate pickup or delivery.',
    images: ['', '', ''],
  });

  const handleContact = () => {
    router.push('/messages/new');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ChevronRight size={20} color={colors.primaryText} style={{ transform: [{ rotate: '180deg' }] } as any} />
        </TouchableOpacity>
        <MoreVertical size={20} color={colors.primaryText} />
      </View>

      <View style={styles.images}>
        {listing.images.map((uri, i) => (
          <View key={i} style={styles.imageItem}>
            <View style={styles.imagePlaceholder} />
          </View>
        ))}
      </View>

      <DemoBadge small style={styles.demoBadge} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.listingTitle}>{listing.crop}</Text>
          {listing.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.listingPrice}>{listing.price}</Text>
          <Text style={styles.listingQty}>{listing.quantity}</Text>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.locationText}>{listing.location}</Text>
        </View>
        <Caption style={styles.postedText}>Posted {listing.posted}</Caption>

        <View style={styles.divider} />

        <View style={styles.farmerSection}>
          <View style={styles.farmerHeader}>
            <View style={styles.farmerAvatar} />
            <View style={styles.farmerInfo}>
              <Text style={styles.farmerName}>{listing.farmer}</Text>
              <Caption style={styles.farmerLocation}>{listing.location}</Caption>
            </View>
          </View>
          <Caption style={styles.descriptionLabel}>Description</Caption>
          <Text style={styles.descriptionText}>{listing.description}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionSection}>
          <Button onPress={handleContact} style={{ flex: 1 }}>
            <MessageCircle size={18} color={colors.white} /> {t('contact_farmer', 'en')}
          </Button>
          <Button variant="outline" onPress={() => {}} style={{ flex: 1 }}>
            <Share2 size={18} color={colors.primary} /> Share
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  back: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center' },
  images: {
    width: '100%',
    height: 220,
    backgroundColor: colors.ivory,
    flexDirection: 'row',
  },
  imageItem: {
    flex: 1,
    backgroundColor: colors.muted,
  },
  imagePlaceholder: { flex: 1 },
  demoBadge: { alignSelf: 'center', marginBottom: spacing.lg },
  content: { paddingHorizontal: spacing.lg },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  listingTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
  },
  verifiedText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  listingPrice: {
    color: colors.primaryText,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  listingQty: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  postedText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  farmerSection: { gap: spacing.md },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  farmerAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  farmerInfo: { gap: 2 },
  farmerName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  farmerLocation: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  descriptionLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.lg,
  },
  actionSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
