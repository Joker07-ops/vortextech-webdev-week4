import { useState, useRef, useCallback, useEffect } from "react";
import { spriteUrl } from "@/utils/pokemon";
import { TYPE_COLORS } from "@/utils/pokemon";
import styles from "./PokemonViewer3D.module.css";

interface PokemonViewer3DProps {
  pokemonId: number;
  pokemonName: string;
  types: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PokemonViewer3D({
  pokemonId,
  pokemonName,
  types,
  isOpen,
  onClose,
}: PokemonViewer3DProps) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      velocity.current = { x: dx * 0.5, y: dy * 0.5 };

      setRotY((prev) => prev + dx * 0.5);
      setRotX((prev) => Math.max(-90, Math.min(90, prev - dy * 0.5)));
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) return;

    let running = true;
    const decay = 0.95;

    function tick() {
      if (!running) return;
      const vx = velocity.current.x;
      const vy = velocity.current.y;

      if (Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01) return;

      velocity.current = { x: vx * decay, y: vy * decay };
      setRotY((prev) => prev + vx);
      setRotX((prev) => Math.max(-90, Math.min(90, prev - vy)));

      animFrame.current = requestAnimationFrame(tick);
    }

    animFrame.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(animFrame.current);
    };
  }, [isDragging]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.4, Math.min(3, prev - e.deltaY * 0.001)));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) {
      setRotX(0);
      setRotY(0);
      setZoom(1);
      setImgError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={`3D viewer for ${pokemonName}`}
      tabIndex={-1}
    >
      <div className={styles.viewer} ref={containerRef}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          type="button"
          aria-label="Close 3D viewer"
        >
          ✕
        </button>

        <div className={styles.hud}>
          <span className={styles.hudLabel}>Drag to rotate</span>
          <span className={styles.hudSep}>|</span>
          <span className={styles.hudLabel}>Scroll to zoom</span>
        </div>

        <div
          className={styles.stage}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div
            className={styles.model}
            style={{
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
            }}
          >
            <div className={styles.modelFront}>
              {imgError ? (
                <span className={styles.modelFallback}>?</span>
              ) : (
                <img
                  src={spriteUrl(pokemonId)}
                  alt={`3D view of ${pokemonName}`}
                  className={styles.modelImage}
                  draggable={false}
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            <div className={styles.modelBack}>
              <div className={styles.modelBackInner}>
                <span className={styles.backId}>
                  #{String(pokemonId).padStart(3, "0")}
                </span>
                <span className={styles.backName}>{pokemonName}</span>
              </div>
            </div>
            <div className={styles.modelEdge} />
          </div>
        </div>

        <div className={styles.infoBar}>
          <span className={styles.infoId}>#{String(pokemonId).padStart(3, "0")}</span>
          <h2 className={styles.infoName}>{pokemonName}</h2>
          <div className={styles.infoTypes}>
            {types.map((t) => (
              <span
                key={t}
                className={styles.infoType}
                style={{ backgroundColor: TYPE_COLORS[t] || "#777" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
