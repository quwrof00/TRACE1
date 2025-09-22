import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const GlowingStarsBackground = () => {
  const stars = 200;
  const columns = 25;

  // array of numbers representing glowing star indices
  const [glowingStars, setGlowingStars] = useState<number[]>([]);
  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars([...highlightedStars.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, [stars]);

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "2px",
        padding: "20px",
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        return (
          <div
            key={`star-${starIdx}`}
            className="relative flex items-center justify-center"
          >
            <Star isGlowing={isGlowing} delay={delay} />
            <AnimatePresence mode="wait">
              {isGlowing && <Glow delay={delay} />}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

type StarProps = {
  isGlowing: boolean;
  delay: number;
};

const Star = ({ isGlowing, delay }: StarProps) => {
  return (
    <motion.div
      key={delay}
      initial={{ scale: 1 }}
      animate={{
        scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
        background: isGlowing ? "#fff" : "#666",
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay: delay,
      }}
      className="bg-[#666] h-[1px] w-[1px] rounded-full relative z-20"
    />
  );
};

type GlowProps = {
  delay: number;
};

const Glow = ({ delay }: GlowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay: delay,
      }}
      exit={{ opacity: 0 }}
      className="absolute left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full bg-blue-500 blur-[1px] shadow-2xl shadow-blue-400"
    />
  );
};

export default GlowingStarsBackground;
