"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconCoffee,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { RegisterEventCard } from "./Register";
import { LeaderboardSkeleton } from "./Leaderboard";

export function BentoGridComponent() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const Organizers = () => {
  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-row space-x-2"
    >
      {/* Lead Organizer */}
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4  border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          TITAN
        </p>
        <p className="border border-blue-500 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs rounded-full px-2 py-0.5 mt-2">
          Lead
        </p>
      </motion.div>

      {/* Host */}
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          BlackAV
        </p>
        <p className="border border-purple-500 bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-xs rounded-full px-2 py-0.5 mt-2">
          Host
        </p>
      </motion.div>

      {/* Lead Coordinator */}
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Lauwwa
        </p>
        <p className="border border-teal-500 bg-teal-100 dark:bg-teal-900/20 text-teal-600 text-xs rounded-full px-2 py-0.5 mt-2">
          Lead
        </p>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Events at The UwU Café",
    description: "The ultimate commencement of Grand Theft Furious series.",
    header: (
      <div className="relative w-full h-80 rounded-xl overflow-hidden bg-black">
        <Image
          src="/event-banner.jpg"
          alt="Event Banner"
          fill
          className="object-cover object-[center_80%] rounded-xl"
          priority
        />
      </div>
    ),
    className: "md:col-span-2",
    icon: <IconCoffee className="h-4 w-4 text-neutral-500" />,
  },
  {
    header: <RegisterEventCard />,
    className: "md:col-span-1",
  },
  {
    title: "Meet the Organizers",
    description:
      "The faces behind the magic — planning, executing, delivering.",
    header: <Organizers />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Leaderboard",
    description:
      "From fierce battles to epic moments, these are the players rising through the placements.",
    header: <LeaderboardSkeleton />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
