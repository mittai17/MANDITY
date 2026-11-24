import {StyleSheet, View, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Search, Filter, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, DEMO_MARKETS, POPULAR_CROPS } from '../../constants/theme';
import { getCropImageSource } from '../../constants/images';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, Skeleton, DemoLabel as DemoBadge } from '../../components/ui';
import { api } from '../../services/api';
import type { Crop, Market, MarketPrice } from '../../types';

const { width } = Dimensions.get('window');

export default function PricesScreen() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, m] = await Promise.all([api.getCrops(), api.getMarkets()]);
      setCrops(c);
      setMarkets(m);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedCrop) {
      api.getMarketPrices(selectedCrop.id, selectedMarket?.id).then(setPrices);
    }
  }, [selectedCrop, selectedMarket]);

  const filteredCrops = crops.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Heading style={styles.title}>{t('prices', 'en')}</Heading>
          <Caption style={styles.subtitle}>{t('search_crops', 'en')}</Caption>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={colors.secondaryText} />
          <TextInput
            style={styles.input}
            placeholder={t('search_crops', 'en')}
            placeholderTextColor={colors.secondaryText}
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.filterBtn}>
            <Filter size={20} color={colors.primary} />
          </View>
        </View>

        {loading ? (
          <View style={styles.skeletonList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} width={200} height={90} />
            ))}
          </View>
        ) : (
          <View style={styles.cropsGrid}>
            {filteredCrops.map((crop) => {
              const price = prices.find((p) => p.crop_id === crop.id);
              const isSelected = selectedCrop?.id === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  onPress={() => {
                    setSelectedCrop(crop);
                    setSelectedMarket(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Card style={[styles.cropCard, isSelected && styles.cropCardActive]} elevated={false}>
                    <DemoBadge small style={styles.demoBadge} />
                    <Image source={getCropImageSource(crop.id)} style={styles.cropThumb} resizeMode="cover" />
                    <Text style={[styles.cropName, isSelected && styles.cropNameActive]}>{crop.name}</Text>
                    <Caption style={[styles.cropCategory, isSelected && styles.cropCategoryActive]}>
                      {crop.category}
                    </Caption>
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceValue, isSelected && styles.priceValueActive]}>
                        ₹{price?.modal_price?.toLocaleString() || '--'}
                      </Text>
                      <Caption>per quintal</Caption>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {selectedCrop && (
          <View style={styles.marketSection}>
            <View style={styles.sectionHeader}>
              <Heading style={styles.sectionTitle}>{selectedCrop.name}</Heading>
              <Button variant="outline" size="sm" onPress={() => router.push(`/prices/${selectedCrop.id}`)}>
                View all markets
                <ChevronRight size={16} />
              </Button>
            </View>
            <View style={styles.marketsList}>
              {markets.map((market) => {
                const price = prices.find((p) => p.crop_id === selectedCrop!.id && p.market_id === market.id);
                const isSel = selectedMarket?.id === market.id;
                return (
                  <TouchableOpacity
                    key={market.id}
                    onPress={() => setSelectedMarket(market)}
                    activeOpacity={0.8}
                  >
                    <Card style={[styles.marketCard, isSel && styles.marketCardActive]} elevated={false}>
                      <View style={styles.marketInfo}>
                        <Text style={[styles.marketName, isSel && styles.marketNameActive]}>{market.name}</Text>
                        <Caption>{market.district}, {market.state}</Caption>
                      </View>
                      <View style={styles.marketPrice}>
                        <Text style={[styles.marketPriceValue, isSel && styles.marketPriceActive]}>
                          ₹{price?.modal_price?.toLocaleString() || '--'}
                        </Text>
                        <Caption>Modal price</Caption>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
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
  skeletonList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cropsGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cropCard: {
    width: (width - 32 - 16) / 2,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cropCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary,
  },
  cropThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  cropIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  cropIconBg: { width: 28, height: 28, borderRadius: radius.sm, backgroundColor: colors.limeAccent },
  cropName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  cropNameActive: { color: colors.white },
  cropCategory: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
  cropCategoryActive: { color: colors.limeAccent },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  priceValue: {
    color: colors.primaryText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  priceValueActive: { color: colors.primary },
  demoBadge: { alignSelf: 'flex-start', marginBottom: spacing.sm },
  marketSection: { paddingHorizontal: spacing.lg },
  sectionHeader: {
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
  marketsList: { gap: spacing.sm },
  marketCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  marketCardActive: { borderColor: colors.primary, borderWidth: 2 },
  marketInfo: { gap: 2 },
  marketName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  marketNameActive: { color: colors.primary },
  marketPrice: { gap: 2 },
  marketPriceValue: {
    color: colors.primaryText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  marketPriceActive: { color: colors.primary },
});
