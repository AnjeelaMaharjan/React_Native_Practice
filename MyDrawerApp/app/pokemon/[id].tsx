import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { usePokemon } from '@/features/pokemon/hooks/usePokemon';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

/**
 * Page: PokemonDetailScreen.
 * Dynamic route: /pokemon/[id]
 * Renders full profile analysis for selected Pokemon.
 */
export const PokemonDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { getPokemonById } = usePokemon();

  const pokemon = getPokemonById(id || '');

  // Render error card if pokemon not found
  if (!pokemon) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={colors.primary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Pokémon Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            We couldnot resolve details for ID: {"{id}"}
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Return to Pokedex</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Define type-specific badge background colors
  const getTypeColor = (type: string) => {
    const mainType = type.split('·')[0].trim().toLowerCase();
    switch (mainType) {
      case 'grass': return '#10B981';
      case 'fire': return '#EF4444';
      case 'water': return '#3B82F6';
      case 'electric': return '#F59E0B';
      case 'poison': return '#8B5CF6';
      case 'normal': return '#6B7280';
      case 'bug': return '#10B981';
      case 'ghost': return '#4F46E5';
      default: return colors.primary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-circle" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pokémon Profile</Text>
        <View style={{ width: 40 }} /> {/* balance center */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          
          {/* Sprite image container */}
          <View style={[styles.imageContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
            <Image
              source={{ uri: pokemon.image }}
              style={styles.sprite}
              resizeMode="contain"
            />
          </View>

          {/* Name & Type badges */}
          <Text style={[styles.pokemonName, { color: colors.text }]}>{pokemon.name}</Text>
          
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(pokemon.type) }]}>
            <Text style={styles.typeText}>{pokemon.type.toUpperCase()}</Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {pokemon.description}
          </Text>

          {/* Attributes Row */}
          <View style={[styles.statsDivider, { borderColor: colors.border }]} />
          
          <View style={styles.attrRow}>
            <View style={styles.attrCol}>
              <Text style={styles.attrVal}>{pokemon.height || 'N/A'}</Text>
              <Text style={[styles.attrLabel, { color: colors.textSecondary }]}>Height</Text>
            </View>
            <View style={[styles.attrDivider, { backgroundColor: colors.border }]} />
            <View style={styles.attrCol}>
              <Text style={styles.attrVal}>{pokemon.weight || 'N/A'}</Text>
              <Text style={[styles.attrLabel, { color: colors.textSecondary }]}>Weight</Text>
            </View>
          </View>
          
          <View style={[styles.statsDivider, { borderColor: colors.border }]} />

          {/* Base Stats Meters */}
          {pokemon.stats && (
            <View style={styles.statsSection}>
              <Text style={[styles.statsTitle, { color: colors.text }]}>Base Statistics</Text>
              
              {Object.entries(pokemon.stats).map(([statName, value]) => {
                const percent = Math.min((value / 150) * 100, 100);
                return (
                  <View key={statName} style={styles.statMeterRow}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {statName.toUpperCase()}
                    </Text>
                    <View style={styles.statBarWrapper}>
                      <View style={[styles.statBarBg, { backgroundColor: colors.border }]}>
                        <View
                          style={[
                            styles.statBarFill,
                            {
                              width: `${percent}%`,
                              backgroundColor: getTypeColor(pokemon.type),
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.statValueText, { color: colors.text }]}>{value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  imageContainer: {
    width: 220,
    height: 220,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sprite: {
    width: 180,
    height: 180,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  typeBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  typeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statsDivider: {
    width: '100%',
    borderBottomWidth: 1,
    marginVertical: SPACING.md,
  },
  attrRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  attrCol: {
    alignItems: 'center',
  },
  attrVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
  },
  attrLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  attrDivider: {
    width: 1,
    height: 30,
  },
  statsSection: {
    width: '100%',
    gap: SPACING.sm,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  statMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 70,
  },
  statBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValueText: {
    fontSize: 13,
    fontWeight: '700',
    width: 30,
    textAlign: 'right',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  errorSubtitle: {
    fontSize: 14,
    marginTop: SPACING.xs,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default PokemonDetailScreen;
