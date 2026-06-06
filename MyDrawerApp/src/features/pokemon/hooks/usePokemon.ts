import { useMemo, useState } from 'react';
import { Pokemon, PokemonCategory } from '../types';

// ==========================================
// Pokedex Data Store
// ==========================================
const POKEMON_DATA: Pokemon[] = [
  // Generation 1 Starters
  {
    id: 'bulbasaur',
    name: 'Bulbasaur',
    type: 'Grass · Poison',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/bulbasaur.png',
    description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
    height: '0.7 m',
    weight: '6.9 kg',
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
  },
  {
    id: 'charmander',
    name: 'Charmander',
    type: 'Fire',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/charmander.png',
    description: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.',
    height: '0.6 m',
    weight: '8.5 kg',
    stats: { hp: 39, attack: 52, defense: 43, speed: 65 },
  },
  {
    id: 'squirtle',
    name: 'Squirtle',
    type: 'Water',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/squirtle.png',
    description: 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.',
    height: '0.5 m',
    weight: '9.0 kg',
    stats: { hp: 44, attack: 48, defense: 65, speed: 43 },
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    type: 'Electric',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/pikachu.png',
    description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    height: '0.4 m',
    weight: '6.0 kg',
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
  },
  {
    id: 'arbok',
    name: 'Arbok',
    type: 'Poison',
    image: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/arbok.png',
    description: 'It is said that the ferocious warning markings on its belly differ from area to area.',
    height: '3.5 m',
    weight: '65.0 kg',
    stats: { hp: 60, attack: 95, defense: 69, speed: 80 },
  },
  {
    id: 'seadra',
    name: 'Seadra',
    type: 'Water',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/seadra.png',
    description: 'It can swim in any direction while facing forward by moving its fins and tail.',
    height: '1.2 m',
    weight: '25.0 kg',
    stats: { hp: 55, attack: 65, defense: 95, speed: 85 },
  },
  {
    id: 'vulpix',
    name: 'Vulpix',
    type: 'Fire', // Corrected type from Water to Fire
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/vulpix.png',
    description: 'At the time of its birth, vulpix has only one white tail. If it receives plenty of love, the tail splits into six.',
    height: '0.6 m',
    weight: '9.9 kg',
    stats: { hp: 38, attack: 41, defense: 40, speed: 65 },
  },
  {
    id: 'poliwhirl',
    name: 'Poliwhirl',
    type: 'Water', // Corrected type from Electric to Water
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/poliwhirl.png',
    description: 'It can live in or out of water. When out of water, it constantly sweats to keep its body slimy.',
    height: '1.0 m',
    weight: '20.0 kg',
    stats: { hp: 65, attack: 65, defense: 65, speed: 90 },
  },
  // Early Route
  {
    id: 'pidgey',
    name: 'Pidgey',
    type: 'Normal · Flying',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/pidgey.png',
    description: 'Very docile. If attacked, it will often kick up sand to protect itself rather than fight back.',
    height: '0.3 m',
    weight: '1.8 kg',
    stats: { hp: 40, attack: 45, defense: 40, speed: 56 },
  },
  {
    id: 'rattata',
    name: 'Rattata',
    type: 'Normal',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/rattata.png',
    description: 'Bites anything when it attacks. Small and very quick, it is a common sight in many places.',
    height: '0.3 m',
    weight: '3.5 kg',
    stats: { hp: 30, attack: 56, defense: 35, speed: 72 },
  },
  {
    id: 'butterfree',
    name: 'Butterfree',
    type: 'Bug · Flying',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/butterfree.png',
    description: 'In battle, it flaps its wings at high speed to scatter highly toxic dust into the air.',
    height: '1.1 m',
    weight: '32.0 kg',
    stats: { hp: 60, attack: 45, defense: 50, speed: 70 },
  },
  {
    id: 'beedrill',
    name: 'Beedrill',
    type: 'Bug · Poison',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/beedrill.png',
    description: 'Flies at high speed and attacks using its large venomous stingers on its forelegs and tail.',
    height: '1.0 m',
    weight: '29.5 kg',
    stats: { hp: 65, attack: 90, defense: 40, speed: 75 },
  },
  // Fan Favorites & Ghosts
  {
    id: 'eevee',
    name: 'Eevee',
    type: 'Normal',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/eevee.png',
    description: 'Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.',
    height: '0.3 m',
    weight: '6.5 kg',
    stats: { hp: 55, attack: 55, defense: 50, speed: 55 },
  },
  {
    id: 'jigglypuff',
    name: 'Jigglypuff',
    type: 'Normal · Fairy',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/jigglypuff.png',
    description: 'When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.',
    height: '0.5 m',
    weight: '5.5 kg',
    stats: { hp: 115, attack: 45, defense: 20, speed: 20 },
  },
  {
    id: 'gengar',
    name: 'Gengar',
    type: 'Ghost · Poison',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/gengar.png',
    description: 'Under a full moon, this Pokémon likes to shadow people and frolic in their shadow to scare them.',
    height: '1.5 m',
    weight: '40.5 kg',
    stats: { hp: 60, attack: 65, defense: 60, speed: 110 },
  },
  {
    id: 'haunter',
    name: 'Haunter',
    type: 'Ghost · Poison',
    image: 'https://img.pokemondb.net/sprites/home/normal/1x/haunter.png',
    description: 'Because of its ability to slip through solid walls, it is said to be from another dimension.',
    height: '1.6 m',
    weight: '0.1 kg',
    stats: { hp: 45, attack: 50, defense: 45, speed: 95 },
  },
];

