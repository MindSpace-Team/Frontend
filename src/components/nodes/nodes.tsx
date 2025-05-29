import React from "react";
import { MindNode, NodeId } from "@/store/mindGraphStore";

type NodesProps = {
  nodes: { [id: number]: MindNode };
  onNodeClick: (nodeId: NodeId) => void;
};

export default function Nodes({ nodes, onNodeClick }: NodesProps) {
  const stars = Object.values(nodes).filter(n => n.type === "star");
  const lines: React.ReactElement[] = [];

  return React.createElement(
    React.Fragment,
    null,
    ...stars.map(star => {
      const starX = star.x!;
      const starY = star.y!;
      return React.createElement(
        "g",
        { key: star.id },
        React.createElement("circle", {
          cx: starX,
          cy: starY,
          r: star.radius,
          fill: "#ffd700",
          stroke: "#fff",
          strokeWidth: 3,
          onClick: () => onNodeClick(star.id),
          style: { cursor: "pointer" },
        }),
        ...star.children.map((planetId, planetIdx) => {
          const planet = nodes[planetId];
          const base = 140;
          const step = 90;
          const planetX = starX + base + step * planetIdx;
          const planetY = starY;
          lines.push(
            React.createElement("line", {
              key: `line-star-${star.id}-planet-${planet.id}`,
              x1: starX,
              y1: starY,
              x2: planetX,
              y2: planetY,
              stroke: "#aaa",
              strokeWidth: 2,
              opacity: 0.5,
            })
          );
          return React.createElement(
            "g",
            { key: planet.id },
            React.createElement("circle", {
              cx: planetX,
              cy: planetY,
              r: planet.radius,
              fill: "#3af",
              stroke: "#fff",
              strokeWidth: 3,
              onClick: () => onNodeClick(planet.id),
              style: { cursor: "pointer" },
            }),
            ...planet.children.map((satId, satIdx) => {
              const satellite = nodes[satId];
              const baseS = 64;
              const stepS = 48;
              const satX = planetX + baseS + stepS * satIdx;
              const satY = planetY;
              lines.push(
                React.createElement("line", {
                  key: `line-planet-${planet.id}-satellite-${satellite.id}`,
                  x1: planetX,
                  y1: planetY,
                  x2: satX,
                  y2: satY,
                  stroke: "#aaa",
                  strokeWidth: 2,
                  opacity: 0.5,
                })
              );
              return React.createElement("circle", {
                key: satellite.id,
                cx: satX,
                cy: satY,
                r: satellite.radius,
                fill: "#9ff",
                stroke: "#fff",
                strokeWidth: 3,
                onClick: () => onNodeClick(satellite.id),
                style: { cursor: "pointer" },
              });
            })
          );
        })
      );
    }),
    ...lines
  );
}