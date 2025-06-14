"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface StarProps {
  x: number;
  y: number;
  prev: { x: number; y: number }[];
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

interface StarBackgroundProps {
  starDensity?: number;
  className?: string;
}

const WARP_TOTAL = 1000; // 총 1초
const WARP_IN = 200;     // 0.2초 (가속)
const WARP_CONST = 600;  // 0.6초 (최대)
const WARP_OUT = 200;    // 0.2초 (감속)
const WARP_FAST = 25;    // 최대 속도
const WARP_SLOW = 2;     // 최소 속도

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const [initialStars, setInitialStars] = useState<StarProps[]>([]);
  const [warpMode, setWarpMode] = useState(false);
  const warpStartTime = useRef<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // warpMode 트리거용 커스텀 이벤트 리스너
  useEffect(() => {
    const handler = () => {
      // 별 이동 시작
      setWarpMode(true);
      warpStartTime.current = performance.now();
      setTimeout(() => {
        setWarpMode(false);
        // 별 상태를 초기값으로 리셋(잔상도 삭제)
        setStars(initialStars.map(star => ({
          ...star,
          prev: [],
        })));
      }, WARP_TOTAL);
    };
    window.addEventListener("star-warp", handler);
    return () => window.removeEventListener("star-warp", handler);
  }, [initialStars]);

  // 별 생성 함수
  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      return Array.from({ length: numStars }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          prev: [],
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() < 0.7 ? 0.5 + Math.random() * 0.5 : null,
        };
      });
    },
    [starDensity]
  );

  // 별 상태 초기화 (화면 리사이즈 등)
  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        const newStars = generateStars(width, height);
        setStars(newStars);
        setInitialStars(newStars.map(star => ({ ...star, prev: [] })));
      }
    };
    updateStars();
    const resizeObserver = new ResizeObserver(updateStars);
    const canvas = canvasRef.current;
    if (canvas) resizeObserver.observe(canvas);
    return () => {
      if (canvas) resizeObserver.unobserve(canvas);
    };
  }, [generateStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2;

    const getWarpSpeed = () => {
      if (!warpMode || warpStartTime.current == null) return 0;
      const now = performance.now();
      const t = now - warpStartTime.current;
      if (t < 0) return 0;
      if (t < WARP_IN) {
        // 가속구간: 선형 Interpolation (최소→최대)
        return WARP_SLOW + (WARP_FAST - WARP_SLOW) * (t / WARP_IN);
      }
      if (t < WARP_IN + WARP_CONST) {
        // 최대속도 구간
        return WARP_FAST;
      }
      if (t < WARP_TOTAL) {
        // 감속구간: 선형 Interpolation (최대→최소)
        return WARP_FAST - (WARP_FAST - WARP_SLOW) * ((t - WARP_IN - WARP_CONST) / WARP_OUT);
      }
      return 0;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const warpSpeed = getWarpSpeed();

      stars.forEach((star) => {
        // 별 이동 (warpMode일 때만)
        if (warpMode && warpSpeed > 0) {
          const dx = star.x - cx;
          const dy = star.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const vx = (dx / dist) * warpSpeed;
          const vy = (dy / dist) * warpSpeed;
          star.prev.push({ x: star.x, y: star.y });
          if (star.prev.length > 12) star.prev.shift();
          star.x += vx;
          star.y += vy;
          // 벗어나면 별 재배치(중앙 근처에서 새로 시작)
          if (
            star.x < 0 ||
            star.x > width ||
            star.y < 0 ||
            star.y > height
          ) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * (Math.min(width, height) * 0.12);
            star.x = cx + Math.cos(angle) * r;
            star.y = cy + Math.sin(angle) * r;
            star.prev = [];
          }
        }

        // warpMode: 선 잔상
        if (warpMode && star.prev.length > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(star.prev[0].x, star.prev[0].y);
          for (let i = 1; i < star.prev.length; i++) {
            ctx.lineTo(star.prev[i].x, star.prev[i].y);
          }
          ctx.lineTo(star.x, star.y);
          const grad = ctx.createLinearGradient(
            star.prev[0].x,
            star.prev[0].y,
            star.x,
            star.y
          );
          grad.addColorStop(0, `rgba(255,255,255,0)`);
          grad.addColorStop(1, `rgba(255,255,255,${star.opacity})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = star.radius * 2.2;
          ctx.stroke();
          ctx.restore();
        }

        // 평소엔 점
        if (!warpMode) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars, warpMode]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full absolute inset-0", className)}
    />
  );
};
