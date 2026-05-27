import React from 'react';
import { View, StyleSheet, SectionList, Text } from 'react-native';
import { Header } from '@/components/organisms/Header';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

const NEPAL_DATA = [
  {
    title: 'Pradesh 1 (Koshi)',
    data: ['Biratnagar', 'Itahari', 'Dharan'],
  },
  {
    title: 'Pradesh 3 (Bagmati)',
    data: ['Kathmandu', 'Lalitpur', 'Bhaktapur'],
  },
];

/**
 * Screen: System Settings.
 * Displays configuration card and renders Nepal Pradesh location directories inside SectionList.
 */
export const SettingsScreen = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="System Settings" />

      {/* Header Info Block */}
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>App Settings</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Configure your development workspace options here.
          </Text>
        </View>

        {/* Section List Section */}
        <View style={[styles.card, styles.scrollableCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.listHeaderTitle, { color: colors.text }]}>SectionList Example</Text>
          
          <SectionList
            sections={NEPAL_DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.listItemText, { color: colors.textSecondary }]}>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={[styles.sectionHeader, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#1E293B' }]}>{title}</Text>
              </View>
            )}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No Items Found</Text>
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  scrollableCard: {
    flex: 1,
    paddingBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 0.5,
  },
  listItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    padding: SPACING.md,
    textAlign: 'center',
    fontSize: 13,
  },
});

export default SettingsScreen;
