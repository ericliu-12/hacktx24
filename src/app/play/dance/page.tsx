"use client";

import Link from "next/link";
import { useState } from "react";
import { MainComponent } from "~/app/_components/Main";
import VideoPlayer from "~/app/_components/VideoPlayer";

export default function Page() {
  const [isHovered, setHovered] = useState(false);

  return (
    <div className="flex w-full">
      <div className="flex flex-col">
        <h1>just leap</h1>
        <Link href="/play">
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {isHovered ? "< back" : "back"}
          </div>
        </Link>

        <MainComponent />
      </div>
      {/* <CompareActions /> */}
      <VideoPlayer selected={"/songs/hot_to_go.mp4"} />
    </div>
  );
}
