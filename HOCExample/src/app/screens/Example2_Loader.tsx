/**
 * Screen: Example2_Loader
 *
 * Demonstrates withLoader HOC.
 *
 * Pattern:
 *   1. Create the pure display component (LoaderContent).
 *   2. Wrap it with withLoader → EnhancedContent.
 *   3. A Wrapper component manages state and passes isLoading down.
 *
 * The display component never has to think about loading states.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import withLoader from '../hocs/withLoader';

// ── Data shape ────────────────────────────────────────────────────────────────
interface Course {
  id:          number;
  title:       string;
  description: string;
}

// ── 1. Pure display component ─────────────────────────────────────────────────
// It only knows how to render a list. No loading logic here.
interface ContentProps {
  data: Course[];
}

const LoaderContent: React.FC<ContentProps> = ({ data }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}> Course List</Text>
    <Text style={styles.subtitle}>{data.length} items loaded</Text>

    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </View>
      )}
    />

    <View style={styles.infoBox}>
      <Text style={styles.infoText}>
        withLoader intercepted the isLoading prop.
        While it was true, a spinner appeared instead of this list.
        Now that it is false, you see the content.
      </Text>
    </View>
  </ScrollView>
);

// ── 2. Wrap with HOC ──────────────────────────────────────────────────────────
// EnhancedContent accepts `isLoading` on top of ContentProps.
// When isLoading=true → spinner. When false → <LoaderContent data={...} />
const EnhancedContent = withLoader(LoaderContent);

// ── 3. Wrapper that drives state ──────────────────────────────────────────────
const LoaderScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData]           = useState<Course[]>([]);

  const fetchData = (): void => {
    setIsLoading(true);

    // Simulate a 2-second network call
    setTimeout(() => {
      setData([
        { id: 1, title: 'React Basics',   description: 'Learn React fundamentals' },
        { id: 2, title: 'React Native',   description: 'Build mobile apps' },
        { id: 3, title: 'HOC Pattern',    description: 'Reuse component logic' },
        { id: 4, title: 'Custom Hooks',   description: 'Modern state management' },
        { id: 5, title: 'Context API',    description: 'Global state management' },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  // Load on mount
  useEffect(() => { fetchData(); }, []);

  return (
    <View style={styles.wrapper}>
      {/* isLoading controls whether spinner or content is shown */}
      <EnhancedContent isLoading={isLoading} data={data} />

      <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.refreshButtonText}> Reload (watch the spinner)</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoaderScreen;

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper:           { flex: 1 },
  container:         { flex: 1, padding: 20, backgroundColor: '#fff' },
  title:             { fontSize: 26, fontWeight: 'bold', marginTop: 16, marginBottom: 6 },
  subtitle:          { fontSize: 15, color: '#666', marginBottom: 20 },
  card:              { backgroundColor: '#f5f5f5', padding: 14, marginBottom: 10, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#6200ee' },
  cardTitle:         { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardDesc:          { fontSize: 13, color: '#666' },
  infoBox:           { backgroundColor: '#e3f2fd', padding: 14, borderRadius: 8, marginVertical: 20 },
  infoText:          { fontSize: 13, color: '#1976d2', lineHeight: 20 },
  refreshButton:     { margin: 20, paddingVertical: 14, backgroundColor: '#6200ee', borderRadius: 8, alignItems: 'center' },
  refreshButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
