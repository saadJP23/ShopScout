import React from "react";

const LoadingSpinner = () => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(8,8,8,0.75)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
    backdropFilter: "blur(4px)",
  }}>
    <div style={{
      width: 52, height: 52,
      border: "3px solid #1e1e1e",
      borderTop: "3px solid #e5cba5",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  </div>
);

export default LoadingSpinner;
