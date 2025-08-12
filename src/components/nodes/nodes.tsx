import React, { useContext } from "react";
import { MindNode } from "@/types/mind-graph";
import StarNode from "./StarNode";
import { ViewBoxContext } from "@/contexts/ViewBoxContext";

interface NodesProps {
  nodes: { [id: number]: MindNode };
  onContextMenu?: (e: React.MouseEvent, nodeId: string) => void;
  onFocusNode?: (x: number, y: number) => void;
}

export default function Nodes({ nodes, onContextMenu, onFocusNode }: NodesProps) {
  const viewBox = useContext(ViewBoxContext);

  const stars = Object.values(nodes).filter(
    (n): n is MindNode & { x: number; y: number } => {
      if (n.type !== "star" || typeof n.x !== "number" || typeof n.y !== "number") {
        return false;
      }
      if (!viewBox) return true; // viewBox가 없으면 모든 노드를 렌더링

      const { x, y, w, h } = viewBox;
      const nodeX = n.x;
      const nodeY = n.y;
      const nodeRadius = n.radius || 50; // 기본 반경

      // 노드가 화면 밖에 있는지 확인
      const isVisible = 
        nodeX + nodeRadius > x &&
        nodeX - nodeRadius < x + w &&
        nodeY + nodeRadius > y &&
        nodeY - nodeRadius < y + h;

      return isVisible;
    }
  );

  return (
    <>
      {stars.map(star => (
        <StarNode key={star.id} star={star} nodes={nodes} onContextMenu={onContextMenu} onFocusNode={onFocusNode} />
      ))}
    </>
  );
}