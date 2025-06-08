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
    const starColors = ["#ffffff", "#ffd700", "#ffa500", "#add8e6", "#9be2e8"];
    const generated = Array.from({ length: 200 }, (_, i) => {
      const size = Math.random() * 2 + 1;
      return (
        <div
          key={`star-${i}`}
          className="absolute rounded-full blur-sm animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: starColors[Math.floor(Math.random() * starColors.length)],
            opacity: 0.3 + Math.random() * 0.4,
            animationDelay: `${Math.random() * 5}s`,
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
