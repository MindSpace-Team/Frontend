import React, { useEffect, useState, ReactNode } from "react";

type OrbitNodeProps = {
  centerX: number;
  centerY: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  initialAngle?: number;
  paused?: boolean;
  onContextMenu?: (x: number, y: number, e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  children?: ((x: number, y: number) => ReactNode) | ReactNode;
};

export default function OrbitNode({
  centerX,
  centerY,
  radius,
  speed,
  size,
  color,
  initialAngle = 0,
  paused = false,
  onContextMenu,
  children,
}: OrbitNodeProps) {
  const [angle, setAngle] = useState(initialAngle);

  useEffect(() => {
    if (paused) return;
    let running = true;
    let last = performance.now();
    function animate(now: number) {
      if (!running) return;
      const dt = (now - last) / 1000;
      setAngle((prev) => prev + speed * dt);
      last = now;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, [speed, paused]);

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        onContextMenu={onContextMenu ? (e) => onContextMenu(x, y, e) : undefined}
        style={{ cursor: "pointer" }}
      />
      {typeof children === "function" ? children(x, y) : children}
    </>
  );
}