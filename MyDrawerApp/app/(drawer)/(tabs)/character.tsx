// GraphQLExample.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ApolloProvider, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

import { client } from "@/graphql/client";
import { useDb } from "@/db/database";
import { items } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";

// Types
interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface CharactersInfo {
  next: number | null;
  count: number;
}

interface GetCharactersData {
  characters: {
    info: CharactersInfo;
    results: Character[];
  };
}

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        next
        count
      }
      results {
        id
        name
        status
        species
        gender
        image
      }
    }
  }
`;

const CharacterList = () => {
  const db = useDb();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);

  // 1. Live query all saved items from the SQLite database
  const liveQueryResult = useLiveQuery(db.select().from(items));
  const savedItems = liveQueryResult && typeof liveQueryResult === 'object' && 'data' in liveQueryResult 
    ? (liveQueryResult as any).data 
    : liveQueryResult;

  // 2. Log saved data to the console whenever it changes
  useEffect(() => {
    console.log("----------------------------------------");
    console.log("Current saved items in SQLite DB:");
    console.log(JSON.stringify(savedItems, null, 2));
    console.log("----------------------------------------");
  }, [savedItems]);

  const { loading, error, data, refetch } =
    useQuery<GetCharactersData>(GET_CHARACTERS, {
      variables: {
        page: 1,
        filter: { name: "" },
      },
      notifyOnNetworkStatusChange: true,
    });

  // Update characters when data changes
  useEffect(() => {
    if (data?.characters?.results) {
      if (page === 1) {
        setAllCharacters(data.characters.results);
      } else {
        setAllCharacters((prev) => [...prev, ...data.characters.results]);
      }
    }
  }, [data, page]);

  const handleSearch = () => {
    setPage(1);
    refetch({
      page: 1,
      filter: { name: searchText.trim() },
    });
  };

  const loadMore = () => {
    if (!data?.characters?.info?.next || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    refetch({
      page: nextPage,
      filter: { name: searchText.trim() },
    });
  };

  // 3. Save character to database handler
  const handleDownload = async (character: Character) => {
    try {
      await db.insert(items).values({
        id: character.id,
        title: character.name,
        description: `${character.species} (${character.status})`,
        updatedAt: new Date(),
        syncedAt: new Date(),
      }).onConflictDoUpdate({
        target: items.id,
        set: {
          title: character.name,
          description: `${character.species} (${character.status})`,
          updatedAt: new Date(),
        }
      });
      console.log(`[Database] Saved character: ${character.name} (ID: ${character.id})`);
    } catch (err: any) {
      console.error("Failed to save character:", err);
      Alert.alert("Error", "Could not save character offline.");
    }
  };

  // 4. Remove character from database handler
  const handleRemove = async (id: string) => {
    try {
      await db.delete(items).where(eq(items.id, id));
      console.log(`[Database] Removed character ID: ${id}`);
    } catch (err: any) {
      console.error("Failed to delete character:", err);
      Alert.alert("Error", "Could not delete character.");
    }
  };

  if (error) {
    Alert.alert("Error", error.message);
    return <Text style={styles.error}>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={allCharacters}
        keyExtractor={(item) => item.id}
        className="ricky card"
        renderItem={({ item }) => {
          const isSaved = savedItems?.some((saved: any) => String(saved.id) === String(item.id));
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Species: {item.species}</Text>
              <Text>Gender: {item.gender}</Text>
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  isSaved ? styles.removeButton : styles.saveButton,
                ]}
                onPress={() => (isSaved ? handleRemove(item.id) : handleDownload(item))}
              >
                <Text style={styles.downloadButtonText}>
                  {isSaved ? "Remove Offline" : "Download"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#00bfff"
              style={{ margin: 20 }}
            />
          ) : data?.characters?.info?.next ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ textAlign: "center", padding: 20, color: "#666" }}>
              No more characters
            </Text>
          )
        }
      />
    </View>
  );
};

const GraphQLExample = () => {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Text style={styles.title}>Rick and Morty Characters</Text>
        <CharacterList />
      </View>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: { flexDirection: "row", marginBottom: 12 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: "#00bfff",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: { color: "white", fontWeight: "bold" },
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  image: { width: 140, height: 140, borderRadius: 70, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  loadMoreButton: {
    backgroundColor: "#00bfff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  loadMoreText: { color: "white", fontWeight: "bold", fontSize: 16 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  downloadButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  saveButton: {
    backgroundColor: "#00bfff",
  },
  removeButton: {
    backgroundColor: "#ff4d4f",
  },
  downloadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default GraphQLExample;
