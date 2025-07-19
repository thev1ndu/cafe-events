"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";
import React from "react";

interface ShinyButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative cursor-pointer rounded-lg px-6 py-2 font-medium backdrop-blur-xl border transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/10%_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_var(--primary)/10%]",
        className
      )}
      {...props}
    >
      <span className="relative block size-full text-xs uppercase tracking-wide text-[rgb(255,255,255,95%)]">
        {children}
      </span>
    </motion.button>
  );
});

ShinyButton.displayName = "ShinyButton";
