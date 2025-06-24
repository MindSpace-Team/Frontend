import React from "react";
import { MindNode } from "@/types/mind-graph";
import OrbitNode from "@/components/controls/Orbit";
import { usePopupStore } from "@/store/popupStore";
import { useMindGraphStore } from "@/store/mindGraphStore";
import { findRootId } from "./utils";

const satBaseSpeed = 0.7;
const satDecay = 0.75;
const SAT_DIST_FACTOR = 1.0;
const SAT_MIN_GAP = 80;

interface Props {
  satId: number;
  satIdx: number;
  nodes: { [id: number]: MindNode };
  centerX: number;
  centerY: number;
}

export default function SatelliteNode({ satId, satIdx, nodes, centerX, centerY }: Props) {
  const setPopup = usePopupStore(s => s.setPopup);
  const pausedRootIds = usePopupStore(s => s.pausedRootIds);
  const selectNode = useMindGraphStore(s => s.selectNode);
  const satellite = nodes[satId];
  const isPaused = (nodeId: number) => pausedRootIds.has(findRootId(nodeId, nodes));

  if (!satellite) return null;

  const parent = nodes[satellite.parentId!];
  const siblings = parent.children;
  let satAccRadius = 0;

  const prevSat = satIdx > 0 ? nodes[siblings[satIdx - 1]] : null;

  if (satIdx === 0) {
    satAccRadius = parent.radius * SAT_DIST_FACTOR + satellite.radius + SAT_MIN_GAP;
  } else if (prevSat) {
    satAccRadius = prevSat.radius + satellite.radius + SAT_MIN_GAP + (() => {
      let acc = parent.radius * SAT_DIST_FACTOR + prevSat.radius + SAT_MIN_GAP;
      for (let i = 1; i < satIdx; i++) {
        const prev = nodes[siblings[i - 1]];
        const curr = nodes[siblings[i]];
        acc += prev.radius + curr.radius + SAT_MIN_GAP;
      }
      return acc;
    })();
  }

  const speed = satBaseSpeed * Math.pow(satDecay, satIdx);

  return (
    <OrbitNode
      key={satId}
      centerX={centerX}
      centerY={centerY}
      radius={satAccRadius}
      speed={speed}
      size={satellite.radius}
      color={satellite.color}
      initialAngle={satellite.initialAngle ?? Math.random() * Math.PI * 2}
      paused={isPaused(satId)}
      onClick={() => selectNode(satId)}
      onContextMenu={(x, y, e) => {
        e.preventDefault();
        e.stopPropagation();
        setPopup({ id: satId, x, y });
      }}
    />
  );
}