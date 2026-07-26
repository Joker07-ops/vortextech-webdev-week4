const BASE = "https://pokeapi.co/api/v2";

export interface PokemonListItem {
  id: number;
  name: string;
}

export interface LocalPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { name: string }[];
  abilities: { name: string; hidden: boolean }[];
  stats: { name: string; value: number }[];
}

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

let _listCache: PokemonListItem[] | null = null;

export async function getAllPokemon(): Promise<PokemonListItem[]> {
  if (_listCache) return _listCache;
  const res = await fetch(`${BASE}/pokemon?limit=1025&offset=0`);
  if (!res.ok) throw new Error(`Failed to fetch Pokemon list: ${res.status}`);
  const data = await res.json();
  const list: PokemonListItem[] = data.results.map(
    (p: { name: string; url: string }) => ({
      id: extractIdFromUrl(p.url),
      name: p.name,
    }),
  );
  _listCache = list;
  return list;
}

const _detailCache = new Map<string, LocalPokemon>();

export async function getPokemonByName(
  name: string,
): Promise<LocalPokemon | undefined> {
  const cached = _detailCache.get(name);
  if (cached) return cached;

  const res = await fetch(`${BASE}/pokemon/${encodeURIComponent(name)}`);
  if (!res.ok) return undefined;

  const data = await res.json();
  const pokemon: LocalPokemon = {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    base_experience: data.base_experience,
    types: data.types.map((t: { type: { name: string } }) => ({
      name: t.type.name,
    })),
    abilities: data.abilities.map(
      (a: { ability: { name: string }; is_hidden: boolean }) => ({
        name: a.ability.name,
        hidden: a.is_hidden,
      }),
    ),
    stats: data.stats.map(
      (s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name,
        value: s.base_stat,
      }),
    ),
  };

  _detailCache.set(name, pokemon);
  return pokemon;
}

export async function getPokemonById(
  id: number,
): Promise<LocalPokemon | undefined> {
  const res = await fetch(`${BASE}/pokemon/${id}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  return getPokemonByName(data.name);
}

export async function searchPokemon(
  query: string,
): Promise<PokemonListItem[]> {
  const all = await getAllPokemon();
  const q = query.toLowerCase().trim();
  if (!q) return all;
  return all.filter((p) => p.name.includes(q));
}

let _nameToIdMap: Record<string, number> | null = null;

export async function getNameToIdMap(): Promise<Record<string, number>> {
  if (_nameToIdMap) return _nameToIdMap;
  const all = await getAllPokemon();
  _nameToIdMap = {};
  for (const p of all) {
    _nameToIdMap[p.name] = p.id;
  }
  return _nameToIdMap;
}
