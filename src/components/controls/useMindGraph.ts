import { useState } from "react";

export type NodeType = "star" | "planet" | "satellite";
export type NodeId = number;

// x, y, initialAngle 모두 선택적
export interface MindNode {
  id: NodeId;
  type: NodeType;
  x?: number;
  y?: number;
  radius: number;
  parentId?: NodeId;
  children: NodeId[];
  initialAngle?: number;
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
        nodes: {
          ...prev.nodes,
          [id]: { id, type: "star", x, y, radius: 32, children: [] }
        },
        rootIds: [...prev.rootIds, id]
      };
    });
  }

  function addPlanet(parentId: number) {
    setGraph(prev => {
      const parent = prev.nodes[parentId];
      if (!parent || parent.type !== "star") return prev;
      const id = newId();
      // initialAngle은 랜덤, x/y는 저장하지 않음!
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: { id, type: "planet", parentId: parent.id, radius: 18, children: [], initialAngle: Math.random() * Math.PI * 2 },
          [parent.id]: { ...parent, children: [...parent.children, id] }
        }
      };
    });
  }

  function addSatellite(parentId: number) {
    setGraph(prev => {
      const parent = prev.nodes[parentId];
      if (!parent || parent.type !== "planet") return prev;
      const id = newId();
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: { id, type: "satellite", parentId: parent.id, radius: 10, children: [], initialAngle: Math.random() * Math.PI * 2 },
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
