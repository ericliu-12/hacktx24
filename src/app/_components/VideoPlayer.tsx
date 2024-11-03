"use client";

import { useRef } from "react";

interface Props {
  selected: any;
}

export default function VideoPlayer({ selected }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startTracking = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const stopTracking = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      <div>
        <video
          ref={videoRef}
          style={{ width: "640px", height: "480px" }}
          controls
        >
          <source src={selected} type="video/mp4" />
          <p>Your browser does not support the video tag.</p>
        </video>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={startTracking}>Start Tracking</button>
        <button onClick={stopTracking}>Stop Tracking</button>
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          <div>Score: {100 !== null ? (100).toFixed(2) : "N/A"}</div>
          <div>Label: {"Excellent"}</div>
        </div>
      </div>
    </>
  );
}
