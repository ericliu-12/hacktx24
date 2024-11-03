"use client";
import { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";

type Letter = {
  letter: string;
  row: number;
  col: number;
  selected: boolean;
  hovered: boolean;
};

export default function WordHuntGame() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<any>(null);
  const [grid, setGrid] = useState<Letter[][]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [handState, setHandState] = useState("Open");

  const loadHandLandmarker = async () => {
    // Dynamically import the Hands module
    const handsModule = await import("@mediapipe/hands");
    const hands = new handsModule.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);
    setHandLandmarker(hands);
  };

  const initializeGrid = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const gridArray: Letter[][] = [];
    for (let i = 0; i < 4; i++) {
      const row: Letter[] = [];
      for (let j = 0; j < 4; j++) {
        row.push({
          letter: alphabet[Math.floor(Math.random() * alphabet.length)],
          row: i,
          col: j,
          selected: false,
          hovered: false,
        });
      }
      gridArray.push(row);
    }
    setGrid(gridArray);
  };

  function onResults(results: any) {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext("2d");
      if (canvasCtx) {
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );

        // Check if a hand was detected
        if (
          results.multiHandLandmarks &&
          results.multiHandLandmarks.length > 0
        ) {
          const handLandmarks = results.multiHandLandmarks[0];
          const indexTip = handLandmarks[8]; // Index finger tip landmark

          // Map index finger tip to canvas coordinates
          const handX = indexTip.x * canvasRef.current.width;
          const handY = indexTip.y * canvasRef.current.height;

          // Draw the red dot at the hovering position on the game board
          canvasCtx.beginPath();
          canvasCtx.arc(handX, handY, 10, 0, 2 * Math.PI);
          canvasCtx.fillStyle = "red";
          canvasCtx.fill();

          // Detect fist and update hand state
          const isFistClosed = detectFistClosed(handLandmarks);
          setHandState(isFistClosed ? "Closed" : "Open");

          if (isFistClosed && !isSelecting) {
            setIsSelecting(true);
          } else if (!isFistClosed && isSelecting) {
            setIsSelecting(false);
            finalizeWord();
          }

          // Update hover effect based on index finger position
          updateHoverState(handX, handY);
        }
      }
    }
  }

  const detectFistClosed = (landmarks: any) => {
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const pinkyTip = landmarks[20];

    const distanceThumbToIndex = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2),
    );
    const distancePinkyToIndex = Math.sqrt(
      Math.pow(pinkyTip.x - indexTip.x, 2) +
        Math.pow(pinkyTip.y - indexTip.y, 2),
    );

    // If the distances are small, we assume the fist is closed
    return distanceThumbToIndex < 0.1 && distancePinkyToIndex < 0.1;
  };

  const updateHoverState = (x: number, y: number) => {
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => {
          const cellX = cell.col * 160 + 80;
          const cellY = cell.row * 120 + 60;

          const isHovered =
            Math.abs(cellX - x) < 40 && Math.abs(cellY - y) < 40;

          return {
            ...cell,
            hovered: isHovered,
            selected: isHovered && isSelecting ? true : cell.selected,
          };
        }),
      ),
    );
  };

  const finalizeWord = () => {
    const word = selectedLetters.join("");
    alert(`You formed the word: ${word}`);
    resetGame();
  };

  const resetGame = () => {
    setSelectedLetters([]);
    initializeGrid();
  };

  useEffect(() => {
    loadHandLandmarker();
    initializeGrid();
  }, []);

  useEffect(() => {
    if (videoRef.current && handLandmarker) {
      const camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await handLandmarker.send({
            image: videoRef.current as HTMLVideoElement,
          });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [handLandmarker]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Word Hunt - Hand Controlled</h1>
      <p>Selected Letters: {selectedLetters.join("")}</p>
      <p>Hand State: {handState}</p>

      {/* Video Display */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <video
          ref={videoRef}
          style={{
            width: "320px",
            height: "240px",
            border: "1px solid black",
          }}
        />
      </div>

      {/* Game Canvas */}
      <div
        style={{
          position: "relative",
          width: "640px",
          height: "480px",
          marginTop: "20px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />

        {/* Game Board */}
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            position: "relative",
            zIndex: 0,
          }}
        >
          {grid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    width: 80,
                    height: 80,
                    border: "1px solid gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: cell.selected
                      ? "lightgreen"
                      : cell.hovered
                        ? "lightblue"
                        : "white",
                    color: "black",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {cell.letter}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
