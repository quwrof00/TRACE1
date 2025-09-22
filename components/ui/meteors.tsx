"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

export const Meteors = ({
  number = 40,
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
              "animate-meteor-effect absolute h-[1.5px] w-[1.5px] rotate-[45deg] rounded-full bg-white/80",
              "shadow-[0_0_4px_1px_rgba(255,255,255,0.4)]",
              "before:absolute before:top-1/2 before:h-[1.5px] before:w-[80px] before:-translate-y-1/2",
              "before:bg-gradient-to-r before:from-white/50 before:via-white/30 before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-60px",
              left: `${position}px`,
              animationDelay: `${Math.random() * 2}s`, // Random delay up to 2s
              animationDuration: "4s"
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};