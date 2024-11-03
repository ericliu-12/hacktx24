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
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [handState, setHandState] = useState("Open");

  const isSelectingRef = useRef(false);
  const selectedRef = useRef<Letter[]>([]);

  useEffect(() => {
    selectedRef.current = selectedLetters;
  }, [selectedLetters]);

  const loadHandLandmarker = async () => {
    const handsModule = await import("@mediapipe/hands");
    const hands = new handsModule.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
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

        if (
          results.multiHandLandmarks &&
          results.multiHandLandmarks.length > 0
        ) {
          const handLandmarks = results.multiHandLandmarks[0];
          const middle = handLandmarks[9];

          let handX =
            canvasRef.current.width - middle.x * canvasRef.current.width;
          let handY = middle.y * canvasRef.current.height;

          // Lock position when fist is closed
          const isFistClosed = detectFistClosed(handLandmarks);
          if (isFistClosed) {
            setHandState("Closed");
            isSelectingRef.current = true;
          } else {
            setHandState("Open");
            isSelectingRef.current = false;
          }

          // Draw the red dot
          canvasCtx.beginPath();
          canvasCtx.arc(handX, handY, 8, 0, 2 * Math.PI);
          canvasCtx.fillStyle = "red";
          canvasCtx.fill();

          // Update hover state
          updateHoverState(handX, handY);

          if (!isFistClosed) {
            if (selectedRef.current.length >= 3) {
              validateWord();
            }
            setSelectedLetters([]);
          }
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

    return distanceThumbToIndex < 0.15 && distancePinkyToIndex < 0.15;
  };

  const updateHoverState = (x: number, y: number) => {
    setGrid((prevGrid) =>
      prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Calculate cell width and height based on grid size (4x4 in this case)
          const cellWidth = 80;
          const cellHeight = 80;

          // Calculate the top-left corner of the current cell
          const cellX = (colIndex + 2) * cellWidth;
          const cellY = rowIndex * cellHeight;

          // Determine if the hand coordinates (x, y) are within the cell's bounding box
          const isHovered =
            x >= cellX &&
            x < cellX + cellWidth &&
            y >= cellY &&
            y < cellY + cellHeight;

          if (isHovered && isSelectingRef.current) {
            // Add letter to selectedLetters if it's not already included
            setSelectedLetters((prevLetters) => {
              if (
                !prevLetters.some(
                  (prevLetter) =>
                    prevLetter.row === cell.row && prevLetter.col === cell.col,
                )
              ) {
                return [...prevLetters, cell]; // Add the letter if it's not already selected
              }
              return prevLetters; // No change if it's already included
            });
          }

          return {
            ...cell,
            hovered: isHovered,
            selected: isSelectingRef.current
              ? isHovered
                ? true
                : cell.selected
              : false,
          };
        }),
      ),
    );
  };

  const checkIfWordExists = async (word: any) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    if (!response.ok) {
      // Handle error (e.g., word not found)
      return false;
    }
    const data = await response.json();
    return data.length > 0; // Returns true if the word exists
  };

  // Example usage
  const validateWord = async () => {
    const word = selectedRef.current.map((letter) => letter.letter).join("");
    const isValidWord = await checkIfWordExists(word);
    if (isValidWord) {
      alert(`${word} is a valid word!`);
    } else {
      alert(`${word} is not a valid word.`);
    }
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
      <p>
        Selected Letters:{" "}
        {selectedLetters.map((letter) => letter.letter).join("")}
      </p>
      <p>Hand State: {handState}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <video
          ref={videoRef}
          style={{ width: "320px", height: "240px", border: "1px solid black" }}
        />
      </div>

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
