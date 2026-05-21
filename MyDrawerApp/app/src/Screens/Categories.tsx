import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Categorystyles as styles} from "../styles/style";
import SafeHeader from "../components/Header/SafeHeader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import withDrawer from "../components/Drawer/DrawerHOC";

interface Item {
  id: string;
  name: string;
  image?: string;
  type: string;
}

interface Category {
  id: number;
  title: string;
  items: Item[];
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Generation 1 - Starters",
    items: [
      {
        id: "0001-a",
        name: "Bulbasaur",
        type: "Grass · Poison",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/bulbasaur.png",
      },
      {
        id: "0004-a",
        name: "Charmander",
        type: "Fire",
        image:
          "https://img.pokemondb.net/sprites/home/normal/1x/charmander.png",
      },
      {
        id: "0007-a",
        name: "Squirtle",
        type: "Water",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/squirtle.png",
      },
      {
        id: "0025-a",
        name: "Pikachu",
        type: "Electric",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/pikachu.png",
      },
      {
        id: "0024-b",
        name: "Arbok",
        type: "Poison",
        image: "https://img.pokemondb.net/sprites/scarlet-violet/normal/arbok.png",
      },
      {
        id: "0017-b",
        name: "Seadra",
        type: "Water",
        image:
          "https://img.pokemondb.net/sprites/home/normal/1x/seadra.png",
      },
      {
        id: "0007-b",
        name: "Squirtle (Dup)",
        type: "Water",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/squirtle.png",
      },
      {
        id: "0025-b",
        name: "Pikachu (Dup)",
        type: "Electric",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/pikachu.png",
      },
    ],
  },
  {
    id: 2,
    title: "Early Route Normal & Flying",
    items: [
      {
        id: "0016",
        name: "Pidgey",
        type: "Normal · Flying",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/pidgey.png",
      },
      {
        id: "0019",
        name: "Rattata",
        type: "Normal",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/rattata.png",
      },
      {
        id: "0012",
        name: "Butterfree",
        type: "Bug · Flying",
        image:
          "https://img.pokemondb.net/sprites/home/normal/1x/butterfree.png",
      },
      {
        id: "0015",
        name: "Beedrill",
        type: "Bug · Poison",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/beedrill.png",
      },
    ],
  },
  {
    id: 3,
    title: "Fan Favorites & Ghosts",
    items: [
      {
        id: "0133",
        name: "Eevee",
        type: "Normal",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/eevee.png",
      },
      {
        id: "0039",
        name: "Jigglypuff",
        type: "Normal · Fairy",
        image:
          "https://img.pokemondb.net/sprites/home/normal/1x/jigglypuff.png",
      },
      {
        id: "0094",
        name: "Gengar",
        type: "Ghost · Poison",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/gengar.png",
      },
      {
        id: "0093",
        name: "Haunter",
        type: "Ghost · Poison",
        image: "https://img.pokemondb.net/sprites/home/normal/1x/haunter.png",
      },
    ],
  },
];

export const CategoryScreen = () => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderPokemonCard = (item: Item) => {
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.type}>{item.type}</Text>
      </View>
    );
  };

  const renderPokemonList = (item: Item) => {
    return (
      <View key={item.id} style={styles.listItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.listImage}
          resizeMode="contain"
        />

        <View>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listType}>{item.type}</Text>
        </View>
      </View>
    );
  };

  const renderCategory = ({ item }: { item: Category }) => {
    return (
      <View style={styles.categoryCard}>
        <Text style={styles.categoryTitle}>{item.title}</Text>

        {/* Card bhitra vertical scroll */}
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={styles.innerScroll}
        >
          {viewMode === "card" ? (
            <View style={styles.flexContainer}>
              {item.items.map(renderPokemonCard)}
            </View>
          ) : (
            <View>{item.items.map(renderPokemonList)}</View>
          )}
        </ScrollView>
      </View>
    );
  };
  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex Tracker</Text>  
           

      </View> <SafeHeader title="Pokédex Tracker" showDrawerButton={true} />
      <View style={styles.toggleRow}>
        <Text style={styles.currentView}>
          Current View: {viewMode.toUpperCase()}
        </Text>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setViewMode(viewMode === "card" ? "list" : "card")}
        >
          <Text style={styles.toggleButtonText}>
            Switch to {viewMode === "card" ? "List" : "Card"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff4757"]}
          />
        }
      />
    </SafeAreaView>
  );
};

export default withDrawer(CategoryScreen);


