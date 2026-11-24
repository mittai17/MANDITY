import { StyleSheet, View, Dimensions, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight, Bell, Calendar, TrendingUp, TrendingDown, MapPin, BarChart2, Mic } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, demoLabel, POPULAR_CROPS } from '../../constants/theme';
import { getCropImageSource, getAvatarSource } from '../../constants/images';
import { t } from '../../localization';
import { useAuthStore } from '../../store';
import { Card, Button, Text, Heading, Caption, Skeleton, SkeletonText, DemoLabel as DemoBadge } from '../../components/ui';
import { api } from '../../services/api';
import type { MarketPrice } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function HomeScreen() {
  const router = useRouter();
  const { language, user } = useAuthStore();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');

  const loadPrices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMarketPrices(selectedCrop);
      setPrices(data);
    } catch (e) {
      console.error('Failed to load prices', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCrop]);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPrices();
  }, [loadPrices]);

  const currentPrice = prices.find((p) => p.crop_id === selectedCrop);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('good_morning', language) || 'Good morning';
    if (h < 17) return t('good_afternoon', language) || 'Good afternoon';
    return t('good_evening', language) || 'Good evening';
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <View style={styles.logoBg}>
              <Text style={styles.logoText}>M</Text>
            </View>
          </View>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>{greeting()},</Text>
            <Heading style={styles.greetingName}>{user?.full_name || 'Farmer'}</Heading>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/notifications')}>
            <Bell size={20} color={colors.primaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/profile')}>
            <Image source={getAvatarSource(user?.full_name)} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <MapPin size={16} color={colors.primary} />
        <Text style={styles.locationText}>{user?.district || 'Tamil Nadu, India'}</Text>
      </View>

      {/* Today's Market Insight */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heading style={styles.sectionTitle}>{t('today_market_insight', language)}</Heading>
          <DemoBadge small />
        </View>
        <View style={styles.insightCard}>
          <View style={styles.insightTopRow}>
            <Image source={getCropImageSource(selectedCrop)} style={styles.insightThumb} resizeMode="cover" />
            <View style={styles.insightLeft}>
              <Text style={styles.insightCrop}>{selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}</Text>
              <Text style={styles.insightSub}>Current modal mandi price</Text>
            </View>
          </View>
          <View style={styles.insightBottomRow}>
            <Text style={styles.insightPrice}>
              ₹{currentPrice?.modal_price?.toLocaleString() || '--'}
            </Text>
            <View style={styles.insightRanges}>
              <View style={styles.insightRange}>
                <Text style={styles.rangeLabel}>{t('min_price', language)}</Text>
                <Text style={styles.rangeValue}>₹{currentPrice?.min_price?.toLocaleString() || '--'}</Text>
              </View>
              <View style={styles.insightRange}>
                <Text style={styles.rangeLabel}>{t('max_price', language)}</Text>
                <Text style={styles.rangeValue}>₹{currentPrice?.max_price?.toLocaleString() || '--'}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.priceMovement}>
          <View style={styles.trendRow}>
            <TrendingUp size={14} color={colors.success} strokeWidth={3} />
            <Text style={styles.trendText}>+5.2% vs yesterday</Text>
          </View>
          <View style={styles.updatedRow}>
            <Calendar size={14} color={colors.secondaryText} />
            <Text style={styles.updatedText}>{t('last_updated', language)}: Just now</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Heading style={styles.sectionTitle}>{t('quick_actions', language)}</Heading>
        <View style={styles.actionsGrid}>
          {[
            { label: t('check_prices', language), icon: 'BarChart2', onPress: () => router.push('/prices') },
            { label: t('compare_markets', language), icon: 'Compare', onPress: () => router.push('/comparison') },
            { label: t('sell_produce', language), icon: 'Plus', onPress: () => router.push('/sell') },
            { label: t('ask_ai', language), icon: 'Mic', onPress: () => router.push('/ai') },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.actionCard} onPress={item.onPress}>
              <View style={styles.actionIcon}>
                {item.icon === 'BarChart2' && <BarChart2 size={22} color={colors.primary} />}
                {item.icon === 'Compare' && <Calendar size={22} color={colors.primary} />}
                {item.icon === 'Plus' && (
                  <View style={styles.plusIcon}>
                    <View style={styles.plusLine} />
                    <View style={styles.plusLine} />
                  </View>
                )}
                {item.icon === 'Mic' && <Mic size={22} color={colors.primary} />}
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Crop Prices */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Heading style={styles.sectionTitle}>{t('crop_prices', language)}</Heading>
        </View>
        <View style={styles.cropsList}>
          {POPULAR_CROPS.map((crop) => {
            const price = prices.find((p) => p.crop_id === crop.id);
            const isSelected = selectedCrop === crop.id;
            return (
              <TouchableOpacity
                key={crop.id}
                style={[styles.cropCard, isSelected && styles.cropCardActive]}
                onPress={() => setSelectedCrop(crop.id)}
              >
                <Image source={getCropImageSource(crop.id)} style={styles.cropThumb} resizeMode="cover" />
                <Text style={[styles.cropName, isSelected && styles.cropNameActive]}>
                  {crop.name}
                </Text>
                <Text style={[styles.cropPrice, isSelected && styles.cropPriceActive]}>
                  ₹{price?.modal_price?.toLocaleString() || '--'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Market Updates */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Heading style={styles.sectionTitle}>{t('market_updates', language)}</Heading>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.updatesList}>
          {[
            { market: 'Chengalpattu', crop: 'Tomato', price: '₹24/kg', change: '+2%', trend: 'up' },
            { market: 'Koyambedu', crop: 'Onion', price: '₹30/kg', change: '-1%', trend: 'down' },
            { market: 'Tiruvallur', crop: 'Paddy', price: '₹2,300/q', change: '+0%', trend: 'stable' },
          ].map((item, i) => (
            <View key={i} style={styles.updateCard}>
              <View style={styles.updateInfo}>
                <Text style={styles.updateMarket}>{item.market}</Text>
                <Text style={styles.updateCrop}>{item.crop}</Text>
              </View>
              <View style={styles.updatePrice}>
                <Text style={styles.updatePriceValue}>{item.price}</Text>
                <Text style={[styles.updateChange, item.trend === 'up' && styles.changeUp]}>
                  {item.change}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* AI Recommendation */}
      <View style={styles.section}>
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Mic size={20} color={colors.white} />
          </View>
          <View style={styles.aiContent}>
            <Heading style={styles.aiTitle}>{t('ai_recommendation', language)}</Heading>
            <Text style={styles.aiBody}>
              Tomato prices have increased in your selected market compared with the previous observation. Compare nearby markets before deciding where to sell.
            </Text>
          </View>
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
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  logo: { width: 40, height: 40 },
  logoBg: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontFamily: typography.fontBold,
    fontSize: typography.fontSize.xl,
  },
  greeting: { gap: 2 },
  greetingText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  greetingName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.round,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  locationText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  viewAll: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  insightCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  insightTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  insightThumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.limeAccent,
  },
  insightLeft: { flex: 1, gap: 2 },
  insightCrop: {
    color: colors.limeAccent,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
    textTransform: 'uppercase' as const,
  },
  insightSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSize.sm,
  },
  insightBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  insightPrice: {
    color: colors.white,
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontBold,
  },
  insightRanges: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  insightRange: { gap: 2, alignItems: 'flex-end' },
  rangeLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.fontSize.xs,
  },
  rangeValue: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  priceMovement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
  },
  trendText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
  },
  updatedText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSize.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: (CARD_WIDTH - 16) / 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  plusIcon: {
    width: 22,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusLine: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  actionLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    textAlign: 'center' as const,
    marginTop: 2,
  },
  cropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cropCard: {
    width: (CARD_WIDTH - 16) / 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.sm,
  },
  cropCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cropThumb: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  cropName: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  cropNameActive: { color: colors.white },
  cropPrice: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  cropPriceActive: { color: colors.limeAccent },
  updatesList: { gap: spacing.sm },
  updateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  updateInfo: { gap: 2 },
  updateMarket: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  updateCrop: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  updatePrice: { gap: 4 },
  updatePriceValue: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  changeUp: { color: colors.success },
  changeDown: { color: colors.error },
  updateChange: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiContent: { flex: 1, gap: 4 },
  aiTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  aiBody: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.md,
  },
});
