import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
} from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { colors, spacing, radius, typography, shadows, LANGUAGES } from '../../constants/theme';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../../components/ui';
import { api } from '../../services/api';
import { useAuthStore } from '../../store';

const { width } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  intent?: string;
  data?: any;
}

const SUGGESTIONS = [
  { label: '🍅 Today’s Tomato Price', query: "What is today's tomato mandi price?" },
  { label: '⚖️ Compare Markets for Onion', query: 'Compare Chengalpattu and Koyambedu for onion' },
  { label: '📈 7-Day Paddy Forecast', query: 'What is the price forecast for paddy next week?' },
  { label: '💰 Net Proceeds for 500kg', query: 'Calculate net earnings for selling 500 kg tomato' },
];

export default function AIScreen() {
  const router = useRouter();
  const { language, setLanguage, user } = useAuthStore();
  const scrollViewRef = useRef<any>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Vanakkam ${user?.full_name || 'Farmer'}! I am Mandity AI, your multilingual mandi assistant. You can speak or type to check today's prices, compare nearby markets, forecast trends, or calculate net earnings.`,
      time: 'Just now',
      intent: 'welcome',
    },
  ]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speakText = async (id: string, text: string) => {
    if (speakingMsgId === id) {
      await Speech.stop();
      setSpeakingMsgId(null);
      return;
    }

    await Speech.stop();
    setSpeakingMsgId(id);

    const langMap: Record<string, string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
    };

    Speech.speak(text, {
      language: langMap[language] || 'en-IN',
      rate: 0.95,
      pitch: 1.0,
      onDone: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null),
      onStopped: () => setSpeakingMsgId(null),
    });
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isProcessing) return;

    setInputQuery('');

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const result = await api.voiceQuery(textToSend, language);

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: result.response_text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: result.intent,
        data: result.data_retrieved,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Speak automatically if triggered via voice
      if (isListening) {
        speakText(aiMsg.id, aiMsg.text);
      }
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: "I couldn't reach the market database right now. Please check your network and try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      setIsListening(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  const handleMicPress = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Simulate real voice capture cycle with high-intent prompts
    const voiceCandidates = [
      "What is today's tomato price in Chengalpattu?",
      "Compare nearby markets for onion",
      "Is paddy price expected to rise next week?",
      "What are my estimated net proceeds for 500kg tomato?",
    ];
    const chosen = voiceCandidates[Math.floor(Math.random() * voiceCandidates.length)];

    setTimeout(() => {
      setIsListening(false);
      handleSend(chosen);
    }, 2200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <View style={styles.aiIconBadge}>
            <Sparkles size={18} color={colors.white} />
          </View>
          <View>
            <Heading style={styles.title}>Mandity AI</Heading>
            <Caption style={styles.subtitle}>Voice Market Intelligence</Caption>
          </View>
        </View>
        <DemoBadge small />
      </View>

      {/* Language Selector */}
      <View style={styles.langRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
          {[
            { code: 'en', label: 'English' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'hi', label: 'हिन्दी' },
            { code: 'te', label: 'తెలుగు' },
          ].map((lang) => {
            const active = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langChip, active && styles.langChipActive]}
                onPress={() => setLanguage(lang.code as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.langText, active && styles.langTextActive]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesScroll}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <View
              key={msg.id}
              style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAI]}
            >
              {!isUser && (
                <View style={styles.aiAvatar}>
                  <Bot size={18} color={colors.white} />
                </View>
              )}

              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextAI]}>
                  {msg.text}
                </Text>

                <View style={styles.msgFooter}>
                  <Caption style={isUser ? styles.timeUser : styles.timeAI}>{msg.time}</Caption>

                  {!isUser && (
                    <TouchableOpacity
                      style={styles.ttsBtn}
                      onPress={() => speakText(msg.id, msg.text)}
                      activeOpacity={0.7}
                    >
                      {isSpeaking ? (
                        <VolumeX size={16} color={colors.primary} />
                      ) : (
                        <Volume2 size={16} color={colors.secondaryText} />
                      )}
                      <Caption style={{ color: isSpeaking ? colors.primary : colors.secondaryText }}>
                        {isSpeaking ? 'Stop' : 'Listen'}
                      </Caption>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {isProcessing && (
          <View style={[styles.msgRow, styles.msgRowAI]}>
            <View style={styles.aiAvatar}>
              <Bot size={18} color={colors.white} />
            </View>
            <View style={[styles.bubble, styles.bubbleAI, styles.processingBubble]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Caption style={{ color: colors.primaryText, marginLeft: spacing.xs }}>
                Consulting Agmarknet & forecasting models...
              </Caption>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Suggestion Chips */}
      <View style={styles.suggestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
          {SUGGESTIONS.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionChip}
              onPress={() => handleSend(s.query)}
              activeOpacity={0.8}
            >
              <Text style={styles.suggestionText}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBarContainer}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={inputQuery}
            onChangeText={setInputQuery}
            placeholder="Ask Mandity AI or tap mic..."
            placeholderTextColor={colors.secondaryText}
            onSubmitEditing={() => handleSend()}
          />
          {inputQuery.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
              <Send size={18} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.micBtn, isListening && styles.micBtnListening]}
              onPress={handleMicPress}
              activeOpacity={0.8}
            >
              {isListening ? (
                <MicOff size={20} color={colors.white} />
              ) : (
                <Mic size={20} color={colors.white} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {isListening && (
          <Caption style={styles.listeningCaption}>
            🎙️ Listening... Speak your crop question
          </Caption>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aiIconBadge: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.secondaryText,
  },
  langRow: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  langChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondaryText,
    fontFamily: typography.fontMedium,
  },
  langTextActive: {
    color: colors.white,
    fontFamily: typography.fontBold,
  },
  messagesScroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  msgRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'flex-end',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAI: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: width * 0.78,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleAI: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  processingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  msgTextUser: {
    color: colors.white,
  },
  msgTextAI: {
    color: colors.primaryText,
  },
  msgFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  timeUser: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  timeAI: {
    color: colors.secondaryText,
    fontSize: 10,
  },
  ttsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  suggestionsContainer: {
    paddingVertical: spacing.xs,
    backgroundColor: colors.ivory,
  },
  suggestionsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  suggestionChip: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  suggestionText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontMedium,
  },
  inputBarContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ivory,
    borderRadius: radius.round,
    paddingLeft: spacing.md,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.primaryText,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnListening: {
    backgroundColor: colors.error,
  },
  listeningCaption: {
    textAlign: 'center',
    color: colors.error,
    marginTop: 4,
    fontFamily: typography.fontMedium,
  },
});
