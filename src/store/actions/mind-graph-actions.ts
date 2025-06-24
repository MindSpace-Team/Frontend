import { MindGraphState, MindNode, NodeId } from '@/types/mind-graph';
import { NODE_DEFAULTS } from '@/constants/mind-graph';
import { newId, getDescendants } from '@/utils/mind-graph';
import { StoreApi } from 'zustand';

type SetState = StoreApi<MindGraphState>['setState'];

export const mindGraphActions = {
  addStar: (x: number, y: number) =>
    (set: SetState) => {
      set((state: MindGraphState) => {
        const id = newId();
        return {
          nodes: {
            ...state.nodes,
            [id]: {
              id,
              type: "star",
              x,
              y,
              radius: NODE_DEFAULTS.STAR.radius,
              color: NODE_DEFAULTS.STAR.color,
              children: [],
            },
          },
          rootIds: [...state.rootIds, id],
        };
      });
    },

  addPlanet: (parentId: NodeId) =>
    (set: SetState) => {
      set((state: MindGraphState) => {
        const parent = state.nodes[parentId];
        if (!parent || parent.type !== "star") return state;
        const id = newId();
        const planet: MindNode = {
          id,
          type: "planet",
          parentId,
          radius: NODE_DEFAULTS.PLANET.radius,
          color: NODE_DEFAULTS.PLANET.color,
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
      });
    },

  addSatellite: (parentId: NodeId) =>
    (set: SetState) => {
      set((state: MindGraphState) => {
        const parent = state.nodes[parentId];
        if (!parent || parent.type !== "planet") return state;
        const id = newId();
        const satellite: MindNode = {
          id,
          type: "satellite",
          parentId,
          radius: NODE_DEFAULTS.SATELLITE.radius,
          color: NODE_DEFAULTS.SATELLITE.color,
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
      });
    },

  removeNode: (nodeId: NodeId) =>
    (set: SetState) => {
      set((state: MindGraphState) => {
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
      });
    },

  moveStar: (id: NodeId, x: number, y: number) =>
    (set: SetState) => {
      set((state: MindGraphState) => {
        const node = state.nodes[id];
        if (!node || node.type !== "star") return state;
        return {
          ...state,
          nodes: {
            ...state.nodes,
            [id]: { ...node, x, y }
          }
        };
      });
    },

  setNodeColor: (id: NodeId, color: string) =>
    (set: SetState) => {
      set((state: MindGraphState) => ({
        nodes: {
          ...state.nodes,
          [id]: { ...state.nodes[id], color }
        }
      }));
    },

  setNodeRadius: (id: NodeId, radius: number) =>
    (set: SetState) => {
      set((state: MindGraphState) => ({
        nodes: {
          ...state.nodes,
          [id]: { ...state.nodes[id], radius }
        }
      }));
    },

  setNodeContent: (id: NodeId, content: string) =>
    (set: SetState) => {
      set((state: MindGraphState) => ({
        nodes: {
          ...state.nodes,
          [id]: { ...state.nodes[id], content }
        }
      }));
    },
} as const;