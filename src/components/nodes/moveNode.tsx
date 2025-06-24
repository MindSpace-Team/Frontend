import React, { useRef, useState } from "react";
import { useMindGraphStore } from "@/store/mindGraphStore";

type MoveNodeProps = {
  node: { id: number; x: number; y: number; radius: number; color: string };
  onClick?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onContextMenu?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
};

export default function MoveNode({ node, onClick, onContextMenu }: MoveNodeProps) {
  const moveStar = useMindGraphStore(s => s.moveStar);
  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<SVGCircleElement>(null);

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
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      setMoved(true);
      const { x, y } = getSVGCoords(e);
      moveStar(node.id, x - offset.x, y - offset.y);
    };
    const onMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, offset, node.id, moveStar]);

  const handleClick = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    if (moved) return;
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <circle
      ref={ref}
      cx={node.x}
      cy={node.y}
      r={node.radius}
      fill={node.color}
      stroke="#fff"
      strokeWidth={3}
      onMouseDown={onMouseDown}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    />
  );
}
