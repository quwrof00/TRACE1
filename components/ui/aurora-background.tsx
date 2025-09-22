"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main className="relative min-h-screen">
      <div
        className={cn("relative flex flex-col items-center min-h-screen", className)}
        {...props}
      >
        {/* Aurora Layer */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none aurora-animate",
            showRadialGradient &&
              "after:absolute after:inset-0 after:content-[''] after:opacity-40 after:blur-[60px] after:mix-blend-soft-light"
          )}
          style={{
            '--aurora': 'repeating-linear-gradient(100deg,#3b82f6 10%,#a5b4fc 15%,#93c5fd 20%,#ddd6fe 25%,#60a5fa 30%)',
            '--dark-gradient': 'repeating-linear-gradient(100deg,#0A192F 0%,#0A192F 7%,transparent 10%,transparent 12%,#0A192F 16%)',
            backgroundImage: 'var(--dark-gradient), var(--aurora)',
            backgroundSize: '300% 200%, 200% 100%',
            backgroundPosition: '50% 50%, 50% 50%',
            opacity: 0.5,
          } as React.CSSProperties}
        ></div>

        {/* Content */}
        {children}
      </div>
    </main>
  );
};
