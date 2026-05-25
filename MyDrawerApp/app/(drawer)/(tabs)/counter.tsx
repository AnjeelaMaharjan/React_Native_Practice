import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCounter } from '@/features/counter/hooks/useCounter';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/organisms/Header';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

/**
 * Screen: Counter Application.
 * Consumes state from global CounterProvider and logs actions directly in dev log window.
 */
export const CounterScreen = () => {
  const { count, message, lastAction, timestamp, increment, decrement, reset } = useCounter();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Counter App" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Core Presentation Panel */}
        <View style={[styles.displayCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.displayTitle, { color: colors.text }]}>Centralized State Counter</Text>
          
          {/* Active number bubble */}
          <View style={[styles.counterBubble, { backgroundColor: colors.primary }]}>
            <Text style={styles.counterText}>{count}</Text>
          </View>

          {/* Inline Action Indicator */}
          <View style={[styles.statusBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: colors.border }]}>
            <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>{message}</Text>
          </View>

          {/* Operation Controls */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnDanger, { borderRadius: BORDER_RADIUS.md }]}
              onPress={decrement}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>- Decrement</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSuccess, { borderRadius: BORDER_RADIUS.md }]}
              onPress={increment}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>+ Increment</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btnReset, { borderColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
            onPress={reset}
            activeOpacity={0.7}
          >
            <Text style={[styles.resetText, { color: colors.primary }]}>Reset Counter</Text>
          </TouchableOpacity>
        </View>

        {/* State Transition Logs (Requirement: Create Context with clean state logs) */}
        <View style={[styles.logCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.logTitle, { color: colors.text }]}>State Transition Auditor</Text>
          <Text style={styles.logDesc}>Tracks state updates triggered from the central Reducer dispatcher in real-time.</Text>
          
          <View style={[styles.logRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.logLabel, { color: colors.textSecondary }]}>Last Dispatched:</Text>
            <Text style={[styles.logValue, { color: colors.primary }]}>{lastAction}</Text>
          </View>
          
          <View style={[styles.logRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.logLabel, { color: colors.textSecondary }]}>Dispatched At:</Text>
            <Text style={[styles.logValue, { color: colors.text }]}>{timestamp}</Text>
          </View>
          
          <View style={styles.logRow}>
            <Text style={[styles.logLabel, { color: colors.textSecondary }]}>Reducer Integrity:</Text>
            <Text style={[styles.logValue, { color: '#10B981', fontWeight: '700' }]}>ONLINE</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  displayCard: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  displayTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  counterBubble: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  counterText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -1,
  },
  statusBox: {
    width: '100%',
    padding: SPACING.md,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusMessage: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
    marginBottom: SPACING.sm,
  },
  btn: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  btnSuccess: {
    backgroundColor: '#10B981',
  },
  btnDanger: {
    backgroundColor: '#EF4444',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  btnReset: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginTop: SPACING.sm,
  },
  resetText: {
    fontWeight: '700',
    fontSize: 15,
  },
  logCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  logDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
  },
  logLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  logValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CounterScreen;
