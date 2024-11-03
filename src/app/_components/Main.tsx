"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { HolisticModel } from "./HolisticModel";

const VRMDisplay = dynamic(() => import("./LoadModel"));

export const MainComponent = () => {
  const [poseLandmarks, setPoseLandmarks] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vrmContainerRef = useRef(null);

  return (
    <div className="flex">
      <HolisticModel setPoseLandmarks={setPoseLandmarks} />
      <div ref={vrmContainerRef} />
      <VRMDisplay
        poseLandmarks={poseLandmarks}
        videoRef={videoRef}
        containerRef={vrmContainerRef}
      />
    </div>
  );
};
