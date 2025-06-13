"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-[#192937] to-[#10171c]">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-yellow-400 drop-shadow-lg"
      >
        ወቸው Good
        <br />
        <span className="text-yellow-600">Ethiopia’s Funniest Podcast</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-5 text-lg sm:text-xl md:text-2xl text-yellow-100 max-w-2xl"
      >
        የኢትዮጵያ ታላቁ ፖድካስት፡ የህዝብ ድምፅ እና እውነተኛ ታሪኮች።
        <br className="hidden sm:block" />
        Jokes, stories, and chaos you didn’t ask for — but you’ll love it.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4"
      >
        <Button
          asChild
          className="bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl text-lg px-6 py-3 font-semibold shadow-md"
        >
          <a href="/episodes">Laugh Now</a>
        </Button>

        <Button
          asChild
          variant="outline"
          className="border-yellow-500 text-yellow-200 hover:bg-yellow-500 hover:text-black rounded-xl text-lg px-6 py-3 font-semibold"
        >
          <a
            href="https://www.youtube.com/@WECHEWGOOD"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-block text-yellow-400 text-lg font-semibold hover:text-black transition-colors duration-300"
          >
            <span className="hover:text-black">
              ከርብ ከርብ
            </span>
            <span className="hover:text-black">
              Subscribe
            </span>
          </a>
        </Button>
      </motion.div>
    </section>
  );
}
