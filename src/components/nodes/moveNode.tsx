import React, { useRef, useState } from "react";
import { useMindGraphStore } from "@/store/mindGraphStore";

type MoveNodeProps = {
  node: { id: number; x: number; y: number; radius: number; color: string };
  onClick?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onContextMenu?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onFocusNode?: (x: number, y: number) => void;
};

export default function MoveNode({ node, onClick, onContextMenu, onFocusNode }: MoveNodeProps) {
  const moveStar = useMindGraphStore(s => s.moveStar);
  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<SVGCircleElement>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
    <g>
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
      {/* 별 본체 */}
      <circle
        ref={ref}
        cx={node.x}
        cy={node.y}
        r={node.radius}
        fill={`url(#star-gradient-${node.id})`}
        onMouseDown={onMouseDown}
        onClick={handleClick}
        onContextMenu={onContextMenu}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      />
      {/* 반짝임 효과 (작은 흰 점) */}
      <circle
        cx={node.x + node.radius * 0.5}
        cy={node.y - node.radius * 0.3}
        r={node.radius * 0.13}
        fill="#fff"
        opacity={0.7}
        style={{ pointerEvents: "none" }}
      />
      <defs>
        <radialGradient id={`star-gradient-${node.id}`}>
          <stop offset="0%" stopColor="#fffbe7" />
          <stop offset="60%" stopColor={node.color} />
          <stop offset="100%" stopColor="#0000" />
        </radialGradient>
      </defs>
    </g>
  );
}
