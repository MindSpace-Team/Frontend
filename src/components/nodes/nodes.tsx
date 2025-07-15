import React from "react";
import { MindNode } from "@/types/mind-graph";
import StarNode from "./StarNode";

interface NodesProps {
  nodes: { [id: number]: MindNode };
  onContextMenu?: (e: React.MouseEvent, nodeId: string) => void;
  onFocusNode?: (x: number, y: number) => void;
}

export default function Nodes({ nodes, onContextMenu, onFocusNode }: NodesProps) {
  const stars = Object.values(nodes).filter(
    (n): n is MindNode & { x: number; y: number } =>
      n.type === "star" && typeof n.x === "number" && typeof n.y === "number"
  );

  return (
    <>
      {stars.map(star => (
        <StarNode key={star.id} star={star} nodes={nodes} onContextMenu={onContextMenu} onFocusNode={onFocusNode} />
      ))}
    </>
  );
}