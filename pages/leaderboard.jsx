"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, ArrowUp, ArrowDown, Minus } from "lucide-react";
import Footer from "@/components/Footer";
import { AnimatedShinyText } from "@/components/magicui/AnimatedShinyText";

const fetchSheetData = async () => {
  try {
    const response = await fetch(
      "https://corsproxy.io/?https://docs.google.com/spreadsheets/d/e/2PACX-1vQKAPb6-pT1PnqceBlziOwXRG1qq3Crr7HFfKpCw8Z6fwymSfvftJSh-C3-mU-xm0rAlrAz5ajZDLfB/pub?output=csv"
    );
    const text = await response.text();
    const rows = text.trim().split("\n").slice(1);
    const data = rows
      .map((row) => {
        const [username, score] = row.split(",");
        return {
          username: username?.trim(),
          score: parseInt(score?.trim()),
        };
      })
      .filter((entry) => entry.username && !isNaN(entry.score))
      .sort((a, b) => b.score - a.score);
    return data;
  } catch (err) {
    console.error("Fetch failed", err);
    return [];
  }
};

const getRankHash = (data) =>
  data.map((p, i) => `${p.username}:${i}`).join("|");

const compareAndUpdateIfNeeded = (newData) => {
  if (typeof window === "undefined") return [newData, true];

  const prevMeta = JSON.parse(localStorage.getItem("leaderboardMeta") || "{}");
  const prevHash = localStorage.getItem("leaderboardHash");
  const isFirstLoad = !prevHash;

  const currentHash = getRankHash(newData);

  if (!isFirstLoad && prevHash === currentHash) {
    return [[], false];
  }

  const updated = newData.map((player, index) => {
    const prev = prevMeta[player.username];
    let change = "same";
    if (prev) {
      const oldRank = prev.rank;
      if (oldRank > index) change = "up";
      else if (oldRank < index) change = "down";
      else change = prev.change;
    }
    return {
      ...player,
      change,
    };
  });

  const newMeta = {};
  updated.forEach((player, index) => {
    newMeta[player.username] = {
      rank: index,
      change: player.change,
    };
  });

  localStorage.setItem("leaderboardMeta", JSON.stringify(newMeta));
  localStorage.setItem("leaderboardHash", currentHash);

  return [updated, true];
};

const neonGlow = {
  up: "shadow-[0_0_3px_1px_#22c55e]",
  down: "shadow-[0_0_3px_1px_#ef4444]",
  same: "shadow-[0_0_3px_1px_#9ca3af]",
};

const iconVariants = {
  initial: { y: -4, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 4, opacity: 0 },
};

const PlayerRow = ({ player, index }) => {
  const position = index + 4;

  const IconComponent = {
    up: ArrowUp,
    down: ArrowDown,
    same: Minus,
  }[player.change];

  const iconColor = {
    up: "text-green-400",
    down: "text-red-400",
    same: "text-gray-400",
  }[player.change];

  const shadow = neonGlow[player.change] || "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center mt-4 justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-sm transition-all ${shadow}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-slate-800 text-white text-sm flex items-center justify-center font-bold ring-2 ring-white/10">
          {position}
        </div>
        <div>
          <div className="text-white font-medium">{player.username}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            #{position}
            <motion.span
              key={player.change}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300 }}
              className={iconColor}
            >
              <IconComponent className="w-4 h-4" />
            </motion.span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white font-bold">
          {player.score.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400">pts</div>
      </div>
    </motion.div>
  );
};

const TopThreeRow = ({ players }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
    {players.map((player, index) => {
      const position = index + 1;

      // Icons: Trophy for 1st, Award for others
      const Icon = position === 1 ? Trophy : Award;

      // Tailwind classes
      const shadowClass = {
        1: "shadow-[0_0_3px_1px_#facc15]",
        2: "shadow-[0_0_3px_1px_#9ca3af]",
        3: "shadow-[0_0_3px_1px_#f97316]",
      }[position];

      const iconColor = {
        1: "text-yellow-300",
        2: "text-gray-300",
        3: "text-orange-400",
      }[position];

      const borderColor = {
        1: "border-yellow-400",
        2: "border-gray-400",
        3: "border-orange-400",
      }[position];

      return (
        <motion.div
          key={player.username}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-xl mt-4 text-center backdrop-blur-sm bg-white/5 text-white ${shadowClass} ${borderColor} border-2`}
        >
          <div className="flex justify-center mb-2">
            <Icon className={`w-6 h-6 ${iconColor} drop-shadow-md`} />
          </div>
          <div className="text-xl font-bold">{player.username}</div>
          <div className="text-sm text-white opacity-90">
            {player.score.toLocaleString()} pts
          </div>
          <div className="text-xs text-gray-400 mt-1">#{position}</div>
        </motion.div>
      );
    })}
  </div>
);

export default function LeaderboardPage() {
  const [topThree, setTopThree] = useState([]);
  const [others, setOthers] = useState([]);

  const refresh = async () => {
    const data = await fetchSheetData();
    const [compared, changed] = compareAndUpdateIfNeeded(data);

    if (changed) {
      setTopThree(compared.slice(0, 3));
      setOthers(compared.slice(3));
    } else if (
      topThree.length === 0 &&
      others.length === 0 &&
      data.length > 0
    ) {
      // First load fallback when no change detected but data exists
      setTopThree(data.slice(0, 3).map((p) => ({ ...p, change: "same" })));
      setOthers(data.slice(3).map((p) => ({ ...p, change: "same" })));
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <title>Leaderboard | The UwU Café</title>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-slate-900 text-white">
        <main className="flex-1 w-full flex flex-col items-center px-4 py-12">
          <div className="max-w-4xl w-full">
            {topThree.length > 0 ? (
              <>
                <TopThreeRow players={topThree} />
                <div className="space-y-2">
                  {others.map((player, i) => (
                    <PlayerRow
                      key={player.username}
                      player={player}
                      index={i}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-gray-500 m-32">
                <AnimatedShinyText>
                  Hang tight while we sync the scores and sort out the legends.
                  <br /> <br />
                  Every second counts — the top players are just pixels away
                  from greatness.
                  <br />
                  GG incoming!
                  <br />
                  <br />
                  stay UwU!
                </AnimatedShinyText>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
