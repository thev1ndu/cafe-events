import { Geist, Geist_Mono } from "next/font/google";
import DarkVeil from "../components/DarkVeil/DarkVeil";
import Footer from "@/components/Footer";
import { BentoGridComponent } from "../components/BentoGrid";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to ` The UwU Café `</title>
      </Head>
      <div className="fixed inset-0 w-screen h-screen m-0 p-0 z-0 pointer-events-none">
        <DarkVeil />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <main className="flex-1 flex flex-col justify-center items-center mt-4 mb-16 sm:mt-8 sm:mb-16 md:mt-4 md:mb-16">
          <BentoGridComponent />
        </main>
        <Footer />
      </div>
    </>
  );
}
