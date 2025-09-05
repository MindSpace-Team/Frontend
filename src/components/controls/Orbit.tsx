import React, { useEffect, useState} from "react";

type OrbitNodeProps = {
  centerX: number;
  centerY: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  initialAngle?: number;
  paused?: boolean;
  onClick?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onContextMenu?: (x: number, y: number, e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onFocusNode?: (x: number, y: number) => void;
  children?: ((x: number, y: number) => React.ReactNode) | React.ReactNode;
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
  onClick,
  onContextMenu,
  onFocusNode,
  children,
}: OrbitNodeProps) {
  const [angle, setAngle] = useState(initialAngle);
  const startPos = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const xyRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const x = centerX + radius * 1.5 * Math.cos(angle);
  const y = centerY + radius * 0.75 * Math.sin(angle);
  xyRef.current = { x, y };

  React.useEffect(() => {
    if (!dragging) return;
    const onMouseUp = (e: MouseEvent) => {
      setDragging(false);
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 5 && onFocusNode) {
        onFocusNode(xyRef.current.x, xyRef.current.y);
      }
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [dragging, onFocusNode]);

  return (
    <>
      {/* 행성: size>15, 위성: size<=15 */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={`url(#planet-gradient-${centerX}-${centerY}-${radius}-${size})`}
        onClick={onClick}
        onContextMenu={onContextMenu ? (e) => onContextMenu(x, y, e) : undefined}
        onMouseDown={e => {
          if (e.button !== 0) return; // 좌클릭만 드래그
          setDragging(true);
          startPos.current = { x: e.clientX, y: e.clientY };
        }}
        style={{ cursor: "pointer" }}
      />
      <defs>
        <radialGradient id={`planet-gradient-${centerX}-${centerY}-${radius}-${size}`}>
          <stop offset="0%" stopColor={size > 15 ? color : '#eee'} stopOpacity="1"/>
          <stop offset="60%" stopColor={size > 15 ? color : '#bbb'} stopOpacity="1"/>
          <stop offset="100%" stopColor={size > 15 ? '#222' : '#888'} stopOpacity="1"/>
        </radialGradient>
      </defs>
      {typeof children === "function" ? children(x, y) : children}
    </>
  );
}