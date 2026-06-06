import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { usePokemon } from '@/features/pokemon/hooks/usePokemon';
import { Pokemon, PokemonCategory } from '@/features/pokemon/types';
import { Header } from '@/components/organisms/Header';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';
import { Picker } from '@react-native-picker/picker';

export const PokedexScreen = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { getCategories, getTypes, selectedType, setSelectedType, filteredPokemon } = usePokemon();

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const categories = getCategories();
  
  // Filter categories to show only pokemon matching the selected type
  const filteredCategories = useMemo(() => {
    if (selectedType === 'All') return categories;
    
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((pokemon) => filteredPokemon.some((p) => p.id === pokemon.id)),
      }))
      .filter((cat) => cat.items.length > 0); // Hide empty categories
  }, [categories, selectedType, filteredPokemon]);

  

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
            style={styles.cardScrollContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.cardGrid}>
              {item.items.map(renderPokemonCard)}
            </View>
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

      {/* Control panel with type filter dropdown */}
      <View style={[styles.controlBar, { borderBottomColor: colors.border }]}>
        <View style={[styles.pickerWrapper, { backgroundColor: colors.card }]}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(value) => setSelectedType(String(value))}
            mode="dropdown"
            style={[styles.picker, { color: colors.text }]}
          >
            {getTypes().map((t) => (
              <Picker.Item label={t} value={t} key={t} />
            ))}
          </Picker>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.toggleBtn, { borderColor: colors.primary }]}
          onPress={() => setViewMode((prev) => (prev === 'card' ? 'list' : 'card'))}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleBtnText, { color: colors.primary }]}>
            {viewMode === 'card' ? 'List' : 'Grid'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Scroll Layout - Filtered */}
      {filteredCategories.length > 0 ? (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryRow}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
        />
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No Pokemon found for type: {selectedType}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ===== Root Container =====
  container: {
    flex: 1,
  },

  // ===== Control Bar & Filter =====
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  pickerWrapper: {
    flex: 1.5,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  picker: {
    height: 44,
    width: '10%',
  },
  spacer: {
    flex: 0.3,
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

  // ===== List Container =====
  listContainer: {
    paddingBottom: 40,
  },

  // ===== Category Section =====
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

  // ===== Card View =====
  cardScrollContainer: {
    maxHeight: 280,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  card: {
    width: '47.5%',
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

  // ===== List View =====
  verticalListContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
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

  // ===== Empty State =====
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default PokedexScreen;
