import React from "react";
import { MindNode } from "@/store/mindGraphStore";
import OrbitNode from "@/components/controls/Orbit";
import { usePopupStore } from "@/store/popupStore";
import MoveNode from "./moveNode";

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

  const STAR_DIST_FACTOR = 2.0;  // 별 반지름에 곱해 첫 행성과 거리 확보
  const PLANET_MIN_GAP = 300;    // 행성 간 최소 거리

  const SAT_DIST_FACTOR = 1.0;   // 위성 거리 계산용 상수
  const SAT_MIN_GAP = 80;        // 위성 간 최소 거리

  return (
    <>
      {stars.map(star => {
        const starX = star.x;
        const starY = star.y;
        const planetIds = star.children;

        let planetAccRadius = 0;

        return (
          <React.Fragment key={star.id}>
            <MoveNode
              node={star}
              onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
                setPopup({ id: star.id, x: star.x, y: star.y });
              }}
            />

            {planetIds.map((planetId, planetIdx) => {
              const planet = nodes[planetId];
              if (!planet) return null;

              const prevPlanet = planetIdx > 0 ? nodes[planetIds[planetIdx - 1]] : null;

              if (planetIdx === 0) {
                planetAccRadius =
                  star.radius * STAR_DIST_FACTOR + planet.radius + PLANET_MIN_GAP;
              } else if (prevPlanet) {
                planetAccRadius +=
                  prevPlanet.radius + planet.radius + PLANET_MIN_GAP;
              }

              const speed = planetBaseSpeed * Math.pow(planetDecay, planetIdx);

              return (
                <OrbitNode
                  key={planet.id}
                  centerX={starX}
                  centerY={starY}
                  radius={planetAccRadius}
                  speed={speed}
                  size={planet.radius}
                  color={planet.color}
                  initialAngle={planet.initialAngle ?? Math.random() * Math.PI * 2}
                  paused={isPaused(planet.id)}
                  onContextMenu={(planetX, planetY, e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPopup({ id: planet.id, x: planetX, y: planetY });
                  }}
                >
                  {(planetX, planetY) => {
                    const satIds = planet.children;
                    let satAccRadius = 0;

                    return satIds.map((satId, satIdx) => {
                      const satellite = nodes[satId];
                      if (!satellite) return null;

                      const prevSat = satIdx > 0 ? nodes[satIds[satIdx - 1]] : null;

                      if (satIdx === 0) {
                        satAccRadius =
                          planet.radius * SAT_DIST_FACTOR + satellite.radius + SAT_MIN_GAP;
                      } else if (prevSat) {
                        satAccRadius +=
                          prevSat.radius + satellite.radius + SAT_MIN_GAP;
                      }

                      const satSpeed = satBaseSpeed * Math.pow(satDecay, satIdx);

                      return (
                        <OrbitNode
                          key={satId}
                          centerX={planetX}
                          centerY={planetY}
                          radius={satAccRadius}
                          speed={satSpeed}
                          size={satellite.radius}
                          color={satellite.color}
                          initialAngle={satellite.initialAngle ?? Math.random() * Math.PI * 2}
                          paused={isPaused(satId)}
                          onContextMenu={(satX, satY, e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPopup({ id: satId, x: satX, y: satY });
                          }}
                        />
                      );
                    });
                  }}
                </OrbitNode>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}