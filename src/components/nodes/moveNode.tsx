import React, { useRef, useState, useEffect } from "react";
import { useMindGraphStore } from "@/store/mindGraphStore";

type MoveNodeProps = {
  node: { id: number; x: number; y: number; radius: number; color: string };
  onClick?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onContextMenu?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onFocusNode?: (x: number, y: number) => void;
};

// node.color에서 밝은색/중간색/어두운색 파생
function colorLerp(hex: string, amt: number) {
  // hex: #rrggbb, amt: -1~1 (음수면 어둡게, 양수면 밝게)
  let [r, g, b] = hex.replace('#', '').match(/.{2}/g)!.map(x => parseInt(x, 16));
  if (amt > 0) {
    r += (255 - r) * amt;
    g += (255 - g) * amt;
    b += (255 - b) * amt;
  } else {
    r *= 1 + amt;
    g *= 1 + amt;
    b *= 1 + amt;
  }
  r = Math.round(Math.max(0, Math.min(255, r)));
  g = Math.round(Math.max(0, Math.min(255, g)));
  b = Math.round(Math.max(0, Math.min(255, b)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function MoveNode({ node, onClick, onContextMenu, onFocusNode }: MoveNodeProps) {
  const moveStar = useMindGraphStore(s => s.moveStar);
  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<SVGCircleElement>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // coronaTime: corona, 표면, 자전 모두에 사용
  const [coronaTime, setCoronaTime] = useState(0);
  useEffect(() => {
    let animId: number;
    function animate() {
      setCoronaTime(performance.now() / 1000);
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);
  // corona(Glow) path
  const CORONA_POINTS = 48;
  const CORONA_BASE = node.radius * 1.13;
  const CORONA_AMPL = node.radius * 0.13;
  const [coronaSeeds] = useState(() => Array.from({ length: CORONA_POINTS }, () => Math.random()));
  function coronaPath(t: number) {
    let d = '';
    for (let i = 0; i < CORONA_POINTS; i++) {
      const angle = (i / CORONA_POINTS) * Math.PI * 2;
      // corona 외곽이 더 일렁이도록 시간 기반 파형을 추가
      const baseWave = 0.5 + 0.5 * Math.sin(t * 0.13 + i * 0.9) + 0.13 * Math.sin(t * 0.7 + i * 0.5);
      const spike = 0.18 * coronaSeeds[i] * Math.sin(t * 0.19 + i * 1.7);
      const r = CORONA_BASE + CORONA_AMPL * (baseWave + spike);
      const x = node.x + Math.cos(angle) * r;
      const y = node.y + Math.sin(angle) * r;
      d += (i === 0 ? 'M' : 'L') + x + ',' + y + ' ';
    }
    d += 'Z';
    return d;
  }
  // 표면 흐름 baseFrequency
  const baseFreqX = 0.09
    + 0.007 * Math.sin(coronaTime * 0.07)
    + 0.003 * Math.sin(coronaTime * 0.13 + 1.7);
  const baseFreqY = 0.13
    + 0.006 * Math.cos(coronaTime * 0.09)
    + 0.004 * Math.sin(coronaTime * 0.11 + 2.3);

  const getSVGCoords = (e: { clientX: number; clientY: number }) => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const x =
      ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y =
      ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    return { x, y };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getSVGCoords(e);
    setOffset({ x: x - node.x, y: y - node.y });
    setDragging(true);
    setMoved(false);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      setMoved(true);
      const { x, y } = getSVGCoords(e);
      moveStar(node.id, x - offset.x, y - offset.y);
    };
    const onMouseUp = (e: MouseEvent) => {
      setDragging(false);
      // 클릭(이동량 5px 이하)이면 중심이동/줌리셋
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 5 && onFocusNode) {
        onFocusNode(node.x, node.y);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, offset, node.id, moveStar, onFocusNode, node.x, node.y]);

  const handleClick = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    if (moved) return;
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <g
      transform={`rotate(${(coronaTime * 6) % 360}, ${node.x}, ${node.y})`}
    >
      {/* Glow 효과 */}
      <circle
        ref={ref}
        cx={node.x}
        cy={node.y}
        r={node.radius * 1.5}
        fill={node.color}
        opacity={0.25}
        filter="blur(6px)"
        style={{ pointerEvents: "none" }}
      />
      <defs>
        <radialGradient id={`star-glow-${node.id}`}>
          <stop offset="0%" stopColor={colorLerp(node.color, 0.7)} stopOpacity="0.7" />
          <stop offset="97%" stopColor={node.color} stopOpacity="0.09" />
          <stop offset="100%" stopColor={colorLerp(node.color, -0.3)} stopOpacity="0" />
        </radialGradient>
        <filter id={`lava-filter-${node.id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="turbulence" baseFrequency={`${baseFreqX * 1.1} ${baseFreqY * 1.1}`} numOctaves="3" seed={node.id} result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="13" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {/* corona(Glow) path - 태양 본체보다 아래에 렌더 */}
      <path
        d={coronaPath(coronaTime)}
        fill={`url(#star-glow-${node.id})`}
        opacity={0.28}
        style={{ filter: "blur(5px)", pointerEvents: "none" }}
      />
      {/* 태양 본체: 용암 표면 질감 */}
      <circle
        ref={ref}
        cx={node.x}
        cy={node.y}
        r={node.radius}
        fill={`url(#star-gradient-${node.id})`}
        filter={`url(#lava-filter-${node.id})`}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onClick={handleClick}
        onContextMenu={onContextMenu}
      />
      <defs>
        <radialGradient id={`star-gradient-${node.id}`}>
          <stop offset="0%" stopColor={colorLerp(node.color, 0.8)} />
          <stop offset="40%" stopColor={colorLerp(node.color, 0.3)} />
          <stop offset="70%" stopColor={node.color} />
          <stop offset="100%" stopColor={colorLerp(node.color, -0.4)} stopOpacity="0.7" />
        </radialGradient>
      </defs>
    </g>
  );
}
