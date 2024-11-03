"use client";

import React, { useEffect, useRef } from "react";
import * as hol from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import * as draw from "@mediapipe/drawing_utils";

interface Props {
  setPoseLandmarks: (landmarks: any) => void; // Function to update landmarks
}

export const HolisticModel: React.FC<Props> = ({ setPoseLandmarks }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<cam.Camera | null>(null);

  // const drawResults = (results: any) => {
  //   const videoElement = videoRef.current;
  //   const canvasElement = canvasRef.current;
  //   const ctx = canvasElement?.getContext("2d");

  //   if (videoElement && canvasElement && ctx) {
  //     // Clear the canvas before drawing
  //     ctx.save();
  //     ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  //     // Use `Mediapipe` drawing functions
  //     draw.drawConnectors(ctx, results.poseLandmarks, hol.POSE_CONNECTIONS, {
  //       color: "#00cff7",
  //       lineWidth: 4,
  //     });
  //     draw.drawLandmarks(ctx, results.poseLandmarks, {
  //       color: "#ff0364",
  //       lineWidth: 2,
  //     });
  //     draw.drawConnectors(
  //       ctx,
  //       results.faceLandmarks,
  //       hol.FACEMESH_TESSELATION,
  //       {
  //         color: "#C0C0C070",
  //         lineWidth: 1,
  //       },
  //     );
  //     if (results.faceLandmarks && results.faceLandmarks.length === 478) {
  //       //draw pupils
  //       draw.drawLandmarks(
  //         ctx,
  //         [results.faceLandmarks[468], results.faceLandmarks[468 + 5]],
  //         {
  //           color: "#ffe603",
  //           lineWidth: 2,
  //         },
  //       );
  //     }
  //     draw.drawConnectors(
  //       ctx,
  //       results.leftHandLandmarks,
  //       hol.HAND_CONNECTIONS,
  //       {
  //         color: "#eb1064",
  //         lineWidth: 5,
  //       },
  //     );
  //     draw.drawLandmarks(ctx, results.leftHandLandmarks, {
  //       color: "#00cff7",
  //       lineWidth: 2,
  //     });
  //     draw.drawConnectors(
  //       ctx,
  //       results.rightHandLandmarks,
  //       hol.HAND_CONNECTIONS,
  //       {
  //         color: "#22c3e3",
  //         lineWidth: 5,
  //       },
  //     );
  //     draw.drawLandmarks(ctx, results.rightHandLandmarks, {
  //       color: "#ff0364",
  //       lineWidth: 2,
  //     });
  //   }
  // };

  const onResults = (results: any) => {
    // Draw landmark guides
    // drawResults(results);
    // Animate model
    setPoseLandmarks(results);
  };

  useEffect(() => {
    const holistic = new hol.Holistic({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      refineFaceLandmarks: true,
    });

    holistic.onResults(onResults);

    if (videoRef.current) {
      cameraRef.current = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await holistic.send({
              image: videoRef.current as HTMLVideoElement,
            });
          }
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    }

    // Cleanup on component unmount
    return () => {
      cameraRef.current?.stop(); // Use the ref to stop the camera
    };
  }, []);

  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <video ref={videoRef} autoPlay playsInline muted hidden />
        {/* <canvas ref={canvasRef} width={320} height={240} /> */}
      </div>
    </>
  );
};
