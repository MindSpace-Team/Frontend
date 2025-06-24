import { create } from "zustand";
import { MindGraphState } from '@/types/mind-graph';
import { mindGraphActions } from './actions/mind-graph-actions';

export const useMindGraphStore = create<MindGraphState>((set) => ({
  nodes: {},
  rootIds: [],
  selectedNodeId: null,
  selectNode: (id) => set({ selectedNodeId: id }),
  addStar: (x: number, y: number) => mindGraphActions.addStar(x, y)(set),
  addPlanet: (parentId: number) => mindGraphActions.addPlanet(parentId)(set),
  addSatellite: (parentId: number) => mindGraphActions.addSatellite(parentId)(set),
  removeNode: (nodeId: number) => mindGraphActions.removeNode(nodeId)(set),
  moveStar: (id: number, x: number, y: number) => mindGraphActions.moveStar(id, x, y)(set),
  setNodeColor: (id: number, color: string) => mindGraphActions.setNodeColor(id, color)(set),
  setNodeRadius: (id: number, radius: number) => mindGraphActions.setNodeRadius(id, radius)(set),
  setNodeContent: (id: number, content: string) => mindGraphActions.setNodeContent(id, content)(set),
}));