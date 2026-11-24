import {StyleSheet, View, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform, Image as RnImage, TouchableOpacity, Alert} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight, X, Plus, Camera, MapPin } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, UNITS } from '../constants/theme';
import { getCropImageSource } from '../constants/images';
import { t } from '../localization';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../components/ui';
import { useAuthStore } from '../store';
import { api } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const STEPS = [
  { key: 'crop', label: 'Select Crop' },
  { key: 'photos', label: 'Upload Photos' },
  { key: 'quantity', label: 'Quantity & Price' },
  { key: 'location', label: 'Location' },
  { key: 'description', label: 'Description' },
  { key: 'review', label: 'Review & Publish' },
];

export default function SellScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Chengalpattu, Tamil Nadu');
  const [description, setDescription] = useState('');

  const step = STEPS[stepIndex];

  const addImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets) {
        setImages((prev) => [...prev, ...result.assets.map((a) => a.uri || '')]);
      }
    } catch (e) {
      console.error('Image picker error', e);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((s) => s + 1);
    } else {
      await api.createProduceListing({
        crop,
        quantity: quantity || '100',
        unit,
        price: price || '24',
        location: location || user?.district || 'Chengalpattu, Tamil Nadu',
        description: description || 'Fresh farm harvested produce.',
        farmer: user?.full_name || 'You (Farmer)',
      });
      Alert.alert(
        'Produce Published!',
        `Your ${crop} listing (${quantity || '100'} ${unit} at ₹${price || '24'}/${unit}) is now live on the marketplace. Buyers can discover it and send purchase inquiries.`,
        [
          { text: 'View Marketplace', onPress: () => router.replace('/(tabs)/marketplace') },
        ]
      );
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((s) => s - 1);
    } else {
      router.back();
    }
  };

  const canProceed = () => {
    if (step.key === 'crop') return true;
    if (step.key === 'photos') return images.length > 0;
    if (step.key === 'quantity') return quantity && price;
    return true;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={handleBack}>
            <X size={20} color={colors.primaryText} />
          </TouchableOpacity>
          <Heading style={styles.title}>{step.label}</Heading>
          <Caption style={styles.stepText}>Step {stepIndex + 1} of {STEPS.length}</Caption>
        </View>

        <View style={styles.progress}>
          {STEPS.map((s, i) => (
            <View key={s.key} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.content}>
          {step.key === 'crop' && (
            <View style={styles.cropSection}>
              <Caption>What are you selling?</Caption>
              <View style={styles.cropGrid}>
                {['Tomato', 'Onion', 'Paddy', 'Groundnut', 'Coconut', 'Banana', 'Potato'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.cropChip, crop === c && styles.cropChipActive]}
                    onPress={() => setCrop(c)}
                  >
                    <RnImage source={getCropImageSource(c)} style={styles.cropChipImg} />
                    <Text style={[styles.cropLabel, crop === c && styles.cropLabelActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {step.key === 'photos' && (
            <View style={styles.photoSection}>
              <Caption>Upload photos of your produce</Caption>
              <View style={styles.photoGrid}>
                {images.map((uri, i) => (
                  <View key={i} style={styles.photoItem}>
                    <RnImage source={{ uri }} style={styles.photoImage} />
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
                      <X size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity style={styles.addPhoto} onPress={addImage}>
                    <Plus size={24} color={colors.primary} />
                    <Caption style={styles.addPhotoLabel}>Add photo</Caption>
                  </TouchableOpacity>
                )}
              </View>
              {images.length === 0 && (
                <Caption style={styles.emptyPhotos}>Tap to add photos of your produce</Caption>
              )}
            </View>
          )}
          {step.key === 'quantity' && (
            <View style={styles.formSection}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Quantity (e.g. 500)"
                  placeholderTextColor={colors.secondaryText}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.unitSelect} onPress={() => {}}>
                  <Text style={styles.unitText}>{unit}</Text>
                  <ChevronRight size={16} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Expected price per unit"
                  placeholderTextColor={colors.secondaryText}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
                <Text style={styles.currency}>₹</Text>
              </View>
            </View>
          )}
          {step.key === 'location' && (
            <View style={styles.formSection}>
              <View style={styles.inputRow}>
                <MapPin size={20} color={colors.secondaryText} />
                <TextInput
                  style={styles.input}
                  placeholder="Your location"
                  placeholderTextColor={colors.secondaryText}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>
          )}
          {step.key === 'description' && (
            <View style={styles.formSection}>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Describe your produce"
                placeholderTextColor={colors.secondaryText}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          )}
          {step.key === 'review' && (
            <View style={styles.reviewSection}>
              <View style={styles.reviewCropCard}>
                <RnImage source={getCropImageSource(crop)} style={styles.reviewCropImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewCropTitle}>{crop}</Text>
                  <Caption>{quantity || '0'} {unit} • ₹{price || '0'}/{unit}</Caption>
                </View>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Crop</Text>
                <Text style={styles.reviewValue}>{crop}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Quantity</Text>
                <Text style={styles.reviewValue}>{quantity} {unit}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Price</Text>
                <Text style={styles.reviewValue}>₹{price} per {unit}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Location</Text>
                <Text style={styles.reviewValue}>{location}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Description</Text>
                <Text style={styles.reviewValue}>{description || 'Not provided'}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          {stepIndex > 0 && (
            <Button variant="outline" onPress={handleBack} style={{ flex: 1 }}>
              Back
            </Button>
          )}
          <Button onPress={handleNext} style={{ flex: 1 }}>
            {stepIndex === STEPS.length - 1 ? 'Publish Listing' : 'Next'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  back: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center' },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  stepText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.muted },
  dotActive: { width: 24, backgroundColor: colors.primary },
  content: { paddingHorizontal: spacing.lg },
  cropSection: { gap: spacing.md },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
  },
  cropChipImg: {
    width: 26,
    height: 26,
    borderRadius: radius.round,
    marginRight: spacing.xs,
  },
  cropChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cropLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  cropLabelActive: { color: colors.white },
  reviewCropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  reviewCropImg: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
  },
  reviewCropTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  photoSection: { gap: spacing.md },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  photoItem: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.ivory,
  },
  photoImage: { width: 90, height: 90 },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: radius.round,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {
    width: 90,
    height: 90,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addPhotoLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  emptyPhotos: {
    color: colors.secondaryText,
    textAlign: 'center' as const,
    marginTop: spacing.lg,
  },
  formSection: { gap: spacing.md },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  input: {
    flex: 1,
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top' as const,
    paddingVertical: spacing.md,
  },
  currency: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
    marginLeft: spacing.sm,
  },
  unitSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  unitText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
  reviewSection: { gap: spacing.md },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewLabel: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
  },
  reviewValue: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  demoBadge: { alignSelf: 'center', marginBottom: spacing.lg },
});
