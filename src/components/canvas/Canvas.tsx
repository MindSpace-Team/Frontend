"use client";
import React, { useRef, useState, useEffect } from "react";
import { useBackgroundStore } from "@/store/backgroundStore";
import Image from "next/image";

const INIT_W = 1920;
const INIT_H = 1080;
const MIN_SCALE = 0.001;
const MAX_SCALE = 50;

type CanvasProps = {
  children: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  onCanvasContextMenu?: (e: React.MouseEvent<SVGSVGElement>) => void;
};

export default function Canvas({ children, onCanvasContextMenu }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: INIT_W, h: INIT_H });
  const [dragging, setDragging] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const last = useRef({ x: 0, y: 0, viewBoxX: 0, viewBoxY: 0 });
  const [size, setSize] = useState({ width: INIT_W, height: INIT_H });
  const currentBackground = useBackgroundStore(s => s.currentBackground);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpaceDown(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpaceDown(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const resize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      e.preventDefault();

      const svg = svgRef.current;
      if (!svg) return;

      const svgRect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * viewBox.w + viewBox.x;
      const mouseY = ((e.clientY - svgRect.top) / svgRect.height) * viewBox.h + viewBox.y;

      const scaleBy = 1.08;
      let newW = viewBox.w * (e.deltaY > 0 ? scaleBy : 1 / scaleBy);
      let newH = viewBox.h * (e.deltaY > 0 ? scaleBy : 1 / scaleBy);

      const newScale = INIT_W / newW;
      if (newScale < MIN_SCALE) {
        newW = INIT_W / MIN_SCALE;
        newH = INIT_H / MIN_SCALE;
      }
      if (newScale > MAX_SCALE) {
        newW = INIT_W / MAX_SCALE;
        newH = INIT_H / MAX_SCALE;
      }

      const kx = (mouseX - viewBox.x) / viewBox.w;
      const ky = (mouseY - viewBox.y) / viewBox.h;
      const newX = mouseX - newW * kx;
      const newY = mouseY - newH * ky;

      setViewBox({ x: newX, y: newY, w: newW, h: newH });
    };

    // ✅ window에서 휠 이벤트 감지 (svg 바깥에서도 작동)
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [viewBox]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!isSpaceDown) return;
    setDragging(true);
    last.current = {
      x: e.clientX,
      y: e.clientY,
      viewBoxX: viewBox.x,
      viewBoxY: viewBox.y,
    };
    if (svgRef.current) svgRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = ((e.clientX - last.current.x) / window.innerWidth) * viewBox.w;
    const dy = ((e.clientY - last.current.y) / window.innerHeight) * viewBox.h;
    setViewBox({
      ...viewBox,
      x: last.current.viewBoxX - dx,
      y: last.current.viewBoxY - dy,
    });
  };

  const onMouseUp = () => {
    setDragging(false);
    if (svgRef.current) svgRef.current.style.cursor = isSpaceDown ? "grab" : "default";
  };

  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.style.cursor = isSpaceDown ? (dragging ? "grabbing" : "grab") : "crosshair";
  }, [isSpaceDown, dragging]);

  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* ✅ 배경 이미지 */}
      <Image
        src={currentBackground}
        alt="background"
        fill
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* ✅ SVG 영역 */}
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        width={size.width}
        height={size.height}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onContextMenu={onCanvasContextMenu}
        tabIndex={0}
      >
        {children.props.children}
      </svg>

      {/* 도움말 */}
      <span
        style={{
          color: "#fff",
          position: "fixed",
          left: 20,
          bottom: 20,
          fontSize: 14,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        [스페이스] + 드래그 : 이동 / [Shift+휠] : 확대·축소
      </span>
    </div>
  );
}