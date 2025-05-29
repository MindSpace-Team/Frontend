import React, { useEffect, useState, ReactNode } from "react";

type OrbitNodeProps = {
  centerX: number;
  centerY: number;
  radius: number;      // 공전 반지름(거리)
  speed: number;       // 라디안/초(공전속도)
  size: number;        // 원 크기
  color: string;
  initialAngle?: number;
  onClick?: () => void;
  children?: ((x: number, y: number) => ReactNode) | ReactNode; // ★ 함수도, ReactNode도 지원
};

export default function OrbitNode({
  centerX,
  centerY,
  radius,
  speed,
  size,
  color,
  initialAngle = 0,
  onClick,
  children,
}: OrbitNodeProps) {
  const [angle, setAngle] = useState(initialAngle);

  useEffect(() => {
    let running = true;
    let last = performance.now();
    function animate(now: number) {
      if (!running) return;
      const dt = (now - last) / 1000;
      setAngle(prev => prev + speed * dt);
      last = now;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, [speed]);

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      />
      {
        typeof children === "function"
          ? (children as (x: number, y: number) => ReactNode)(x, y)
          : children
      }
    </>
  );
}