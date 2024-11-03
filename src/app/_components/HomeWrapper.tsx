"use client";

import Link from "next/link";
import ThreeScene from "./ThreeScreen";
import type { Session } from "next-auth";
import { useState } from "react";

export default function HomeWrapper({ session }: { session: Session | null }) {
  const [startAnim, setStartAnim] = useState<boolean>(false);
  const [route, setRoute] = useState("");

  return (
    <>
      <ThreeScene
        startAnim={startAnim}
        setStartAnim={setStartAnim}
        route={route}
      />

      <div className="fixed right-10 top-1/2 -translate-y-1/2 bg-black/75 p-4 shadow-md">
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
                setStartAnim(true);
                setRoute("/play");
              }}
              className="hover:translate-y-1"
            >
              Start
            </button>
            <button className="hover:translate-y-1">Stats</button>
            <button className="hover:translate-y-1">Leaderboards</button>
            <button
              onClick={() => {
                setStartAnim(true);
                setRoute("/profile");
              }}
              className="hover:translate-y-1"
            >
              Profile
            </button>
          </div>
        )}
      </div>
    </>
  );
}
