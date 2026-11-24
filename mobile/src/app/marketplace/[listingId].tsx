import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Share2,
  Heart,
  CheckCircle,
  X,
  Send,
} from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { getCropImageSource, getAvatarSource } from '../../constants/images';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../../components/ui';
import { useAuthStore } from '../../store';
import { api } from '../../services/api';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ listingId: string }>();
  const { user } = useAuthStore();

  const [isSaved, setIsSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState('22');
  const [requestedQty, setRequestedQty] = useState('200');
  const [message, setMessage] = useState('Interested in immediate pickup from your farm.');
  const [submitting, setSubmitting] = useState(false);

  const [listing] = useState({
    id: params.listingId || '1',
    crop: 'Tomato',
    quantity: '500 kg',
    price: '₹24/kg',
    location: 'Chengalpattu, Tamil Nadu',
    farmer: 'Ravi Kumar',
    posted: '2 hours ago',
    verified: true,
    description:
      'Fresh tomatoes harvested today. Premium quality Grade A, organically grown. Available for immediate pickup or delivery.',
  });

  useEffect(() => {
    setIsSaved(api.isListingSaved(listing.id));
  }, [listing.id]);

  const handleToggleSave = () => {
    const saved = api.toggleSavedListing(listing.id);
    setIsSaved(saved);
  };

  const handleContact = () => {
    router.push('/messages/1');
  };

  const handleSubmitInquiry = async () => {
    const priceNum = parseFloat(offeredPrice);
    const qtyNum = parseFloat(requestedQty);
    if (!priceNum || !qtyNum) {
      Alert.alert('Validation Error', 'Please enter a valid price and quantity.');
      return;
    }

    setSubmitting(true);
    try {
      await api.createInquiry({
        listing_id: listing.id,
        buyer_id: user?.id || 'demo-buyer-1',
        crop_name: listing.crop,
        seller_name: listing.farmer,
        offered_price: priceNum,
        requested_quantity: qtyNum,
        message: message.trim(),
      });
      setModalVisible(false);
      Alert.alert(
        'Inquiry Submitted!',
        `Your purchase offer of ₹${priceNum}/kg for ${qtyNum} kg has been sent to ${listing.farmer}.`,
        [
          { text: 'View My Inquiries', onPress: () => router.push('/inquiries') },
          { text: 'OK' },
        ]
      );
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <ChevronLeft size={22} color={colors.primaryText} />
          </TouchableOpacity>
          <Heading style={styles.headerTitle}>{listing.crop} Details</Heading>
          <TouchableOpacity style={styles.heartBtn} onPress={handleToggleSave}>
            <Heart
              size={20}
              color={isSaved ? colors.error : colors.primaryText}
              fill={isSaved ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.images}>
          <Image
            source={getCropImageSource(listing.crop)}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <DemoBadge small style={styles.demoBadge} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.listingTitle}>{listing.crop}</Text>
            {listing.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified Producer</Text>
              </View>
            )}
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.listingPrice}>{listing.price}</Text>
            <Text style={styles.listingQty}>Available: {listing.quantity}</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.locationText}>{listing.location}</Text>
          </View>
          <Caption style={styles.postedText}>Posted {listing.posted}</Caption>

          <View style={styles.divider} />

          {/* Farmer Card */}
          <View style={styles.farmerSection}>
            <View style={styles.farmerHeader}>
              <Image source={getAvatarSource(listing.farmer)} style={styles.farmerAvatarImg} />
              <View style={styles.farmerInfo}>
                <Text style={styles.farmerName}>{listing.farmer}</Text>
                <Caption style={styles.farmerLocation}>{listing.location}</Caption>
              </View>
            </View>
            <Caption style={styles.descriptionLabel}>Produce Description</Caption>
            <Text style={styles.descriptionText}>{listing.description}</Text>
          </View>

          <View style={styles.divider} />

          {/* Action Section */}
          <View style={styles.actionSection}>
            <Button
              onPress={() => setModalVisible(true)}
              style={{ flex: 1, backgroundColor: colors.primary }}
            >
              <Send size={18} color={colors.white} /> Make an Offer
            </Button>
            <Button variant="outline" onPress={handleContact} style={{ flex: 1 }}>
              <MessageCircle size={18} color={colors.primary} /> Chat
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Inquiry Offer Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Heading style={styles.modalTitle}>Send Purchase Offer</Heading>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <Caption style={styles.modalSubtitle}>
              Propose your buying price and required quantity directly to {listing.farmer}.
            </Caption>

            <View style={styles.modalField}>
              <Caption style={styles.modalLabel}>Your Offered Price (₹/kg)</Caption>
              <TextInput
                style={styles.modalInput}
                value={offeredPrice}
                onChangeText={setOfferedPrice}
                keyboardType="numeric"
                placeholder="e.g. 22"
              />
            </View>

            <View style={styles.modalField}>
              <Caption style={styles.modalLabel}>Quantity Needed (kg)</Caption>
              <TextInput
                style={styles.modalInput}
                value={requestedQty}
                onChangeText={setRequestedQty}
                keyboardType="numeric"
                placeholder="e.g. 200"
              />
            </View>

            <View style={styles.modalField}>
              <Caption style={styles.modalLabel}>Note / Pickup Details</Caption>
              <TextInput
                style={[styles.modalInput, { height: 60 }]}
                value={message}
                onChangeText={setMessage}
                multiline
                placeholder="Pickup timing, payment terms..."
              />
            </View>

            <View style={styles.modalCalc}>
              <Caption>Total Estimated Value:</Caption>
              <Text style={styles.modalTotal}>
                ₹{((parseFloat(offeredPrice) || 0) * (parseFloat(requestedQty) || 0)).toLocaleString('en-IN')}
              </Text>
            </View>

            <Button onPress={handleSubmitInquiry} loading={submitting} fullWidth>
              Submit Inquiry Offer
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  images: {
    width: '100%',
    height: 240,
    backgroundColor: colors.ivory,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  demoBadge: { alignSelf: 'center', marginVertical: spacing.sm },
  content: { paddingHorizontal: spacing.lg },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  locationText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
  postedText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  farmerSection: { gap: spacing.sm },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  farmerAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  farmerInfo: { gap: 2 },
  farmerName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  farmerLocation: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
  descriptionLabel: {
    color: colors.primaryText,
    fontFamily: typography.fontMedium,
    marginTop: 4,
  },
  descriptionText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  actionSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
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
  modalSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.secondaryText,
  },
  modalField: {
    gap: 4,
  },
  modalLabel: {
    color: colors.primaryDark,
    fontFamily: typography.fontMedium,
  },
  modalInput: {
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.primaryText,
  },
  modalCalc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  modalTotal: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
});
