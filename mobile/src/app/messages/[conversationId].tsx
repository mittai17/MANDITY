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
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { t } from '../../localization';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  sender: 'me' | 'other';
  content: string;
  time: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUBBLE_MAX_WIDTH = SCREEN_WIDTH * 0.75;

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'other',
    content: 'Hello! I am interested in your tomatoes. Are they available?',
    time: '10:00 AM',
  },
  {
    id: '2',
    sender: 'me',
    content:
      'Yes, I have 500kg available fresh from the farm. What quantity do you need?',
    time: '10:02 AM',
  },
  {
    id: '3',
    sender: 'other',
    content: 'I need 100kg. Can you do ₹22/kg? Market rate seems to be around that.',
    time: '10:05 AM',
  },
  {
    id: '4',
    sender: 'me',
    content:
      'Minimum I can do is ₹23/kg. The quality is Grade A, freshly harvested.',
    time: '10:07 AM',
  },
  {
    id: '5',
    sender: 'other',
    content: 'Deal! Can we meet tomorrow at the market?',
    time: '10:10 AM',
  },
];

// ─── Message Bubble ───────────────────────────────────────────────────────────

const MessageBubble = React.memo(({ message }: { message: Message }) => {
  const isMe = message.sender === 'me';
  return (
    <View
      style={[
        styles.messageRow,
        isMe ? styles.messageRowRight : styles.messageRowLeft,
      ]}
    >
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <RNText
          style={[
            styles.bubbleText,
            isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
          ]}
        >
          {message.content}
        </RNText>
      </View>
      <RNText
        style={[
          styles.timeText,
          isMe ? styles.timeTextRight : styles.timeTextLeft,
        ]}
      >
        {message.time}
      </RNText>
    </View>
  );
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ConversationScreen() {
  const router = useRouter();
  const { conversationId, name } = useLocalSearchParams<{
    conversationId: string;
    name?: string;
  }>();
  const { language } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const displayName = typeof name === 'string' && name.trim() ? name : 'Ravi Kumar';

  // Scroll to end when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getTimeString = (): string => {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${ampm}`;
  };

  // ── Send ─────────────────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      content: trimmed,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  }, [inputText, isSending]);

  // ── Render item ───────────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: Message }) => <MessageBubble message={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <RNText style={styles.backIcon}>‹</RNText>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <RNText style={styles.headerName} numberOfLines={1}>
            {displayName}
          </RNText>
          <RNText style={styles.headerCaption}>Online</RNText>
        </View>

        {/* Spacer to balance back button */}
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Messages + Input (KeyboardAvoidingView wraps both) ── */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        {/* ── Input Bar ── */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.secondaryText}
            multiline
            maxLength={1000}
            returnKeyType="default"
            blurOnSubmit={false}
            textAlignVertical="center"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <RNText style={styles.sendIcon}>➤</RNText>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
  },
  backIcon: {
    fontSize: 30,
    color: colors.primaryText,
    lineHeight: 34,
    marginTop: -2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  headerName: {
    fontSize: typography.fontSize.md,
    color: colors.primaryText,
    fontFamily: typography.fontBold,
    fontWeight: '700',
  },
  headerCaption: {
    fontSize: typography.fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },

  // Notice bar
  noticeBar: {
    height: 32,
    backgroundColor: colors.limeAccent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  noticeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryText,
    fontFamily: typography.fontMedium,
    fontWeight: '500',
  },

  // Keyboard avoiding
  keyboardView: {
    flex: 1,
  },

  // Message list
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Message rows
  messageRow: {
    marginVertical: 4,
    maxWidth: BUBBLE_MAX_WIDTH,
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },

  // Bubbles
  bubble: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    ...shadows.sm,
  },
  bubbleOther: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    ...shadows.sm,
  },
  bubbleText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: colors.white,
    fontFamily: typography.fontMedium,
  },
  bubbleTextOther: {
    color: colors.primaryText,
    fontFamily: typography.fontMedium,
  },

  // Timestamps
  timeText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },
  timeTextRight: {
    textAlign: 'right',
  },
  timeTextLeft: {
    textAlign: 'left',
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.sm,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: colors.ivory,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm + 2 : spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.primaryText,
    fontFamily: typography.fontMedium,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  sendButtonDisabled: {
    backgroundColor: colors.muted,
    ...(shadows.sm as object),
    elevation: 0,
  },
  sendIcon: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 2,
  },
});
