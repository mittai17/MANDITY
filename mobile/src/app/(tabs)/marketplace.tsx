import {StyleSheet, View, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Search, Filter, Plus, MapPin, SlidersHorizontal, Heart, Bookmark } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, CROP_CATEGORIES, DEMO_MARKETS } from '../../constants/theme';
import { getCropImageSource, getAvatarSource } from '../../constants/images';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(api.getSavedListingIds());
  }, []);

  const handleToggleSave = (id: string, e: any) => {
    e.stopPropagation?.();
    api.toggleSavedListing(id);
    setSavedIds(api.getSavedListingIds());
  };

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getListings();
      setListings(data);
    } catch (e) {
      console.error('Failed to load listings', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const filtered = listings.filter((l) => {
    const matchesSearch = l.crop.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === 'Saved') {
      return matchesSearch && savedIds.includes(l.id);
    }
    if (selectedCategory === 'All') {
      return matchesSearch;
    }
    return matchesSearch;
  });

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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {['All', 'Saved', ...CROP_CATEGORIES].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                  {cat === 'Saved' ? '♥ Saved' : cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
                    <View style={styles.listingImage}>
                      <Image
                        source={getCropImageSource(listing.crop)}
                        style={styles.listingImageCover}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.heartBtn}
                        onPress={(e) => handleToggleSave(listing.id, e)}
                        activeOpacity={0.8}
                      >
                        <Heart
                          size={16}
                          color={savedIds.includes(listing.id) ? colors.error : colors.white}
                          fill={savedIds.includes(listing.id) ? colors.error : 'transparent'}
                        />
                      </TouchableOpacity>
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
                          <Image source={getAvatarSource(listing.farmer)} style={styles.farmerAvatarSmall} />
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
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryLabelActive: {
    color: colors.white,
    fontFamily: typography.fontBold,
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.round,
    padding: 4,
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
    overflow: 'hidden',
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listingImageCover: { width: '100%', height: '100%' },
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
    gap: spacing.xs,
  },
  farmerAvatarSmall: {
    width: 20,
    height: 20,
    borderRadius: radius.round,
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
