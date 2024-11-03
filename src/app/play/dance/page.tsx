"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MainComponent } from "~/app/_components/Main";
import VideoPlayer from "~/app/_components/VideoPlayer";
import ErrorBoundary from "~/app/_components/ErrorBoundary";

export default function Page() {
  const [userPose, setUserPose] = useState<any[]>([]);
  const [videoPose, setVideoPose] = useState<any[]>([]);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isHovered, setHovered] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Calculate similarity between userPose and videoPose
  const calculateSimilarity = (pose1: any[], pose2: any[]) => {
    if (pose1.length === 0 || pose2.length === 0) return null;

    let totalDifference = 0;
    const scalingFactor = 2.5; // Adjust this for sensitivity
    const keypoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]; // Shoulders, elbows, wrists

    keypoints.forEach((index) => {
      const point1 = pose1[index];
      const point2 = pose2[index];

      if (point1 && point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        totalDifference += distance;
      }
    });

    // Amplify the total difference to create a wider spread
    totalDifference *= scalingFactor;
    const maxDifference = keypoints.length * 2 * scalingFactor;

    // Calculate similarity, clamping between 0 and 100
    const similarity = (1 - totalDifference / maxDifference) * 100;
    return Math.max(0, Math.min(similarity, 100));
  };

  // Update similarity score whenever userPose or videoPose updates, but only if tracking is active
  useEffect(() => {
    if (isTracking && userPose.length > 0 && videoPose.length > 0) {
      const score = calculateSimilarity(userPose, videoPose);
      setSimilarityScore(score);
    }
  }, [isTracking, userPose, videoPose]);

  // Start and stop tracking
  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setSimilarityScore(null); // Reset similarity score when tracking stops
  };

  return (
    <ErrorBoundary>
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

          <MainComponent setUserPose={setUserPose} />
        </div>
        <VideoPlayer
          selected={"/songs/hot_to_go.mp4"}
          setVideoPose={(pose) => {
            if (isTracking) setVideoPose(pose); // Only set video pose when tracking is active
          }}
          similarityScore={similarityScore}
          isTracking={isTracking} // Pass tracking state as a prop
          setIsTracking={setIsTracking} // Pass setIsTracking to control tracking from VideoPlayer
        />
      </div>
    </ErrorBoundary>
  );
}
