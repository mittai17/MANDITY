import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Phone, MapPin, Check, Camera } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, LANGUAGES } from '../constants/theme';
import { getAvatarSource, AVATAR_IMAGES } from '../constants/images';
import { Card, Button, Text, Heading, Caption } from '../components/ui';
import { useAuthStore } from '../store';
import type { UserRole, LanguageCode } from '../types';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser, language, setLanguage } = useAuthStore();

  const [fullName, setFullName] = useState(user?.full_name || 'Ravi Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [role, setRole] = useState<UserRole>(user?.role || 'farmer');
  const [district, setDistrict] = useState(user?.district || 'Chengalpattu');
  const [village, setVillage] = useState(user?.village || 'Maduranthakam');
  const [selectedAvatar, setSelectedAvatar] = useState('Ravi Kumar');

  const avatarOptions = ['Ravi Kumar', 'Lakshmi Devi', 'Arun Prakash', 'Sita Ramesh'];

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    setUser({
      id: user?.id || 'demo-user-1',
      full_name: fullName.trim(),
      phone: phone.trim(),
      role,
      preferred_language: language,
      district: district.trim(),
      village: village.trim(),
      created_at: user?.created_at || new Date().toISOString(),
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <ChevronLeft size={22} color={colors.primaryText} />
          </TouchableOpacity>
          <Heading style={styles.title}>Edit Profile</Heading>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar Selector */}
        <View style={styles.avatarSection}>
          <View style={styles.mainAvatarWrap}>
            <Image source={getAvatarSource(selectedAvatar)} style={styles.mainAvatar} />
          </View>
          <Caption style={styles.avatarLabel}>Choose Profile Photo</Caption>
          <View style={styles.avatarRow}>
            {avatarOptions.map((name) => {
              const active = selectedAvatar === name;
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.avatarOption, active && styles.avatarOptionActive]}
                  onPress={() => setSelectedAvatar(name)}
                  activeOpacity={0.8}
                >
                  <Image source={getAvatarSource(name)} style={styles.avatarOptionImg} />
                  {active && (
                    <View style={styles.checkBadge}>
                      <Check size={12} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Role Toggle */}
        <View style={styles.roleContainer}>
          <Caption style={styles.inputLabel}>I am a:</Caption>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'farmer' && styles.roleBtnActive]}
              onPress={() => setRole('farmer')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>
                🌾 Farmer (Produce Seller)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'buyer' && styles.roleBtnActive]}
              onPress={() => setRole('buyer')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>
                🛒 Buyer / Trader
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Caption style={styles.inputLabel}>Full Name</Caption>
            <View style={styles.inputWrap}>
              <User size={18} color={colors.secondaryText} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Caption style={styles.inputLabel}>Phone Number</Caption>
            <View style={styles.inputWrap}>
              <Phone size={18} color={colors.secondaryText} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor={colors.secondaryText}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Caption style={styles.inputLabel}>District / Mandi</Caption>
            <View style={styles.inputWrap}>
              <MapPin size={18} color={colors.secondaryText} />
              <TextInput
                style={styles.input}
                value={district}
                onChangeText={setDistrict}
                placeholder="e.g. Chengalpattu"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Caption style={styles.inputLabel}>Village / Taluk</Caption>
            <View style={styles.inputWrap}>
              <MapPin size={18} color={colors.secondaryText} />
              <TextInput
                style={styles.input}
                value={village}
                onChangeText={setVillage}
                placeholder="e.g. Maduranthakam"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actionSection}>
          <Button onPress={handleSave} fullWidth>
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  scroll: {
    paddingBottom: 100,
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  mainAvatarWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.round,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
  },
  avatarLabel: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatarOption: {
    width: 48,
    height: 48,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  avatarOptionActive: {
    borderColor: colors.primary,
  },
  avatarOptionImg: {
    width: '100%',
    height: '100%',
    borderRadius: radius.round,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryText,
    fontFamily: typography.fontMedium,
  },
  roleTextActive: {
    color: colors.white,
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    color: colors.primaryDark,
    fontFamily: typography.fontMedium,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    ...shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.primaryText,
  },
  actionSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
