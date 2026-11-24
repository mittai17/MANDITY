import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Bell,
  TrendingUp,
  MessageSquare,
  BarChart2,
  CheckCheck,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../constants/theme';
import { Card, Text, Heading, Caption, Button, DemoLabel as DemoBadge } from '../components/ui';
import { api } from '../services/api';
import type { NotificationItem } from '../types';

const { width } = Dimensions.get('window');

type FilterType = 'all' | 'price_alert' | 'inquiry' | 'market_update';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  const loadNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    loadNotifications();
  };

  const handleItemPress = async (item: NotificationItem) => {
    await api.markNotificationRead(item.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n))
    );

    if (item.type === 'price_alert') {
      router.push('/prices/tomato');
    } else if (item.type === 'inquiry') {
      router.push('/inquiries');
    } else if (item.type === 'forecast') {
      router.push('/prices/onion');
    }
  };

  const filtered = notifications.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp size={20} color={colors.success} />;
      case 'inquiry':
        return <MessageSquare size={20} color={colors.primary} />;
      case 'forecast':
        return <Sparkles size={20} color={colors.warning} />;
      default:
        return <BarChart2 size={20} color={colors.primaryLight} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ChevronLeft size={22} color={colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Heading style={styles.title}>Notifications</Heading>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.markReadBtn}
          onPress={handleMarkAllRead}
          activeOpacity={0.7}
        >
          <CheckCheck size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {[
            { key: 'all', label: 'All' },
            { key: 'price_alert', label: 'Price Alerts' },
            { key: 'inquiry', label: 'Inquiries' },
            { key: 'market_update', label: 'Market Updates' },
          ].map((tab) => {
            const active = filter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, active && styles.tabChipActive]}
                onPress={() => setFilter(tab.key as FilterType)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.secondaryText} style={{ opacity: 0.5 }} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Caption style={styles.emptySubtitle}>
              You will receive real-time mandi updates and inquiry notifications here.
            </Caption>
          </View>
        ) : (
          filtered.map((item) => {
            const isUnread = !item.read_at;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, isUnread && styles.itemCardUnread]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, isUnread && styles.iconWrapUnread]}>
                  {renderIcon(item.type)}
                </View>
                <View style={styles.itemBody}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}>
                      {item.title}
                    </Text>
                    {isUnread && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.itemText}>{item.body}</Text>
                  <Caption style={styles.itemTime}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Caption>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontBold,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
  },
  markReadBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  tabsContainer: {
    marginBottom: spacing.xs,
  },
  tabs: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tabChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.white,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabLabel: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  tabLabelActive: {
    color: colors.white,
  },
  demoBadge: {
    alignSelf: 'center',
    marginVertical: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  itemCard: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.sm,
  },
  itemCardUnread: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: {
    backgroundColor: '#EBF4F0',
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
    flex: 1,
  },
  itemTitleUnread: {
    fontFamily: typography.fontBold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  itemText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
  itemTime: {
    marginTop: 2,
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  emptySubtitle: {
    color: colors.secondaryText,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