const CATEGORIES: PokemonCategory[] = [
  {
    id: 1,
    title: 'Generation 1 - Starters',
    items: POKEMON_DATA.slice(0, 8),
  },
  {
    id: 2,
    title: 'Early Route Normal & Flying',
    items: POKEMON_DATA.slice(8, 12),
  },
  {
    id: 3,
    title: 'Fan Favorites & Ghosts',
    items: POKEMON_DATA.slice(12, 16),
  },
];

/**
 * Custom Hook: usePokemon.
 * Exposes methods to search, list, and filter Pokedex entities.
 */
export const usePokemon = () => {
  const [selectedType, setSelectedType] = useState<string>('All');

  const getTypes = (): string[] => {
    const splitter = /(?:\s*[·•\/,_]\s*)/; // splits on middle dot, bullet, slash, comma
    const allTypes = POKEMON_DATA.flatMap((p) => p.type.split(splitter).map((t) => t.trim()).filter(Boolean));
    const unique = Array.from(new Set(allTypes)).sort((a, b) => a.localeCompare(b));
    return ['All', ...unique];
  };

  const filteredPokemon = useMemo(() => {
    if (!selectedType || selectedType === 'All') return POKEMON_DATA;
    const splitter = /(?:\s*[·•\/,_]\s*)/;
    return POKEMON_DATA.filter((p) => {
      const types = p.type.split(splitter).map((t) => t.trim().toLowerCase());
      return types.includes(selectedType.toLowerCase());
    });
  }, [selectedType]);
  const getCategories = (): PokemonCategory[] => {
    return CATEGORIES;
  };

  const getPokemonById = (id: string): Pokemon | undefined => {
    return POKEMON_DATA.find((p) => p.id.toLowerCase() === id.toLowerCase() || p.name.toLowerCase() === id.toLowerCase());
  };

  const searchPokemon = (query: string): Pokemon[] => {
    if (!query) return POKEMON_DATA;
    return POKEMON_DATA.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  };

  return {
    getCategories,
    getPokemonById,
    searchPokemon,
    allPokemon: POKEMON_DATA,
    // Type filter helpers for dropdown UI
    getTypes,
    selectedType,
    setSelectedType,
    filteredPokemon,
  };
};
export default usePokemon;
