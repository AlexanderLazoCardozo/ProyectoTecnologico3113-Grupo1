import React from "react";
import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();
  console.log(progress);
  return (
    <Html
      center
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Spinner animation */}
        <div
          style={{
            width: "64px",
            height: "64px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />

        {/* Progress text */}
        <p
          style={{
            marginTop: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          {progress !== 100 ? "Completed" : `${Math.floor(progress)}%`}
        </p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Html>
  );
};

export default CanvasLoader;
