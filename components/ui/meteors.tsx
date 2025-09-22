"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const meteors = new Array(number).fill(true);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((_, idx) => {
        const position = (idx * width) / number;

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-[2px] w-[2px] rotate-[45deg] rounded-full bg-white",
              // brighter glow + longer trail
              "shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]",
              "before:absolute before:top-1/2 before:h-[2px] before:w-[160px] before:-translate-y-1/2",
              "before:bg-gradient-to-r before:from-white before:via-white/70 before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-60px",
              left: `${position}px`,
              animationDelay: Math.random() * 5 + "s",
              animationDuration:
                "2s"
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};
