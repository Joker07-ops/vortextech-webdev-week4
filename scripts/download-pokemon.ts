import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const API = "https://pokeapi.co/api/v2";
const SPRITES_DIR = join(import.meta.dirname, "..", "public", "sprites");
const DATA_DIR = join(import.meta.dirname, "..", "src", "data");

interface PokemonListEntry {
  name: string;
  url: string;
}

interface PokemonStat {
  stat: { name: string };
  base_stat: number;
}

interface PokemonType {
  type: { name: string };
}

interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { name: string }[];
  abilities: { name: string; hidden: boolean }[];
  stats: { name: string; value: number }[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<T>;
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  if (existsSync(filepath)) return;
  const res = await fetch(url);
  if (!res.ok) return;
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filepath, buffer);
}

async function main() {
  console.log("Fetching Pokemon list...");
  const list = await fetchJSON<{ results: PokemonListEntry[] }>(
    `${API}/pokemon?limit=1025`,
  );
  const total = list.results.length;
  console.log(`Found ${total} Pokemon.`);

  mkdirSync(SPRITES_DIR, { recursive: true });
  mkdirSync(DATA_DIR, { recursive: true });

  const allPokemon: PokemonData[] = [];
  const BATCH = 20;

  for (let i = 0; i < total; i += BATCH) {
    const batch = list.results.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(total / BATCH);
    console.log(`Batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + BATCH, total)})...`);

    await Promise.all(
      batch.map(async (entry, idx) => {
        const id = i + idx + 1;
        try {
          const detail = await fetchJSON<{
            id: number;
            name: string;
            height: number;
            weight: number;
            base_experience: number | null;
            types: PokemonType[];
            abilities: PokemonAbility[];
            stats: PokemonStat[];
          }>(`${API}/pokemon/${id}`);

          const spritePath = join(SPRITES_DIR, `${id}.png`);
          const spriteUrl =
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          await downloadImage(spriteUrl, spritePath);

          allPokemon.push({
            id: detail.id,
            name: detail.name,
            height: detail.height,
            weight: detail.weight,
            base_experience: detail.base_experience,
            types: detail.types.map((t) => ({ name: t.type.name })),
            abilities: detail.abilities.map((a) => ({
              name: a.ability.name,
              hidden: a.is_hidden,
            })),
            stats: detail.stats.map((s) => ({
              name: s.stat.name,
              value: s.base_stat,
            })),
          });
        } catch (err) {
          console.error(`  Failed #${id} ${entry.name}: ${err}`);
        }
      }),
    );

    await sleep(200);
  }

  allPokemon.sort((a, b) => a.id - b.id);

  const outputPath = join(DATA_DIR, "pokemon.json");
  writeFileSync(outputPath, JSON.stringify(allPokemon, null, 2));
  console.log(`\nDone! Saved ${allPokemon.length} Pokemon to ${outputPath}`);
  console.log(`Sprites saved to ${SPRITES_DIR}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
