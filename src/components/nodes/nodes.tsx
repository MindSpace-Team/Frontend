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

  // 속도 공식, 멀어질수록 더 느려짐
  const planetBaseSpeed = 0.3;
  const planetDecay = 0.8;
  const satBaseSpeed = 0.7;
  const satDecay = 0.75;

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
            // ★ 지수적 감소 적용
            const speed = planetBaseSpeed * Math.pow(planetDecay, planetIdx);
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
                    // ★ 지수적 감소 적용
                    const satSpeed = satBaseSpeed * Math.pow(satDecay, satIdx);
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