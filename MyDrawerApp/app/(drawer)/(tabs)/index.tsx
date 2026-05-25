import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePokemon } from '@/features/pokemon/hooks/usePokemon';
import { Pokemon, PokemonCategory } from '@/features/pokemon/types';
import Header from '@/components/organisms/Header';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

/**
 * Screen: Pokedex Tracker (Home).
 * Displays nested categories of Pokemon with toggleable list/card rendering modes.
 */
export const PokedexScreen = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { getCategories } = usePokemon();
  
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const categories = getCategories();

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleNavigateToDetails = (pokemonId: string) => {
    // Navigate via Expo Router dynamic routing parameters
    router.push({
      pathname: '/pokemon/[id]' as any,
      params: { id: pokemonId },
    });
  };

  // Card view item
  const renderPokemonCard = (item: Pokemon) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
        onPress={() => handleNavigateToDetails(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.imageWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
        </View>
        <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.cardType, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.type}
        </Text>
      </TouchableOpacity>
    );
  };

  // List view item
  const renderPokemonListItem = (item: Pokemon) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.listItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        onPress={() => handleNavigateToDetails(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.listImage} resizeMode="contain" />
        <View style={styles.listDetails}>
          <Text style={[styles.listName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.listType, { color: colors.textSecondary }]}>{item.type}</Text>
        </View>
        <Image
          source={{ uri: 'https://img.icons8.com/ios-glyphs/30/arrow.png' }}
          style={[styles.chevron, { tintColor: colors.primary, width: 16, height: 16 }]}
        />
      </TouchableOpacity>
    );
  };

  // Rendering a Category Row containing nested ScrollView
  const renderCategoryRow = ({ item }: { item: PokemonCategory }) => {
    return (
      <View style={[styles.categorySection, { borderBottomColor: colors.border }]}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>{item.title}</Text>
        
        {viewMode === 'card' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {item.items.map(renderPokemonCard)}
          </ScrollView>
        ) : (
          <View style={styles.verticalListContent}>
            {item.items.map(renderPokemonListItem)}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Pokédex Tracker" />

      {/* Control panel for grid list configurations */}
      <View style={[styles.controlBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.modeStatusText, { color: colors.textSecondary }]}>
          Layout: <Text style={{ color: colors.primary, fontWeight: '700' }}>{viewMode.toUpperCase()}</Text>
        </Text>
        <TouchableOpacity
          style={[styles.toggleBtn, { borderColor: colors.primary }]}
          onPress={() => setViewMode((prev) => (prev === 'card' ? 'list' : 'card'))}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleBtnText, { color: colors.primary }]}>
            Toggle to {viewMode === 'card' ? 'List' : 'Grid'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Scroll Layout */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryRow}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  modeStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleBtn: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 40,
  },
  categorySection: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
  },
  horizontalScrollContent: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    gap: SPACING.md,
  },
  verticalListContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  card: {
    width: 140,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    width: '100%',
    height: 110,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardImage: {
    width: 90,
    height: 90,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardType: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderBottomWidth: 0.5,
  },
  listImage: {
    width: 50,
    height: 50,
    marginRight: SPACING.md,
  },
  listDetails: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: '700',
  },
  listType: {
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    opacity: 0.5,
  },
});

export default PokedexScreen;
