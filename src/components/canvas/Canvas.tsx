"use client";

import React, { useRef, useState, useEffect } from "react";

type CanvasProps = {
  children?: React.ReactNode;
};

const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const isSpacePressed = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const panStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 스페이스 키 감지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = true;
        if (containerRef.current) containerRef.current.style.cursor = "grab";
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = false;
        if (containerRef.current) containerRef.current.style.cursor = "grab";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 이동
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0 && isSpacePressed.current) {
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { ...offset };
      if (containerRef.current) containerRef.current.style.cursor = "grabbing";
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && dragStart.current && panStart.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset({
        x: panStart.current.x + dx,
        y: panStart.current.y + dy,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    dragStart.current = null;
    panStart.current = null;
    if (containerRef.current) {
      containerRef.current.style.cursor = isSpacePressed.current ? "grab" : "grab";
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        let next = scale - e.deltaY * 0.001 * scale;
        if (next < 0.01) next = 0.01;
        if (next > 40) next = 40;

        setScale(next);
      }
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative"
      style={{
        background: "radial-gradient(ellipse at center, #222 0%, #000 100%)",
        overflow: "hidden",
        cursor: "grab",
        userSelect: "none",
      }}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          width: "100vw",
          height: "100vh",
          transition: dragging ? "none" : "transform 0.12s cubic-bezier(.4,2,.8,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 중앙에 흰 글씨 */}
        <h1 style={{
          color: "#fff",
          fontSize: "3rem",
          fontWeight: "bold",
          letterSpacing: "0.12em",
          textShadow: "0 2px 12px #000"
        }}>
          Mind Space
        </h1>
        {children}
      </div>
    </div>
  );
};

export default Canvas;