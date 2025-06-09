"use client";
import { useEffect, useState } from "react";
import { JSX } from "react";

type ShootingStar = {
  id: number;
  top: number;
  left: number;
};

export default function StarsBackground() {
  const [stars, setStars] = useState<JSX.Element[]>([]);
  const [shootings, setShootings] = useState<ShootingStar[]>([]);

  // 별 생성
  useEffect(() => {
    const starColors = ["#fff", "#ffd700", "#ffbb99", "#b8e0ff", "#caf6ff"];
    const generated = Array.from({ length: 160 }, (_, i) => {
      const size = Math.random() * 2 + 1.2;
      const opacity = 0.7 + Math.random() * 0.3;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const glow = size > 2
        ? `0 0 8px 2px ${color}, 0 0 24px 4px ${color}77`
        : `0 0 4px 1px ${color}`;
      return (
        <div
          key={`star-${i}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            opacity,
            boxShadow: glow,
            animationDelay: `${Math.random() * 5}s`,
            filter: size > 2 ? "blur(0.5px)" : "none", // 큰 별만 아주 약하게 blur
          }}
        />
      );
    });
    setStars(generated);
  }, []);

  // 별똥별 생성
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const top = Math.random() * 70;
      const left = Math.random() * 80;

      setShootings(prev => [...prev, { id, top, left }]);

      setTimeout(() => {
        setShootings(prev => prev.filter(s => s.id !== id));
      }, 1500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />
      
      {/* 별 */}
      {stars}

      {/* 별똥별 */}
      {shootings.map(({ id, top, left }) => (
        <div
          key={`shooting-${id}`}
          className="absolute h-0.5 w-40 opacity-80 animate-shooting"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            background: "linear-gradient(to left, white, transparent)",
            transformOrigin: "left center",
          }}
        />
      ))}
    </div>
  );
}
