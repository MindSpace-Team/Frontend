import React from "react";
import { MindNode, NodeId } from "@/components/controls/useMindGraph";

type NodesProps = {
  nodes: { [id: number]: MindNode };
  onNodeClick: (nodeId: NodeId) => void;
};

export default function Nodes({ nodes, onNodeClick }: NodesProps) {
  // 연결선
  const lines = Object.values(nodes).flatMap(node =>
    node.parentId
      ? [
          <line
            key={`line-${node.id}`}
            x1={nodes[node.parentId]?.x}
            y1={nodes[node.parentId]?.y}
            x2={node.x}
            y2={node.y}
            stroke="#aaa"
            strokeWidth={2}
            opacity={0.55}
          />,
        ]
      : []
  );
  // 노드 원
  return (
    <>
      {lines}
      {Object.values(nodes).map(node => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.radius}
          fill={
            node.type === "star"
              ? "#ffd700"
              : node.type === "planet"
              ? "#3af"
              : "#9ff"
          }
          stroke="#fff"
          strokeWidth={3}
          onClick={() => onNodeClick(node.id)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </>
  );
}
