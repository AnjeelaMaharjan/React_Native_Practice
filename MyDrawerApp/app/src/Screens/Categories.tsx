import { View, Text,Image, ScrollView } from "react-native";
import { withDrawer } from "../components/Drawer/DrawerHOC";
import { SafeAreaView } from "react-native-safe-area-context";
import SafeHeader from "../components/Header/SafeHeader";

interface Category {
  id: number;
  title: string;
  items: { id: string; name: string; image?: string }[];
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Trending",
    items: [
      { id: "a", name: "Trending Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/bulbasaur.png" },
      { id: "b", name: "Trending Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/charmander.png" },
    
    ],
  },
  {
    id: 2,
    title: "New",
    items: [
      { id: "c", name: "New Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/squirtle.png" },
      { id: "d", name: "New Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/pikachu.png" },
    ],
  },
  {
    id: 3,
    title: "Top Rated",
    items: [
      { id: "e", name: "Top Rated Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/eevee.png" },
      { id: "f", name: "Top Rated Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/jigglypuff.png" },
    ],
  },
  {
    id: 4,
    title: "Upcoming",
    items: [
      { id: "g", name: "Upcoming Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/butterfree.png" },
      { id: "h", name: "Upcoming Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/beedrill.png" },
    ],
  },
  {
    id: 5,
    title: "Classics",
    items: [
      { id: "i", name: "Classic Item 1" , image: "https://img.pokemondb.net/sprites/home/normal/1x/pidgey.png" },
      { id: "j", name: "Classic Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/rattata.png" },
    ],
  },
  {
    id: 6,
    title: "Documentaries",
    items: [
      { id: "k", name: "Documentary Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/charizard.png" },
      { id: "l", name: "Documentary Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/blastoise.png" },
    ],
  },
  {
    id: 7,
    title: "Sci-Fi",
    items: [
      { id: "m", name: "Sci-Fi Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/pidgeot.png" },
      { id: "n", name: "Sci-Fi Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/raticate.png" },
    ],
  },
  {
    id: 8,
    title: "Horror",
    items: [
      { id: "o", name: "Horror Item 1", image: "https://img.pokemondb.net/sprites/home/normal/1x/gengar.png" },
      { id: "p", name: "Horror Item 2", image: "https://img.pokemondb.net/sprites/home/normal/1x/haunter.png" },
    ],
  }
]; // This is a sample data structure for categories and their items. You can replace it with your actual data source.

const CategoryScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }} edges={["right"]}>
      <SafeHeader title="Categories" showDrawerButton={true} />

      <ScrollView>
        {/*Child render: Renders the horizontal list of items for each category*/}
        {CATEGORIES.map((category) => (
          <View key={category.id} style={{ marginBottom: 20 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              {category.title}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {category.items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: 120,
                    height: 180,
                    backgroundColor: "#ccc",
                    marginRight: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 100, height: 100, marginBottom: 10 }}
                    resizeMode="cover"
                  />
                  <Text>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default withDrawer(CategoryScreen);
