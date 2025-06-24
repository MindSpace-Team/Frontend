import React from "react";
import { MindNode } from "@/types/mind-graph";
import { usePopupStore } from "@/store/popupStore";
import { useMindGraphStore } from "@/store/mindGraphStore";
import MoveNode from "./moveNode";
import PlanetNode from "./PlanetNode";

const STAR_DIST_FACTOR = 2.0;
const PLANET_MIN_GAP = 300;

interface Props {
  star: MindNode & { x: number; y: number };
  nodes: { [id: number]: MindNode };
  onContextMenu?: (e: React.MouseEvent, nodeId: string) => void;
}

export default function StarNode({ star, nodes, onContextMenu }: Props) {
  const setPopup = usePopupStore(s => s.setPopup);
  const selectNode = useMindGraphStore(s => s.selectNode);
  const planetIds = star.children;
  let planetAccRadius = 0;

  return (
    <>
      <MoveNode
        node={star}
        onClick={() => selectNode(star.id)}
        onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
          if (onContextMenu) {
            onContextMenu(e, star.id.toString());
          } else {
            setPopup({ id: star.id, x: star.x, y: star.y });
          }
        }}
      />

      {planetIds.map((planetId, idx) => {
        const planet = nodes[planetId];
        if (!planet) return null;

        const prevPlanet = idx > 0 ? nodes[planetIds[idx - 1]] : null;
        if (idx === 0) {
          planetAccRadius = star.radius * STAR_DIST_FACTOR + planet.radius + PLANET_MIN_GAP;
        } else if (prevPlanet) {
          planetAccRadius += prevPlanet.radius + planet.radius + PLANET_MIN_GAP;
        }

        return (
          <PlanetNode
            key={planet.id}
            planet={planet}
            nodes={nodes}
            planetIdx={idx}
            orbitRadius={planetAccRadius}
            starX={star.x}
            starY={star.y}
          />
        );
      })}
    </>
  );
}