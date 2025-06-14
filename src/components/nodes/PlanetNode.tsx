import React from "react";
import { MindNode } from "@/types/mind-graph";
import OrbitNode from "@/components/controls/Orbit";
import SatelliteNode from "./SatelliteNode";
import { usePopupStore } from "@/store/popupStore";
import { findRootId } from "./utils";

const planetBaseSpeed = 0.3;
const planetDecay = 0.8;

interface Props {
  planet: MindNode;
  nodes: { [id: number]: MindNode };
  planetIdx: number;
  orbitRadius: number;
  starX: number;
  starY: number;
}

export default function PlanetNode({ planet, nodes, planetIdx, orbitRadius, starX, starY }: Props) {
  const setPopup = usePopupStore(s => s.setPopup);
  const pausedRootIds = usePopupStore(s => s.pausedRootIds);

  const isPaused = (nodeId: number) => pausedRootIds.has(findRootId(nodeId, nodes));
  const speed = planetBaseSpeed * Math.pow(planetDecay, planetIdx);

  return (
    <OrbitNode
      key={planet.id}
      centerX={starX}
      centerY={starY}
      radius={orbitRadius}
      speed={speed}
      size={planet.radius}
      color={planet.color}
      initialAngle={planet.initialAngle ?? Math.random() * Math.PI * 2}
      paused={isPaused(planet.id)}
      onContextMenu={(x, y, e) => {
        e.preventDefault();
        e.stopPropagation();
        setPopup({ id: planet.id, x, y });
      }}
    >
      {(x, y) => planet.children.map((satId, idx) => (
        <SatelliteNode
          key={satId}
          satId={satId}
          satIdx={idx}
          nodes={nodes}
          centerX={x}
          centerY={y}
        />
      ))}
    </OrbitNode>
  );
}