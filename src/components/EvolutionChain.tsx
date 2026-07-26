import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvolutionChain } from "@/data/evolutionChains";
import { getNameToIdMap } from "@/data";
import { spriteUrl } from "@/utils/pokemon";
import { ChevronRightIcon } from "@/components/Icons";
import styles from "./EvolutionChain.module.css";

interface Props {
  pokemonName: string;
}

export default function EvolutionChain({ pokemonName }: Props) {
  const chain = getEvolutionChain(pokemonName);
  if (!chain || chain.length <= 1) return null;

  const [nameMap, setNameMap] = useState<Record<string, number>>({});

  useEffect(() => {
    getNameToIdMap().then(setNameMap);
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Evolution Chain</h2>
      <div className={styles.chain}>
        {chain.map((name, i) => (
          <div key={name} className={styles.stage}>
            {i > 0 && (
              <span className={styles.arrow} aria-hidden="true">
                <ChevronRightIcon size={18} />
              </span>
            )}
            <Link
              to={`/pokemon/${name}`}
              className={`${styles.node} ${name === pokemonName.toLowerCase() ? styles.current : ""}`}
            >
              <img
                src={nameMap[name] ? spriteUrl(nameMap[name]) : ""}
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
