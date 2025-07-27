import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Make sure this is the correct path
import { ShinyButton } from "@/components/magicui/shiny-button";

export const RegisterEventCard = ({ className }) => {
  return (
    <div
      className={cn(
        "w-full h-full rounded-xl p-6 flex flex-col justify-between border-white/10",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold text-white leading-tight">
            Do things <br /> the right way
          </h3>
        </div>
        <p className="text-xs text-neutral-400">
          Don’t miss your chance to be part of something epic. Reserve your spot
          now and connect with gamers and streamers at our
          exclusive gaming event.
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Power up and join the action slots are
          limited!
        </p>
      </div>

      <div className="pt-4 mt-2">
        <a href="https://forms.gle/TKABVJ1DwGGHnP8j7" target="_blank">
          <ShinyButton className="w-full">REGISTER</ShinyButton>
        </a>
      </div>
    </div>
  );
};
