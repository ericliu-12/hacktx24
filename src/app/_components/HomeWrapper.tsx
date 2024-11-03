"use client";

import Link from "next/link";
import ThreeScene from "./ThreeScreen";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";

export default function HomeWrapper({ session }: { session: Session | null }) {
  const [startAnim, setStartAnim] = useState<boolean>(false);
  const [leaderAnim, setLeaderAnim] = useState<boolean>(false);
  const [route, setRoute] = useState("");
  const [shown, setShown] = useState(true);
  const [playSound] = useSound("/audio/play.wav");
  const [selectSound] = useSound("/audio/select.wav");

  useEffect(() => {
    if (!startAnim) return;
    setShown(false);
  }, [startAnim]);

  useEffect(() => {
    if (!leaderAnim) return;
    setShown(false);
  }, [leaderAnim]);

  return (
    <>
      <ThreeScene startAnim={startAnim} leaderAnim={leaderAnim} route={route} />

      <AnimatePresence>
        {shown ? (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed right-10 top-1/2 -translate-y-1/2 bg-black/75 p-4 shadow-md"
          >
            <p className="text-3xl">
              Welcome, {session?.user ? session.user.name : "Guest!"}
            </p>

            {!session?.user ? (
              <Link href="/api/auth/signin">
                <button>Sign In</button>
              </Link>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={() => {
                    playSound();
                    setStartAnim(true);
                    setRoute("/play");
                  }}
                  className="hover:translate-y-1"
                >
                  Start
                </button>
                <button
                  onClick={() => {
                    selectSound();
                    setStartAnim(true);
                    setRoute("/stats");
                  }}
                  className="hover:translate-y-1"
                >
                  Stats
                </button>
                <button
                  onClick={() => {
                    selectSound();
                    setLeaderAnim(true);
                    setRoute("/leaderboards");
                  }}
                  className="hover:translate-y-1"
                >
                  Leaderboards
                </button>
                <button
                  onClick={() => {
                    selectSound();
                    setStartAnim(true);
                    setRoute("/profile");
                  }}
                  className="hover:translate-y-1"
                >
                  Profile
                </button>
              </div>
            )}
          </motion.div>
        ) : undefined}
      </AnimatePresence>
    </>
  );
}
