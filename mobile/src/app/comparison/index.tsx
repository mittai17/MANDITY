import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, shadows, typography } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { t } from '../../localization';
import { Card, DemoLabel } from '../../components/ui';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MarketData {
  market: string;
  modal: number;
  estDistKm: number;
  estTransportRs: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CROPS = ['Tomato', 'Onion', 'Paddy', 'Groundnut', 'Coconut', 'Banana', 'Potato'];

const DEMO_MARKETS_DATA: MarketData[] = [
  { market: 'Chengalpattu', modal: 24, estDistKm: 45, estTransportRs: 120 },
  { market: 'Koyambedu',    modal: 28, estDistKm: 62, estTransportRs: 160 },
  { market: 'Tiruvallur',   modal: 22, estDistKm: 28, estTransportRs: 80  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatINR(value: number): string {
  if (isNaN(value)) return '₹0';
  return `₹${value.toLocaleString('en-IN')}`;
}

function safeNum(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function bestMarketIndex(data: MarketData[], qty: number): number {
  let bestIdx = 0;
  let bestNet = -Infinity;
  data.forEach((m, i) => {
    const net = m.modal * qty - m.estTransportRs;
    if (net > bestNet) {
      bestNet = net;
      bestIdx = i;
    }
  });
  return bestIdx;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ComparisonScreen() {
  const router = useRouter();
  const { language } = useAuthStore();

  // Crop selector
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');

  // Market selection
  const [selectedMarketIdx, setSelectedMarketIdx] = useState<number>(0);

  // Calculator inputs
  const [qty, setQty]               = useState<string>('100');
  const [price, setPrice]           = useState<string>(String(DEMO_MARKETS_DATA[0].modal));
  const [transport, setTransport]   = useState<string>(String(DEMO_MARKETS_DATA[0].estTransportRs));
  const [otherExp, setOtherExp]     = useState<string>('0');

  // Sync calculator fields when selected market changes
  useEffect(() => {
    const m = DEMO_MARKETS_DATA[selectedMarketIdx];
    setPrice(String(m.modal));
    setTransport(String(m.estTransportRs));
  }, [selectedMarketIdx]);

  // Computed net proceeds
  const netProceeds: number = (() => {
    const p = safeNum(price);
    const q = safeNum(qty);
    const tr = safeNum(transport);
    const ot = safeNum(otherExp);
    return p * q - tr - ot;
  })();

  // Best market based on current qty
  const bestIdx = bestMarketIndex(DEMO_MARKETS_DATA, safeNum(qty));

  const handleSelectMarket = useCallback((idx: number) => {
    setSelectedMarketIdx(idx);
  }, []);

  const handleSelectCrop = useCallback((crop: string) => {
    setSelectedCrop(crop);
    // Reset to first market when crop changes
    setSelectedMarketIdx(0);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <RNText style={styles.backArrow}>{'←'}</RNText>
        </TouchableOpacity>
        <RNText style={styles.headerTitle}>Compare Markets</RNText>
        <View style={styles.headerRight} />
      </View>

      {/* ── Scrollable Body ───────────────────────────────────────── */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Demo label */}
        <View style={styles.demoRow}>
          <DemoLabel small />
        </View>

        {/* ── Crop Selector ─────────────────────────────────────── */}
        <RNText style={styles.sectionTitle}>Select Crop</RNText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cropScroll}
        >
          {CROPS.map((crop) => {
            const active = crop === selectedCrop;
            return (
              <TouchableOpacity
                key={crop}
                onPress={() => handleSelectCrop(crop)}
                activeOpacity={0.75}
                style={[styles.cropChip, active && styles.cropChipActive]}
              >
                <RNText style={[styles.cropChipText, active && styles.cropChipTextActive]}>
                  {crop}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Market Prices ─────────────────────────────────────── */}
        <RNText style={styles.sectionTitle}>Market Prices</RNText>

        {DEMO_MARKETS_DATA.map((m, idx) => {
          const isSelected = idx === selectedMarketIdx;
          const isBest = idx === bestIdx;
          const netVal = m.modal * safeNum(qty) - m.estTransportRs;

          return (
            <TouchableOpacity
              key={m.market}
              activeOpacity={0.85}
              onPress={() => handleSelectMarket(idx)}
            >
              <View style={[styles.marketCard, isSelected && styles.marketCardSelected]}>
                {/* Best Value badge */}
                {isBest && (
                  <View style={styles.bestBadge}>
                    <RNText style={styles.bestBadgeText}>Best Value</RNText>
                  </View>
                )}

                {/* Market name */}
                <RNText style={styles.marketName}>{m.market}</RNText>

                {/* Modal price */}
                <RNText style={styles.modalPrice}>₹{m.modal}/kg</RNText>

                {/* Distance & Transport row */}
                <View style={styles.infoRow}>
                  <View style={styles.infoCell}>
                    <RNText style={styles.infoLabel}>Est. Distance</RNText>
                    <RNText style={styles.infoValue}>~{m.estDistKm} km</RNText>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoCell}>
                    <RNText style={styles.infoLabel}>Est. Transport</RNText>
                    <RNText style={styles.infoValue}>~₹{m.estTransportRs}</RNText>
                  </View>
                </View>

                {/* Net value for current qty */}
                <View style={styles.netRow}>
                  <RNText style={styles.netLabel}>
                    Net for {qty || '0'} kg:{'  '}
                  </RNText>
                  <RNText style={[styles.netValue, netVal < 0 && styles.netValueNegative]}>
                    {formatINR(netVal)}
                  </RNText>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── Net Proceeds Calculator ───────────────────────────── */}
        <View style={styles.calcCard}>
          <RNText style={styles.calcTitle}>Net Proceeds Calculator</RNText>

          {/* Quantity */}
          <View style={styles.fieldRow}>
            <RNText style={styles.fieldLabel}>Quantity</RNText>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.textInput}
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={colors.secondaryText}
                returnKeyType="done"
              />
              <RNText style={styles.inputUnit}>kg</RNText>
            </View>
          </View>

          {/* Expected Price */}
          <View style={styles.fieldRow}>
            <RNText style={styles.fieldLabel}>Expected Price</RNText>
            <View style={styles.inputWrap}>
              <RNText style={styles.inputPrefix}>₹</RNText>
              <TextInput
                style={[styles.textInput, styles.textInputPrefixed]}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.secondaryText}
                returnKeyType="done"
              />
              <RNText style={styles.inputUnit}>/kg</RNText>
            </View>
          </View>

          {/* Transport Cost */}
          <View style={styles.fieldRow}>
            <RNText style={styles.fieldLabel}>Transport Cost</RNText>
            <View style={styles.inputWrap}>
              <RNText style={styles.inputPrefix}>₹</RNText>
              <TextInput
                style={[styles.textInput, styles.textInputPrefixed]}
                value={transport}
                onChangeText={setTransport}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.secondaryText}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Other Expenses */}
          <View style={styles.fieldRow}>
            <RNText style={styles.fieldLabel}>Other Expenses</RNText>
            <View style={styles.inputWrap}>
              <RNText style={styles.inputPrefix}>₹</RNText>
              <TextInput
                style={[styles.textInput, styles.textInputPrefixed]}
                value={otherExp}
                onChangeText={setOtherExp}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.secondaryText}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.calcDivider} />

          {/* Result */}
          <View style={styles.resultBlock}>
            <RNText
              style={[styles.resultAmount, netProceeds < 0 && styles.resultAmountNegative]}
            >
              {formatINR(netProceeds)}
            </RNText>
            <RNText style={styles.resultLabel}>Estimated Net Proceeds</RNText>
            <RNText style={styles.formulaText}>
              (₹{price || '0'} × {qty || '0'} kg) − ₹{transport || '0'} − ₹{otherExp || '0'}
            </RNText>
          </View>
        </View>

        {/* ── Disclaimer ───────────────────────────────────────── */}
        <View style={styles.disclaimer}>
          <RNText style={styles.disclaimerText}>
            ⚠️ All distance and transport values are rough estimates for planning purposes only.
            Verify actual costs before making selling decisions.
          </RNText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.ivory,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 56 : 48,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.round,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  backArrow: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    lineHeight: typography.fontSize.xl * 1.2,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 36,
  },

  // ── Scroll
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },

  // ── Demo label
  demoRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },

  // ── Section title
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },

  // ── Crop chips
  cropScroll: {
    paddingBottom: spacing.md,
    paddingRight: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  cropChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  cropChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cropChipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    color: colors.secondaryText,
  },
  cropChipTextActive: {
    color: colors.white,
    fontFamily: typography.fontBold,
  },

  // ── Market cards
  marketCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  marketCardSelected: {
    borderColor: colors.primary,
  },
  bestBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.limeAccent,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  bestBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
    color: colors.primaryDark,
  },
  marketName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  modalPrice: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: colors.ivory,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  infoCell: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
    color: colors.secondaryText,
    marginBottom: 2,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    textAlign: 'center',
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    color: colors.secondaryText,
  },
  netValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
    color: colors.success,
  },
  netValueNegative: {
    color: colors.error,
  },

  // ── Calculator card
  calcCard: {
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  calcTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    marginBottom: spacing.lg,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    color: colors.primaryText,
    flex: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minWidth: 110,
    height: 44,
  },
  inputPrefix: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    marginRight: 2,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    paddingVertical: 0,
    minWidth: 48,
    textAlign: 'right',
  },
  textInputPrefixed: {
    textAlign: 'right',
  },
  inputUnit: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
    color: colors.secondaryText,
    marginLeft: spacing.xs,
  },
  calcDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  resultBlock: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultAmount: {
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontBold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  resultAmountNegative: {
    color: colors.error,
  },
  resultLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    color: colors.secondaryText,
    marginBottom: spacing.sm,
  },
  formulaText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
    color: colors.secondaryText,
    textAlign: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── Disclaimer
  disclaimer: {
    backgroundColor: '#FFF8E6',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  disclaimerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
    color: '#7A5C00',
    lineHeight: typography.fontSize.sm * 1.5,
  },
});
