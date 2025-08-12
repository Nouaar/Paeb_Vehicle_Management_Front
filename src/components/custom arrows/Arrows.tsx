import React from "react";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <button
    className={className}
    style={{
      ...style,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0,0,0,0.4)",
      borderRadius: "50%",
      width: 40,
      height: 40,
      right: 15,
      zIndex: 10,
      transition: "background-color 0.3s ease",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}
    onClick={onClick}
    aria-label="Next Slide"
    onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
    onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.4)")}
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <button
    className={className}
    style={{
      ...style,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0,0,0,0.4)",
      borderRadius: "50%",
      width: 40,
      height: 40,
      left: 15,
      zIndex: 10,
      transition: "background-color 0.3s ease",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}
    onClick={onClick}
    aria-label="Previous Slide"
    onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
    onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.4)")}
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);
