import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MessageCircle, Clock, ChevronRight } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { t } from '../../localization';
import { Card, Button, Text, Caption } from '../../components/ui';

const { width } = Dimensions.get('window');

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Ravi Kumar',
    role: 'Farmer',
    lastMessage: 'Yes, tomatoes are available. ₹24/kg.',
    time: '10:15 AM',
    unread: 1,
    avatar: '',
  },
  {
    id: '2',
    name: 'Lakshmi Devi',
    role: 'Buyer',
    lastMessage: 'I am interested in your onions.',
    time: 'Yesterday',
    unread: 0,
    avatar: '',
  },
];

export default function MessagesListScreen() {
  const router = useRouter();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('conversations', 'en')}</Text>
        <Caption style={styles.subtitle}>Your buyer-farmer conversations</Caption>
      </View>

      <View style={styles.actions}>
        <Button variant="outline" onPress={() => router.push('/messages/new')}>
          <MessageCircle size={18} color={colors.primary} /> New Message
        </Button>
      </View>

      <View style={styles.list}>
        {CONVERSATIONS.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.card}
            onPress={() => router.push(`/messages/${c.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.avatar} />
            <View style={styles.info}>
              <View style={styles.infoRow}>
                <Text style={styles.name}>{c.name}</Text>
                <Caption style={styles.time}>{c.time}</Caption>
              </View>
              <Caption style={styles.preview}>{c.lastMessage}</Caption>
              {c.unread > 0 && (
                <View style={styles.unread}>
                  <Text style={styles.unreadText}>{c.unread}</Text>
                </View>
              )}
            </View>
            <ChevronRight size={16} color={colors.secondaryText} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  actions: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  info: { flex: 1, gap: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  name: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  time: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  preview: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  unread: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  unreadText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
  },
});
