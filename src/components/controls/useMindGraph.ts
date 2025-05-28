import { useState } from "react";

export type NodeType = "star" | "planet" | "satellite";
export type NodeId = number;
export interface MindNode {
  id: NodeId;
  type: NodeType;
  x: number;
  y: number;
  radius: number;
  parentId?: NodeId;
  children: NodeId[];
}
export interface MindGraph {
  nodes: { [id: number]: MindNode };
  rootIds: NodeId[];
}
function newId() {
  return Math.floor(Math.random() * 1e9) + Date.now();
}
export default function useMindGraph() {
  const [graph, setGraph] = useState<MindGraph>({ nodes: {}, rootIds: [] });

  function addStar(x: number, y: number) {
    setGraph(prev => {
      const id = newId();
      return {
        nodes: { ...prev.nodes, [id]: { id, type: "star", x, y, radius: 32, children: [] }},
        rootIds: [...prev.rootIds, id]
      };
    });
  }
  function addPlanet(parentId: number) {
    setGraph(prev => {
      const parent = prev.nodes[parentId];
      if (!parent || parent.type !== "star") return prev;
      const existingPlanets = parent.children.length;
      const base = 80;
      const step = 60;
      const distance = base + step * existingPlanets; // 점점 멀어짐
      const angle = Math.random() * Math.PI * 2;
      const x = parent.x + distance * Math.cos(angle);
      const y = parent.y + distance * Math.sin(angle);
      const id = newId();
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: { id, type: "planet", x, y, radius: 18, parentId: parent.id, children: [] },
          [parent.id]: { ...parent, children: [...parent.children, id] }
        }
      };
    });
  }
  function addSatellite(parentId: number) {
    setGraph(prev => {
      const parent = prev.nodes[parentId];
      if (!parent || parent.type !== "planet") return prev;
      const existingSatellites = parent.children.length;
      const base = 32;
      const step = 24;
      const distance = base + step * existingSatellites;
      const angle = Math.random() * Math.PI * 2;
      const x = parent.x + distance * Math.cos(angle);
      const y = parent.y + distance * Math.sin(angle);
      const id = newId();
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: { id, type: "satellite", x, y, radius: 10, parentId: parent.id, children: [] },
          [parent.id]: { ...parent, children: [...parent.children, id] }
        }
      };
    });
  }
  function removeNode(nodeId: number) {
    setGraph(prev => {
      function dfs(id: number): number[] {
        const node = prev.nodes[id];
        if (!node) return [];
        return [id, ...node.children.flatMap(dfs)];
      }
      const removeIds = dfs(nodeId);
      const newNodes = { ...prev.nodes };
      removeIds.forEach(id => delete newNodes[id]);
      Object.values(newNodes).forEach(n => {
        n.children = n.children.filter(cid => !removeIds.includes(cid));
      });
      return {
        nodes: newNodes,
        rootIds: prev.rootIds.filter(rid => !removeIds.includes(rid))
      };
    });
  }
  return {
    graph,
    addStar,
    addPlanet,
    addSatellite,
    removeNode,
  };
}