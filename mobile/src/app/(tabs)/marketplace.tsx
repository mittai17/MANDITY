import { StyleSheet, View, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Search, Filter, Plus, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, CROP_CATEGORIES, DEMO_MARKETS } from '../../constants/theme';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, Skeleton, DemoLabel as DemoBadge } from '../../components/ui';
import { api } from '../../services/api';
import type { Crop } from '../../types';

const { width } = Dimensions.get('window');

export default function MarketplaceScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setListings([
        {
          id: '1',
          crop: 'Tomato',
          quantity: '500 kg',
          price: '₹24/kg',
          location: 'Chengalpattu, Tamil Nadu',
          farmer: 'Ravi Kumar',
          posted: '2 hours ago',
          image_url: '',
          verified: true,
        },
        {
          id: '2',
          crop: 'Onion',
          quantity: '300 kg',
          price: '₹30/kg',
          location: 'Koyambedu, Chennai',
          farmer: 'Lakshmi Devi',
          posted: '5 hours ago',
          image_url: '',
          verified: false,
        },
        {
          id: '3',
          crop: 'Paddy',
          quantity: '20 quintals',
          price: '₹2,300/quintal',
          location: 'Tiruvallur, Tamil Nadu',
          farmer: 'Arun Prakash',
          posted: '1 day ago',
          image_url: '',
          verified: true,
        },
        {
          id: '4',
          crop: 'Banana',
          quantity: '200 kg',
          price: '₹35/kg',
          location: 'Chengalpattu, Tamil Nadu',
          farmer: 'Sita Ramesh',
          posted: '2 days ago',
          image_url: '',
          verified: false,
        },
      ]);
    } catch (e) {
      console.error('Failed to load listings', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const filtered = listings.filter((l) =>
    l.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Heading style={styles.title}>{t('marketplace_home', 'en')}</Heading>
          <Caption style={styles.subtitle}>Fresh produce from farmers near you</Caption>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={colors.secondaryText} />
          <TextInput
            style={styles.input}
            placeholder={t('search_bar', 'en')}
            placeholderTextColor={colors.secondaryText}
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={colors.primary} />
          </View>
        </View>

        <View style={styles.categories}>
          {CROP_CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryChip} onPress={() => setSearch(cat)}>
              <Text style={styles.categoryLabel}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Button variant="outline" fullWidth onPress={() => router.push('/sell')}>
            <Plus size={18} color={colors.primary} /> {t('sell_produce', 'en')}
          </Button>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Heading style={styles.sectionTitle}>{t('recently_added', 'en')}</Heading>
          </View>
          {loading ? (
            <View style={styles.skeletonList}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width='100%' height={130} />
              ))}
            </View>
          ) : (
            <View style={styles.listingsList}>
              {filtered.map((listing) => (
                <TouchableOpacity
                  key={listing.id}
                  onPress={() => router.push(`/marketplace/${listing.id}`)}
                  activeOpacity={0.8}
                >
                  <Card style={styles.listingCard} elevated={false}>
                    <DemoBadge small style={styles.demoBadge} />
                    <View style={styles.listingImage}>
                      <View style={styles.imagePlaceholder} />
                    </View>
                    <View style={styles.listingInfo}>
                      <Text style={styles.listingCrop}>{listing.crop}</Text>
                      <View style={styles.listingMeta}>
                        <MapPin size={14} color={colors.secondaryText} />
                        <Text style={styles.listingLocation}>{listing.location}</Text>
                      </View>
                      <View style={styles.listingBottom}>
                        <View style={styles.listingQtyPrice}>
                          <Text style={styles.listingQty}>{listing.quantity}</Text>
                          <Text style={styles.listingPrice}>{listing.price}</Text>
                        </View>
                        <View style={styles.listingFarmer}>
                          <Text style={styles.listingFarmerName}>{listing.farmer}</Text>
                          {listing.verified && (
                            <Text style={styles.verifiedBadge}>Verified</Text>
                          )}
                        </View>
                        <Caption style={styles.listingPosted}>{listing.posted}</Caption>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  input: { flex: 1, color: colors.primaryText, fontSize: typography.fontSize.md },
  filterBtn: { padding: spacing.sm },
  categories: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
    ...shadows.sm,
  },
  categoryLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  actionsRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  skeletonList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  listingsList: { gap: spacing.md },
  listingCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  listingImage: {
    width: 90,
    height: 90,
    borderRadius: radius.lg,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePlaceholder: { flex: 1, backgroundColor: colors.muted, borderRadius: radius.lg },
  listingInfo: { flex: 1, gap: spacing.xs },
  listingCrop: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  listingLocation: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  listingBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  listingQtyPrice: { gap: 4 },
  listingQty: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  listingPrice: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  listingFarmer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listingFarmerName: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  verifiedBadge: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
  },
  listingPosted: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
  demoBadge: { alignSelf: 'flex-start', marginBottom: spacing.sm },
});
