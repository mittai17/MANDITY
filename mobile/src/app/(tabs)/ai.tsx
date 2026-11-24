import { StyleSheet, View, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Mic, MicOff, Send, Loader2, Scroll } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../constants/theme';
import { t } from '../../localization';
import { Card, Button, Text, Heading, Caption, DemoLabel as DemoBadge } from '../../components/ui';

const { width } = Dimensions.get('window');

export default function AIScreen() {
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('en');
  const [audioUri, setAudioUri] = useState<string | null>(null);

  const handleListen = async () => {
    setListening(true);
    setTranscript('Listening...');
    setResponse('');
    try {
      await new Promise((r) => setTimeout(r, 2000));
      setTranscript("What is today's tomato price?");
      setProcessing(true);
      await new Promise((r) => setTimeout(r, 1500));
      setProcessing(false);
      setResponse("Tomato prices are currently ₹24/kg in your selected market. Prices have increased by 5% compared to yesterday. This is demo data.");
      setAudioUri(null);
    } catch (e) {
      console.error('Voice error', e);
    } finally {
      setListening(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Heading style={styles.title}>{t('ai_assistant', 'en')}</Heading>
          <Caption style={styles.subtitle}>Ask about crop prices, markets, and forecasts</Caption>
        </View>

        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>Language</Text>
          <View style={styles.languageSelector}>
            <Button variant="outline" size="sm" onPress={() => setLanguage('en')} style={{ width: 80 }}>
              English
            </Button>
            <Button variant="outline" size="sm" onPress={() => setLanguage('ta')} style={{ width: 80 }}>
              தமிழ்
            </Button>
            <Button variant="outline" size="sm" onPress={() => setLanguage('hi')} style={{ width: 80 }}>
              हिन्दी
            </Button>
            <Button variant="outline" size="sm" onPress={() => setLanguage('te')} style={{ width: 80 }}>
              తెలుగు
            </Button>
          </View>
        </View>

        <DemoBadge small style={styles.demoBadge} />

        <View style={styles.transcriptCard}>
          <Caption style={styles.transcriptLabel}>Your question</Caption>
          <Text style={styles.transcriptText}>{transcript || 'Tap the microphone and ask a question'}</Text>
        </View>

        {processing ? (
          <View style={styles.processing}>
            <Loader2 size={24} color={colors.primary} />
            <Caption style={styles.processingText}>Retrieving market data...</Caption>
          </View>
        ) : null}

        <View style={styles.responseCard}>
          <Caption style={styles.responseLabel}>Mandity AI</Caption>
          <Text style={styles.responseText}>{response || 'Ask about prices, markets, or forecasts.'}</Text>
        </View>

        {audioUri && (
          <Button variant="outline" size="sm" onPress={() => {}} style={{ alignSelf: 'center', marginTop: spacing.md }}>
            <Scroll size={16} color={colors.primary} /> Replay
          </Button>
        )}

        <View style={styles.micContainer}>
          <TouchableOpacity
            style={[styles.micButton, listening && styles.micButtonListening]}
            onPress={handleListen}
            activeOpacity={0.8}
          >
            {listening ? (
              <MicOff size={34} color={colors.error} />
            ) : (
              <Mic size={34} color={colors.white} />
            )}
          </TouchableOpacity>
          <Caption style={styles.micHint}>{listening ? 'Listening...' : 'Tap to speak'}</Caption>
        </View>

        <View style={styles.fallback}>
          <Caption style={styles.fallbackLabel}>Or type your question</Caption>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. What is today's tomato price?"
              placeholderTextColor={colors.secondaryText}
            />
            <Button variant="outline" size="sm" onPress={() => {}} style={{ width: 90 }}>
              <Send size={18} color={colors.primary} /> Send
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  languageRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  languageSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  demoBadge: { alignSelf: 'center', marginBottom: spacing.lg },
  transcriptCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  transcriptLabel: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  transcriptText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  processing: {
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  processingText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  responseCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  responseLabel: {
    color: colors.limeAccent,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontBold,
    marginBottom: spacing.xs,
  },
  responseText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.lg,
  },
  micContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  micButtonListening: {
    backgroundColor: colors.error,
    ...shadows.lg,
  },
  micHint: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  fallback: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  fallbackLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    minHeight: 52,
  },
});
