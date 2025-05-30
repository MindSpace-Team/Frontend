import { create } from "zustand";

export type NodeType = "star" | "planet" | "satellite";
export type NodeId = number;

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

interface MindGraphState {
  nodes: { [id: number]: MindNode };
  rootIds: NodeId[];
  addStar: (x: number, y: number) => void;
  addPlanet: (parentId: NodeId) => void;
  addSatellite: (parentId: NodeId) => void;
  removeNode: (nodeId: NodeId) => void;
  moveStar: (id: NodeId, x: number, y: number) => void;
}

function newId() {
  return Math.floor(Math.random() * 1e9) + Date.now();
}

export const useMindGraphStore = create<MindGraphState>((set) => ({
  nodes: {},
  rootIds: [],
  addStar: (x, y) =>
    set(state => {
      const id = newId();
      return {
        nodes: {
          ...state.nodes,
          [id]: {
            id,
            type: "star",
            x,
            y,
            radius: 120,
            children: [],
          },
        },
        rootIds: [...state.rootIds, id],
      };
    }),
  addPlanet: (parentId) =>
    set(state => {
      const parent = state.nodes[parentId];
      if (!parent || parent.type !== "star") return state;
      const id = newId();
      const planet: MindNode = {
        id,
        type: "planet",
        parentId,
        radius: 40,
        children: [],
        initialAngle: Math.random() * Math.PI * 2
      };
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: planet,
          [parentId]: {
            ...parent,
            children: [...parent.children, id],
          },
        },
      };
    }),
  addSatellite: (parentId) =>
    set(state => {
      const parent = state.nodes[parentId];
      if (!parent || parent.type !== "planet") return state;
      const id = newId();
      const satellite: MindNode = {
        id,
        type: "satellite",
        parentId,
        radius: 12,
        children: [],
        initialAngle: Math.random() * Math.PI * 2
      };
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: satellite,
          [parentId]: {
            ...parent,
            children: [...parent.children, id],
          },
        },
      };
    }),
  removeNode: (nodeId) =>
    set(state => {
      function getDescendants(id: number, nodes: { [id: number]: MindNode }): number[] {
        const node = nodes[id];
        if (!node) return [];
        return node.children.reduce<number[]>(
          (acc, childId) => acc.concat(childId, ...getDescendants(childId, nodes)),
          []
        );
      }
      const all = [nodeId, ...getDescendants(nodeId, state.nodes)];
      const newNodes = { ...state.nodes };
      all.forEach(id => delete newNodes[id]);
      Object.values(newNodes).forEach(n => {
        n.children = n.children.filter(cid => !all.includes(cid));
      });
      return {
        nodes: newNodes,
        rootIds: state.rootIds.filter(rid => !all.includes(rid)),
      };
    }),
  moveStar: (id, x, y) =>
    set(state => {
      const node = state.nodes[id];
      if (!node || node.type !== "star") return state;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: { ...node, x, y }
        }
      };
    }),
}));
