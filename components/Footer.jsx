import React from "react";
import { AnimatedShinyText } from "./magicui/AnimatedShinyText";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-400">
      <small className="mb-2 block text-xs">
        <AnimatedShinyText>
          &copy; {new Date().getFullYear()} The UwU Café – Gaming Community. All
          rights reserved.
        </AnimatedShinyText>
      </small>
      <p className="text-xs max-w-xl mx-auto">
        The UwU Café is a Sri Lankan gaming community built by gamers, for
        gamers. From tournaments and casual meetups to online streams and
        esports events, we aim to create a chill, inclusive space where passion
        for gaming thrives. GG & stay UwU!
      </p>
    </footer>
  );
}
