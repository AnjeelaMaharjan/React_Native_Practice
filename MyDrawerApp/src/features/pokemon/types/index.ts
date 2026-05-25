export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Pokemon {
  id: string;
  name: string;
  type: string;
  image: string;
  description?: string;
  height?: string;
  weight?: string;
  stats?: PokemonStats;
}

export interface PokemonCategory {
  id: number;
  title: string;
  items: Pokemon[];
}

export type RootStackParamList = {
  Home: undefined;
  PokemonDetail: { id: string };
};
