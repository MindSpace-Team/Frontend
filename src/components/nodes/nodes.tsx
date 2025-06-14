import React from "react";
import { MindNode } from "@/types/mind-graph";
import StarNode from "./StarNode";

export type NodesProps = {
  nodes: { [id: number]: MindNode };
};

export default function Nodes({ nodes }: NodesProps) {
  const stars = Object.values(nodes).filter(
    (n): n is MindNode & { x: number; y: number } =>
      n.type === "star" && typeof n.x === "number" && typeof n.y === "number"
  );

  return (
    <>
      {stars.map(star => (
        <StarNode key={star.id} star={star} nodes={nodes} />
      ))}
    </>
  );
}