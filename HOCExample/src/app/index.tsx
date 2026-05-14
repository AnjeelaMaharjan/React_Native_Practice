/**
 * App.tsx — root entry point
 *
 * Simple home screen + manual navigation to each HOC example.
 * No navigation library needed — keeps the project minimal.
 */

import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text,
  TouchableOpacity, StyleSheet,
} from 'react-native';

import Example1Theme  from './screens/Example1_Theme';
import Example2Loader from './screens/Example2_Loader';
import Example3Auth   from './screens/Example3_Auth';

type Screen = 'home' | 'example1' | 'example2' | 'example3';

// ── Home
const HomeScreen: React.FC<{ go: (s: Screen) => void }> = ({ go }) => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>

      <Text style={styles.mainTitle}> React Native HOC</Text>
      <Text style={styles.subtitle}>Higher-Order Components in TypeScript</Text>

      {/* What is a HOC? */}
      <View style={styles.conceptCard}>
        <Text style={styles.conceptTitle}>What is a HOC?</Text>
        <Text style={styles.conceptText}>
          A function that takes a component and returns an ENHANCED component
          with extra logic injected as props.
        </Text>
        <Text style={styles.formula}>{'withFeature(MyComp) → EnhancedComp'}</Text>
      </View>

      <Text style={styles.sectionLabel}>Examples</Text>

      <ExampleButton
        color="#e8d4f8" accent="#6200ee"
        icon="" title="withTheme"
        desc="Inject dark/light theme into any screen"
        onPress={() => go('example1')}
      />
      <ExampleButton
        color="#fff3cd" accent="#ff9800"
        icon="" title="withLoader"
        desc="Show a spinner while data is loading"
        onPress={() => go('example2')}
      />
      <ExampleButton
        color="#d4edda" accent="#28a745"
        icon="" title="withAuth"
        desc="Guard any screen behind a login gate"
        onPress={() => go('example3')}
      />

      {/* Why HOCs? */}
      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}> Why HOCs?</Text>
        <Text style={styles.benefitsText}>
          {'• Reuse logic without copy-pasting\n'}
          {'• Keep components focused & small\n'}
          {'• Compose features with compose()\n'}
          {'• Easy to test in isolation'}
        </Text>
      </View>

    </ScrollView>
  </SafeAreaView>
);

// ── Reusable button ───────────────────────────────────────────────────────────
interface ExampleButtonProps {
  color: string; accent: string;
  icon: string; title: string; desc: string;
  onPress: () => void;
}
const ExampleButton: React.FC<ExampleButtonProps> = ({ color, accent, icon, title, desc, onPress }) => (
  <TouchableOpacity
    style={[styles.exBtn, { backgroundColor: color, borderLeftColor: accent }]}
    onPress={onPress}
  >
    <Text style={styles.exIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.exTitle}>{title}</Text>
      <Text style={styles.exDesc}>{desc}</Text>
    </View>
    <Text style={styles.arrow}>→</Text>
  </TouchableOpacity>
);

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const TITLES: Record<Screen, string> = {
    home:     '',
    example1: ' withTheme',
    example2: ' withLoader',
    example3: ' withAuth',
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Back header for example screens */}
      {screen !== 'home' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{TITLES[screen]}</Text>
          <View style={{ width: 64 }} />
        </View>
      )}

      {screen === 'home'     && <HomeScreen go={setScreen} />}
      {screen === 'example1' && <Example1Theme />}
      {screen === 'example2' && <Example2Loader />}
      {screen === 'example3' && <Example3Auth />}

    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#fff' },
  homeContent:   { paddingHorizontal: 20, paddingVertical: 20 },
  mainTitle:     { fontSize: 30, fontWeight: 'bold', color: '#333', marginBottom: 6, marginTop: 10 },
  subtitle:      { fontSize: 15, color: '#666', marginBottom: 24 },
  conceptCard:   { backgroundColor: '#f5f5f5', padding: 18, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#6200ee' },
  conceptTitle:  { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  conceptText:   { fontSize: 14, color: '#555', lineHeight: 21, marginBottom: 10 },
  formula:       { fontSize: 13, fontFamily: 'Courier New', backgroundColor: '#e0e0e0', padding: 10, borderRadius: 6, color: '#333' },
  sectionLabel:  { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  exBtn:         { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12, borderRadius: 12, borderLeftWidth: 4 },
  exIcon:        { fontSize: 30, marginRight: 14 },
  exTitle:       { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  exDesc:        { fontSize: 13, color: '#666' },
  arrow:         { fontSize: 18, color: '#999' },
  benefitsCard:  { backgroundColor: '#e3f2fd', padding: 18, borderRadius: 12, marginTop: 16, marginBottom: 30 },
  benefitsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1976d2', marginBottom: 10 },
  benefitsText:  { fontSize: 14, color: '#1565c0', lineHeight: 22 },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backBtn:       { paddingVertical: 7, paddingHorizontal: 12, backgroundColor: '#6200ee', borderRadius: 6 },
  backText:      { color: '#fff', fontSize: 14, fontWeight: '600' },
  headerTitle:   { fontSize: 17, fontWeight: 'bold', color: '#333' },
});
