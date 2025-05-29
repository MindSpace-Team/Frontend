import React from "react";
import { MindNode, NodeId } from "@/store/mindGraphStore";
import OrbitNode from "@/components/controls/Orbit";

type NodesProps = {
  nodes: { [id: number]: MindNode };
  onNodeClick: (nodeId: NodeId) => void;
};

export default function Nodes({ nodes, onNodeClick }: NodesProps) {
  const stars = Object.values(nodes).filter(
    (n): n is MindNode & { x: number; y: number } =>
      n.type === "star" && typeof n.x === "number" && typeof n.y === "number"
  );

  return (
    <>
      {stars.map(star => (
        <React.Fragment key={star.id}>
          <circle
            cx={star.x}
            cy={star.y}
            r={star.radius}
            fill="#ffd700"
            stroke="#fff"
            strokeWidth={3}
            onClick={() => onNodeClick(star.id)}
            style={{ cursor: "pointer" }}
          />
          {star.children.map((planetId, planetIdx) => {
            const planet = nodes[planetId];
            const base = 140;
            const step = 90;
            const radius = base + step * planetIdx;
            const speed = 0.3 + 0.02 * planetIdx;
            return (
              <OrbitNode
                key={planet.id}
                centerX={star.x}
                centerY={star.y}
                radius={radius}
                speed={speed}
                size={planet.radius}
                color="#3af"
                initialAngle={planet.initialAngle ?? (Math.random() * Math.PI * 2)}
                onClick={() => onNodeClick(planet.id)}
              >
                {(planetX, planetY) =>
                  planet.children.map((satId, satIdx) => {
                    const satellite = nodes[satId];
                    const baseS = 64;
                    const stepS = 48;
                    const satRadius = baseS + stepS * satIdx;
                    const satSpeed = 0.7 + 0.05 * satIdx;
                    return (
                      <OrbitNode
                        key={satId}
                        centerX={planetX}
                        centerY={planetY}
                        radius={satRadius}
                        speed={satSpeed}
                        size={satellite.radius}
                        color="#9ff"
                        initialAngle={satellite.initialAngle ?? (Math.random() * Math.PI * 2)}
                        onClick={() => onNodeClick(satId)}
                      />
                    );
                  })
                }
              </OrbitNode>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
}
