"use client"

import Link from "next/link";
import WordHuntGame from "~/app/_components/WordHuntGame";
import useSound from "use-sound";

export default function WordHunt() {

    const [backSound] = useSound("/audio/select.wav")

    return (
        <div>
            <Link href="/play">
                <div
                    onClick={() => backSound()}
                    className="fixed left-6 top-6 z-50 hover:translate-y-1"
                >
                    Back
                </div>
            </Link>
            
            <WordHuntGame />
        </div>
    )
}