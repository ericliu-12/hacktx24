"use client"

import Link from "next/link";
import ThreeScene from "./ThreeScreen";
import type { Session } from "next-auth";
import { useState } from "react";

export default function HomeWrapper({ session }: { session: Session | null }) {

    const [startAnim, setStartAnim] = useState<boolean>(false);    

    return <>
        <ThreeScene startAnim={startAnim} setStartAnim={setStartAnim} />

        <div className="fixed top-1/2 -translate-y-1/2 right-10 bg-black/75 shadow-md p-4">
            <p className="text-3xl">Welcome, {session?.user ? session.user.name : "Guest!"}</p>

            {!session?.user ?
                <Link href="/api/auth/signin">
                    <button>Sign In</button>
                </Link>
                : <div className="space-x-4">
                    <button onClick={() => setStartAnim(true)} className="hover:translate-y-1">Start</button>
                    <button className="hover:translate-y-1">Stats</button>
                    <button className="hover:translate-y-1">Leaderboards</button>
                </div>}
        </div>
    </>
}