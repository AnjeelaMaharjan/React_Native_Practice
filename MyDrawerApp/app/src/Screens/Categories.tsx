import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { withDrawer } from "../components/Drawer/DrawerHOC";
import { SafeAreaView } from "react-native-safe-area-context";
import SafeHeader from "../components/Header/SafeHeader";
import {Categoriesstyles, Categoriesstyles as styles} from "../styles/style";

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

// Updated data matching pokemondb.net stats and types
const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Generation 1 - Starters",
    items: [
      { id: "0001", name: "Bulbasaur", type: "Grass · Poison", image: "https://img.pokemondb.net/sprites/home/normal/1x/bulbasaur.png" },
      { id: "0004", name: "Charmander", type: "Fire", image: "https://img.pokemondb.net/sprites/home/normal/1x/charmander.png" },
      { id: "0007", name: "Squirtle", type: "Water", image: "https://img.pokemondb.net/sprites/home/normal/1x/squirtle.png" },
      { id: "0025", name: "Pikachu", type: "Electric", image: "https://img.pokemondb.net/sprites/home/normal/1x/pikachu.png" },
    ],
  },
  {
    id: 2,
    title: "Early Route Normal & Flying",
    items: [
      { id: "0016", name: "Pidgey", type: "Normal · Flying", image: "https://img.pokemondb.net/sprites/home/normal/1x/pidgey.png" },
      { id: "0019", name: "Rattata", type: "Normal", image: "https://img.pokemondb.net/sprites/home/normal/1x/rattata.png" },
      { id: "0012", name: "Butterfree", type: "Bug · Flying", image: "https://img.pokemondb.net/sprites/home/normal/1x/butterfree.png" },
      { id: "0015", name: "Beedrill", type: "Bug · Poison", image: "https://img.pokemondb.net/sprites/home/normal/1x/beedrill.png" },
    ],
  },
  {
    id: 3,
    title: "Fan Favorites & Ghosts",
    items: [
      { id: "0133", name: "Eevee", type: "Normal", image: "https://img.pokemondb.net/sprites/home/normal/1x/eevee.png" },
      { id: "0039", name: "Jigglypuff", type: "Normal · Fairy", image: "https://img.pokemondb.net/sprites/home/normal/1x/jigglypuff.png" },
      { id: "0094", name: "Gengar", type: "Ghost · Poison", image: "https://img.pokemondb.net/sprites/home/normal/1x/gengar.png" },
      { id: "0093", name: "Haunter", type: "Ghost · Poison", image: "https://img.pokemondb.net/sprites/home/normal/1x/haunter.png" },
    ],
  },
];

const CategoryScreen: React.FC = () => {
  // 'card' or 'list' layout maintain garna state
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Inside horizontal rows (Card vs List item switcher)
  const renderHorizontalItem = ({ item }: { item: Item }) => {
    if (viewMode === "card") {
      // 1. CARD VIEW LAYOUT
      return (
        <View style={Categoriesstyles.card}>
          <View style={Categoriesstyles.imageContainer}>
            {item.image && (
              <Image source={{ uri: item.image }} style={Categoriesstyles.pokemonImage} resizeMode="contain" />
            )}
          </View>
          <View style={Categoriesstyles.cardFooter}>
            <Text numberOfLines={1} style={Categoriesstyles.itemName}>{item.name}</Text>
            <Text style={Categoriesstyles.itemType}>{item.type}</Text>
          </View>
        </View>
      );
    } else {
      // 2. LIST VIEW LAYOUT
      return (
        <View style={Categoriesstyles.listItem}>
          {item.image && (
            <Image source={{ uri: item.image }} style={Categoriesstyles.listImage} resizeMode="contain" />
          )}
          <View style={Categoriesstyles.listTextContainer}>
            <Text style={Categoriesstyles.listNameText}>{item.name}</Text>
            <Text style={Categoriesstyles.listTypeText}>#{item.id} • {item.type}</Text>
          </View>
        </View>
      );
    }
  };

  // Outer Vertical Structure
  const renderCategoryRow = ({ item: category }: { item: Category }) => (
    <View style={Categoriesstyles.categoryContainer}>
      <Text style={Categoriesstyles.categoryTitle}>{category.title}</Text>
      <FlatList
        data={category.items}
        renderItem={renderHorizontalItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={viewMode === "card"} // Card huda side-scroll, list huda vertical grid type scroll block
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={viewMode === "card" ? Categoriesstyles.horizontalPadding : Categoriesstyles.listContainerPadding}
      />
    </View>
  );

  return (
    <SafeAreaView style={Categoriesstyles.container} edges={["right", "left", "bottom"]}>
      <SafeHeader title="Pokédex Tracker" showDrawerButton={true} />

      {/* Toggle View Controller Button */}
      <View style={Categoriesstyles.toggleRow}>
        <Text style={Categoriesstyles.viewStateText}>
          Current View: <Text style={{ fontWeight: "bold", color: "#e74c3c" }}>{viewMode.toUpperCase()}</Text>
        </Text>
        <TouchableOpacity
          style={Categoriesstyles.toggleButton}
          onPress={() => setViewMode(viewMode === "card" ? "list" : "card")}
        >
          <Text style={Categoriesstyles.toggleButtonText}>
            Switch to {viewMode === "card" ? "List View" : "Card View"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Outer List view container */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryRow}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={Categoriesstyles.verticalListPadding}
      />
    </SafeAreaView>
  );
};

export default withDrawer(CategoryScreen);