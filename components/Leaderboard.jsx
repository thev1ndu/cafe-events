"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

// Fetch CSV from Google Sheet and parse it
const fetchSheetData = async () => {
  try {
    const response = await fetch(
      "https://corsproxy.io/?https://docs.google.com/spreadsheets/d/e/2PACX-1vQKAPb6-pT1PnqceBlziOwXRG1qq3Crr7HFfKpCw8Z6fwymSfvftJSh-C3-mU-xm0rAlrAz5ajZDLfB/pub?output=csv"
    );
    const text = await response.text();
    const rows = text.trim().split("\n").slice(1); // skip header
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
    console.error("Failed to fetch Google Sheet data:", err);
    return [];
  }
};

const getAbbreviation = (username) => {
  return username.slice(0, 3).toUpperCase();
};

const RefreshIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

export function LeaderboardSkeleton() {
  const [data, setData] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState("");

  const refresh = async () => {
    const sheetData = await fetchSheetData();
    setData(sheetData);
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    refresh(); // only initial fetch
  }, []);

  const rowsPerFlex = 6;
  const chunks = Array.from({ length: 5 }, (_, i) =>
    data.slice(i * rowsPerFlex, (i + 1) * rowsPerFlex)
  );

  const glowStyles = {
    1: "bg-gradient-to-r from-yellow-400 via-white to-yellow-300 text-transparent bg-clip-text",
    2: "bg-gradient-to-r from-gray-400 via-white to-gray-300 text-transparent bg-clip-text",
    3: "bg-gradient-to-r from-amber-800 via-white to-amber-500 text-transparent bg-clip-text",
  };

  return (
    <div className="flex flex-col w-full h-full p-0.5">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
          <p className="text-[9px] text-muted-foreground">
            Last refreshed: {lastRefreshed}
          </p>
          <button
            onClick={refresh}
            className="w-5 h-5 p-0 bg-transparent hover:bg-white/5 rounded transition-colors flex items-center justify-center"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      <div className="flex w-full gap-0.5">
        {chunks.map((chunk, index) => (
          <div key={index} className="flex-1 rounded text-[10px]">
            {chunk.map((row, idx) => {
              const position = idx + 1 + index * rowsPerFlex;
              const isTopThree = position <= 3;

              return (
                <div
                  key={idx}
                  className={`group relative flex justify-between gap-1 px-1 py-1 rounded-md transition-colors cursor-pointer 
                    ${isTopThree ? "" : "hover:brightness-110"}`}
                  title={`${row.username} - ${row.score} points`}
                >
                  <div className="font-medium p-0.5 w-1/2 text-gray-300 flex items-center gap-1">
                    {isTopThree ? (
                      <Trophy className="w-2 h-2 mr-1" />
                    ) : (
                      <span className="text-[8px] font-bold min-w-[12px]">
                        {position}.
                      </span>
                    )}

                    {isTopThree ? (
                      <motion.span
                        className={`font-mono font-bold tracking-wide ${glowStyles[position]}`}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      >
                        {getAbbreviation(row.username)}
                      </motion.span>
                    ) : (
                      <span className="font-mono font-bold tracking-wide">
                        {getAbbreviation(row.username)}
                      </span>
                    )}
                  </div>

                  <div className="text-right p-0.5 w-1/2 font-bold text-white">
                    {row.score}
                  </div>

                  {/* Tooltip on hover */}
                  <div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2
                      bg-black/95 text-white text-[9px] px-2 py-1 rounded
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      pointer-events-none whitespace-nowrap z-10 border border-gray-700"
                  >
                    <div className="font-bold">{row.username}</div>
                    <div className="text-[8px] text-gray-300">
                      {row.score} pts • P{position}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
