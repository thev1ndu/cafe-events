"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown, Minus, Sun, Moon, Home } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

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

const PlayerRow = ({ player, index, isDark }) => {
  const position = index + 1;
  
  const IconComponent = {
    up: TrendingUp,
    down: TrendingDown,
    same: Minus,
  }[player.change];

  const changeColor = {
    up: "text-green-500",
    down: "text-red-500",
    same: isDark ? "text-gray-500" : "text-gray-400",
  }[player.change];

  const isTopThree = position <= 3;
  
  const topThreeColors = isDark ? {
    1: "bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border-amber-400/20",
    2: "bg-gradient-to-r from-gray-800/40 to-slate-800/40 border-gray-400/20", 
    3: "bg-gradient-to-r from-orange-900/20 to-amber-900/20 border-orange-400/20"
  } : {
    1: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/50",
    2: "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200/50", 
    3: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/50"
  };

  const regularBg = isDark 
    ? 'bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-800/90'
    : 'bg-white/70 backdrop-blur-xl border border-gray-200/50 hover:bg-white/90';

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const shadowHover = isDark ? 'hover:shadow-lg hover:shadow-gray-900/50' : 'hover:shadow-lg hover:shadow-gray-200/50';

  const positionColors = isDark ? {
    1: 'bg-amber-900/30 text-amber-300 ring-1 ring-amber-400/30',
    2: 'bg-gray-700/50 text-gray-300 ring-1 ring-gray-400/30',
    3: 'bg-orange-900/30 text-orange-300 ring-1 ring-orange-400/30'
  } : {
    1: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300/50',
    2: 'bg-gray-100 text-gray-700 ring-1 ring-gray-300/50',
    3: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.02, 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`
        group relative overflow-hidden
        ${isTopThree 
          ? `${topThreeColors[position]} backdrop-blur-xl border` 
          : regularBg
        }
        rounded-2xl transition-all duration-300 ease-out
        ${shadowHover}
        hover:scale-[1.005] hover:-translate-y-0.5
      `}
    >
      {/* Liquid glass overlay */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-white/10 via-transparent to-white/5' : 'bg-gradient-to-r from-white/40 via-transparent to-white/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative px-5 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Position */}
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
            ${isTopThree 
              ? positionColors[position]
              : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }
          `}>
            {position}
          </div>
          
          {/* Player info */}
          <div className="flex items-center space-x-3">
            <span className={`font-medium ${textColor}`}>
              {player.username}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 + 0.1, type: "spring", stiffness: 500 }}
              className={`${changeColor}`}
            >
              <IconComponent className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 + 0.05 }}
            className={`font-semibold ${textColor}`}
          >
            {player.score.toLocaleString()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const refresh = async () => {
    const data = await fetchSheetData();
    const [compared, changed] = compareAndUpdateIfNeeded(data);

    if (changed) {
      setPlayers(compared);
    } else if (players.length === 0 && data.length > 0) {
      setPlayers(data.map((p) => ({ ...p, change: "same" })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  const bgGradient = isDark 
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-100";

  const textureOpacity = isDark ? "opacity-20" : "opacity-30";
  const breadcrumbText = isDark ? "text-gray-400" : "text-gray-500";
  const breadcrumbActive = isDark ? "text-white" : "text-gray-900";
  const loadingSpinner = isDark ? "border-gray-600 border-t-gray-300" : "border-gray-300 border-t-gray-600";

  return (
    <div className={`min-h-screen ${bgGradient} flex flex-col`}>
      {/* Subtle texture overlay */}
      <div 
        className={`fixed inset-0 ${textureOpacity}`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative flex-1 z-10">
        {/* Header with breadcrumb and controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="px-6 pt-6 pb-2 flex justify-between items-center"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1 text-sm">
            <span className={`${breadcrumbText} font-medium`}>cafe</span>
            <ChevronRight className={`w-3 h-3 ${breadcrumbText}`} />
            <span className={`${breadcrumbActive} font-medium`}>leaderboard</span>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/50' 
                  : 'bg-white/50 hover:bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-200/50'
                }
                backdrop-blur-sm
              `}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="px-6 pb-20">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-5 h-5 border-2 ${loadingSpinner} rounded-full`}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="max-w-2xl mx-auto space-y-2 pt-6"
            >
              <AnimatePresence>
                {players.map((player, index) => (
                  <PlayerRow
                    key={player.username}
                    player={player}
                    index={index}
                    isDark={isDark}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Geometric Diamond/Star Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Main centered geometric design */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute w-96 h-96"
          >
            <div className={`w-full h-full rounded-full border-4 ${isDark ? 'border-cyan-400/20' : 'border-cyan-300/20'} blur-sm`} />
            <div className={`absolute inset-2 rounded-full border-2 ${isDark ? 'border-teal-400/15' : 'border-teal-300/15'} blur-md`} />
          </motion.div>

          {/* Additional rotating elements */}

        </div>

        {/* Background secondary elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 80, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-1/6 w-32 h-32 opacity-30"
        >
          <div 
            className="w-full h-full"
            style={{
              background: isDark 
                ? 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, transparent, #06b6d4, transparent)'
                : 'conic-gradient(from 0deg, #a855f7, #3b82f6, transparent, #06b6d4, transparent)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              filter: 'blur(2px)'
            }}
          />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.08, 1]
          }}
          transition={{ 
            rotate: { duration: 70, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-1/4 right-1/6 w-24 h-24 opacity-25"
        >
          <div 
            className="w-full h-full"
            style={{
              background: isDark 
                ? 'conic-gradient(from 180deg, #10b981, #06b6d4, transparent, #8b5cf6, transparent)'
                : 'conic-gradient(from 180deg, #10b981, #06b6d4, transparent, #a855f7, transparent)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              filter: 'blur(3px)'
            }}
          />
        </motion.div>

        {/* Ambient glow overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-radial from-purple-900/5 via-transparent to-transparent' : 'bg-gradient-radial from-purple-100/5 via-transparent to-transparent'}`} />
      </div>
      
      {/* Footer at bottom */}
      <div className="mt-auto">
        <div className="container mx-auto px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
