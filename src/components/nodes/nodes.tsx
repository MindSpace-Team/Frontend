import React from "react";
import { MindNode } from "@/store/mindGraphStore";
import OrbitNode from "@/components/controls/Orbit";
import { usePopupStore } from "@/store/popupStore";

type NodesProps = {
  nodes: { [id: number]: MindNode };
};

function findRootId(id: number, nodes: { [id: number]: MindNode }): number {
  let cur = nodes[id];
  while (cur && cur.parentId !== undefined && cur.parentId !== null) {
    cur = nodes[cur.parentId];
  }
  return cur ? cur.id : id;
}

export default function Nodes({ nodes }: NodesProps) {
  const setPopup = usePopupStore(s => s.setPopup);
  const pausedRootIds = usePopupStore(s => s.pausedRootIds);

  function isPaused(nodeId: number): boolean {
    const rootId = findRootId(nodeId, nodes);
    return pausedRootIds.has(rootId);
  }

  const stars = Object.values(nodes).filter(
    (n): n is MindNode & { x: number; y: number } =>
      n.type === "star" && typeof n.x === "number" && typeof n.y === "number"
  );

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
            onContextMenu={e => {
              e.preventDefault();
              e.stopPropagation();
              setPopup({ id: star.id, x: star.x, y: star.y });
            }}
            style={{ cursor: "pointer" }}
          />
          {star.children.map((planetId, planetIdx) => {
            const planet = nodes[planetId];
            const base = 400;
            const step = 200;
            const radius = base + step * planetIdx;
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
                initialAngle={planet.initialAngle ?? Math.random() * Math.PI * 2}
                paused={isPaused(planet.id)}
                onContextMenu={(planetX, planetY, e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPopup({ id: planet.id, x: planetX, y: planetY });
                }}
              >
                {(planetX, planetY) =>
                  planet.children.map((satId, satIdx) => {
                    const satellite = nodes[satId];
                    const baseS = 80;
                    const stepS = 40;
                    const satRadius = baseS + stepS * satIdx;
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
                        initialAngle={satellite.initialAngle ?? Math.random() * Math.PI * 2}
                        paused={isPaused(satId)}
                        onContextMenu={(satX, satY, e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPopup({ id: satId, x: satX, y: satY });
                        }}
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
