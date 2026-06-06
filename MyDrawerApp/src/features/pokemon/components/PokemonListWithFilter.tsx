import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import usePokemon from '../hooks/usePokemon';

const PokemonListWithFilter: React.FC = () => {
  const { getTypes, selectedType, setSelectedType, filteredPokemon } = usePokemon();

  return (
    <View style={styles.container}>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(value) => setSelectedType(String(value))}
          mode="dropdown"
          style={styles.picker}
        >
          {getTypes().map((t) => (
            <Picker.Item label={t} value={t} key={t} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  pickerWrapper: { borderRadius: 8, overflow: 'hidden', marginBottom: 8, backgroundColor: '#fff' },
  picker: { height: 44 },
  list: { paddingBottom: 24 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  image: { width: 48, height: 48, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  type: { fontSize: 12, color: '#666', marginTop: 2 },
});

export default PokemonListWithFilter;
