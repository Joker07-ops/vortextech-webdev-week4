import { Link } from "react-router-dom";
import { getEvolutionChain } from "@/data/evolutionChains";
import { spriteUrl } from "@/utils/pokemon";
import styles from "./EvolutionChain.module.css";

interface Props {
  pokemonName: string;
}

export default function EvolutionChain({ pokemonName }: Props) {
  const chain = getEvolutionChain(pokemonName);
  if (!chain || chain.length <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Evolution Chain</h2>
      <div className={styles.chain}>
        {chain.map((name, i) => (
          <div key={name} className={styles.stage}>
            {i > 0 && (
              <span className={styles.arrow} aria-hidden="true">
                \u2192
              </span>
            )}
            <Link
              to={`/pokemon/${name}`}
              className={`${styles.node} ${name === pokemonName.toLowerCase() ? styles.current : ""}`}
            >
              <img
                src={spriteUrl(name)}
                alt={name}
                className={styles.sprite}
                loading="lazy"
              />
              <span className={styles.name}>{name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
