"use client";

import Link from "next/link";
import { useState } from "react";
import { MainComponent } from "~/app/_components/Main";
import WordHuntGame from "~/app/_components/WordHuntGame";

export default function WordHunt() {
  const [userPose, setUserPose] = useState<any[]>([]);
  const [handPose, setHandPose] = useState<any[]>([]);
  const [isHovered, setHovered] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col">
      <Link href="/play">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="pl-10 pt-10"
        >
          {isHovered ? "< back" : "back"}
        </div>
      </Link>
      <div className="flex">
        <div>
          <MainComponent setUserPose={setUserPose} setHandPose={setHandPose} />
        </div>
        <div>
          <WordHuntGame handPose={handPose} />
        </div>
      </div>
    </div>
  );
}
