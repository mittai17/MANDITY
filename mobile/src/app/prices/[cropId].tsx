import {StyleSheet, View, ScrollView, Dimensions, TextInput, TouchableOpacity, Image, Modal, Alert} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronRight, Clock, TrendingUp, TrendingDown, Info, Bell, Calculator, X, Check } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, radius, typography, shadows, demoLabel, DEMO_MARKETS } from '../../constants/theme';
import { getCropImageSource } from '../../constants/images';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../../components/ui';
import { api } from '../../services/api';
import type { MarketPrice, Market, PriceForecast } from '../../types';

const { width } = Dimensions.get('window');

export default function PriceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cropId: string }>();
  const { language } = useAuthStoreLocal();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [targetPrice, setTargetPrice] = useState('28');
  const [alertSaved, setAlertSaved] = useState(false);

  const handleSaveAlert = async () => {
    const p = parseFloat(targetPrice);
    if (!p) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }
    await api.createPriceAlert({ crop_id: cropId, target_price: p });
    setAlertSaved(true);
    setAlertModalVisible(false);
    Alert.alert(
      'Price Alert Created!',
      `You will receive an alert when ${cropId} reaches ₹${p}/kg in ${selectedMarket?.name || 'Chengalpattu'}.`,
      [{ text: 'View Notifications', onPress: () => router.push('/notifications') }, { text: 'OK' }]
    );
  };

  const cropId = params.cropId || 'tomato';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, f, m] = await Promise.all([
        api.getMarketPrices(cropId, selectedMarket?.id),
        api.getForecast(cropId, selectedMarket?.id || 'chengalpattu'),
        api.getMarkets(),
      ]);
      setPrices(p);
      setForecast(f);
      setMarkets(m);
    } catch (e) {
      console.error('Failed to load price data', e);
    } finally {
      setLoading(false);
    }
  }, [cropId, selectedMarket]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const current = prices[0];
  const base = current?.modal_price || 0;
  const chartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        data: [base, base * 0.95, base * 1.05, base * 0.98, base * 1.1, base * 1.05, base],
      },
    ],
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ChevronRight size={20} color={colors.primaryText} style={{ transform: [{ rotate: '180deg' }] } as any} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image source={getCropImageSource(cropId)} style={styles.cropTitleThumb} />
          <Heading style={styles.title}>{cropId.charAt(0).toUpperCase() + cropId.slice(1)} Price</Heading>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.skeleton}>
          <View style={styles.skeletonBar} />
          <View style={styles.skeletonBar} />
        </View>
      ) : (
        <>
          <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <View style={styles.marketSelect}>
                <Text style={styles.marketLabel}>Market</Text>
                <TouchableOpacity style={styles.marketBtn} onPress={() => {}}>
                  <Text style={styles.marketValue}>{selectedMarket?.name || 'Chengalpattu'}</Text>
                  <ChevronRight size={16} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.priceCol}>
                <Caption>Modal Price</Caption>
                <Text style={styles.priceValue}>₹{current?.modal_price?.toLocaleString() || '--'}</Text>
              </View>
              <View style={styles.priceCol}>
                <Caption>Min Price</Caption>
                <Text style={styles.priceValue}>₹{current?.min_price?.toLocaleString() || '--'}</Text>
              </View>
              <View style={styles.priceCol}>
                <Caption>Max Price</Caption>
                <Text style={styles.priceValue}>₹{current?.max_price?.toLocaleString() || '--'}</Text>
              </View>
            </View>
            <View style={styles.priceSource}>
              <Info size={14} color={colors.secondaryText} />
              <Caption>Source: {current?.source || 'AGMARKNET'} • {t('last_updated', language)}: {current?.fetched_at ? new Date(current.fetched_at).toLocaleDateString() : 'Just now'}</Caption>
            </View>
          </View>

          {/* Price Quick Actions */}
          <View style={styles.priceActionsRow}>
            <TouchableOpacity
              style={styles.priceActionBtn}
              onPress={() => setAlertModalVisible(true)}
              activeOpacity={0.8}
            >
              <Bell size={18} color={alertSaved ? colors.success : colors.primary} />
              <Text style={styles.priceActionText}>
                {alertSaved ? 'Alert Active' : 'Set Price Alert'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.priceActionBtn}
              onPress={() => router.push('/comparison')}
              activeOpacity={0.8}
            >
              <Calculator size={18} color={colors.primary} />
              <Text style={styles.priceActionText}>Calculate Net Proceeds</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Heading style={styles.sectionTitle}>Historical Trends</Heading>
            <View style={styles.rangeSelector}>
              {['7d', '30d', '90d', '1y'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.rangeChip, timeRange === r && styles.rangeChipActive]}
                  onPress={() => setTimeRange(r as any)}
                >
                  <Text style={[styles.rangeLabel, timeRange === r && styles.rangeLabelActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - 32}
                height={200}
                chartConfig={{
                  backgroundColor: colors.ivory,
                  backgroundGradientFrom: colors.ivory,
                  backgroundGradientTo: colors.ivory,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.primary,
                  labelColor: (opacity = 1) => colors.secondaryText,
                  style: { borderRadius: 16 },
                  propsForDots: { fill: colors.primary, stroke: colors.primary, strokeWidth: 2 },
                }}
                style={styles.chartStyle}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Heading style={styles.sectionTitle}>Forecast</Heading>
            </View>
            <Card style={styles.forecastCard} elevated={false}>
              <View style={styles.forecastRow}>
                <View style={styles.forecastValue}>
                  <Text style={styles.forecastValueText}>₹{forecast?.predicted_price?.toLocaleString() || '--'}</Text>
                  <Caption>Predicted price</Caption>
                </View>
                <View style={styles.forecastValue}>
                  <Text style={styles.forecastValueText}>₹{forecast?.lower_estimate?.toLocaleString() || '--'}</Text>
                  <Caption>Lower estimate</Caption>
                </View>
                <View style={styles.forecastValue}>
                  <Text style={styles.forecastValueText}>₹{forecast?.upper_estimate?.toLocaleString() || '--'}</Text>
                  <Caption>Upper estimate</Caption>
                </View>
              </View>
              <View style={styles.forecastTrend}>
                <TrendingUp size={16} color={colors.success} strokeWidth={3} />
                <Text style={styles.forecastTrendText}>Prices expected to remain stable</Text>
              </View>
              <Caption style={styles.forecastDisclaimer}>
                This is an estimate based on historical data, not a guaranteed selling price. Model: {forecast?.model_version || 'moving-average-v1'}
              </Caption>
            </Card>
          </View>

          <View style={styles.section}>
            <Heading style={styles.sectionTitle}>Compare Markets</Heading>
            <View style={styles.comparisonList}>
              {DEMO_MARKETS.map((market) => {
                const price = prices.find((p) => p.market_id === market.id);
                return (
                  <TouchableOpacity key={market.id} style={styles.marketRow} onPress={() => setSelectedMarket(market)}>
                    <View style={styles.marketRowInfo}>
                      <Text style={styles.marketRowName}>{market.name}</Text>
                      <Caption>{market.district}, {market.state}</Caption>
                    </View>
                    <View style={styles.marketRowPrice}>
                      <Text style={styles.marketRowPriceValue}>₹{price?.modal_price?.toLocaleString() || '--'}</Text>
                      <Caption>Modal</Caption>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}

      {/* Set Price Alert Modal */}
      <Modal
        visible={alertModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Heading style={styles.modalTitle}>Set Price Alert</Heading>
              <TouchableOpacity onPress={() => setAlertModalVisible(false)}>
                <X size={20} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
            <Caption>
              Get notified immediately when {cropId} market price touches or exceeds your target rate.
            </Caption>
            <View style={styles.modalInputGroup}>
              <Caption>Target Price (₹/kg)</Caption>
              <TextInput
                style={styles.modalInput}
                value={targetPrice}
                onChangeText={setTargetPrice}
                keyboardType="numeric"
                placeholder="e.g. 28"
              />
            </View>
            <Button onPress={handleSaveAlert} fullWidth>
              Save Alert
            </Button>
          </View>
        </View>
      </Modal>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cropTitleThumb: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  demoBadge: { alignSelf: 'flex-start' },
  skeleton: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  skeletonBar: {
    height: 100,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  priceCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    ...shadows.md,
  },
  priceActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  priceActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  priceActionText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  modalInputGroup: {
    gap: 4,
  },
  modalInput: {
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.lg,
    color: colors.primaryText,
    fontFamily: typography.fontBold,
  },
  priceHeader: { marginBottom: spacing.lg },
  marketSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '40%',
  },
  marketLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.fontSize.xs,
  },
  marketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  marketValue: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priceCol: { gap: 4 },
  priceValue: {
    color: colors.white,
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontBold,
  },
  priceSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
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
  rangeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  rangeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
  },
  rangeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rangeLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  rangeLabelActive: { color: colors.white },
  chartContainer: { width: '100%', height: 220 },
  chartStyle: { width: width - 32, height: 200 },
  forecastCard: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastValue: { gap: 4 },
  forecastValueText: {
    color: colors.white,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  forecastTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  forecastTrendText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  forecastDisclaimer: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.md,
  },
  comparisonList: { gap: spacing.sm },
  marketRow: {
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
  marketRowInfo: { gap: 2 },
  marketRowName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  marketRowPrice: { gap: 2 },
  marketRowPriceValue: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
});

function useAuthStoreLocal() {
  return { language: 'en' as const };
}
