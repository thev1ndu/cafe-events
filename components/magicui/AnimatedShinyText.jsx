import React from "react";
import { cn } from "@/lib/utils";

export const AnimatedShinyText = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={{
        "--shiny-width": `${shimmerWidth}px`,
        backgroundImage: `
          linear-gradient(to right, #6b7280, #6b7280), /* base color: gray-500 */
          linear-gradient(110deg, transparent, rgba(255,255,255,0.6), transparent)
        `,
        backgroundSize: `100% 100%, var(--shiny-width) 100%`,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "0 0, -200% 0",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        animation: "shiny-text 5s linear infinite",
        display: "inline-block",
        position: "relative",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </span>
  );
};
