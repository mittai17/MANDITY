import { StyleSheet, View, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChevronRight, User, MessageCircle } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { t } from '../../localization';
import { Card, Button, Text, Caption } from '../../components/ui';

const { width } = Dimensions.get('window');

const FARMERS = [
  { id: '1', name: 'Ravi Kumar', location: 'Chengalpattu, Tamil Nadu', crops: ['Tomato', 'Onion'] },
  { id: '2', name: 'Lakshmi Devi', location: 'Koyambedu, Chennai', crops: ['Onion', 'Potato'] },
  { id: '3', name: 'Arun Prakash', location: 'Tiruvallur, Tamil Nadu', crops: ['Paddy', 'Banana'] },
];

export default function NewMessageScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = FARMERS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (farmer: any) => {
    router.push(`/messages/${farmer.id}`);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <ChevronRight size={20} color={colors.primaryText} style={{ transform: [{ rotate: '180deg' }] } as any} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('send_inquiry', 'en')}</Text>
        </View>

        <View style={styles.searchBar}>
          <User size={20} color={colors.secondaryText} />
          <TextInput
            style={styles.input}
            placeholder="Search farmers"
            placeholderTextColor={colors.secondaryText}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.list}>
          {filtered.map((farmer) => (
            <TouchableOpacity
              key={farmer.id}
              style={styles.card}
              onPress={() => handleSelect(farmer)}
              activeOpacity={0.8}
            >
              <View style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{farmer.name}</Text>
                <Caption style={styles.location}>{farmer.location}</Caption>
                <Caption style={styles.crops}>{farmer.crops.join(', ')}</Caption>
              </View>
              <MessageCircle size={18} color={colors.primary} />
            </TouchableOpacity>
          ))}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  info: { flex: 1, gap: 2 },
  name: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  location: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  crops: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
});
