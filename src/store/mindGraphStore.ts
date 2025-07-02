import { create } from "zustand";
import { MindGraphState } from '@/types/mind-graph';
import { mindGraphActions } from './actions/mind-graph-actions';

export const useMindGraphStore = create<MindGraphState>((set) => ({
  nodes: {},
  rootIds: [],
  selectedNodeId: null,
  selectNode: (id) => set({ selectedNodeId: id }),
  addStar: (x, y, name) => mindGraphActions.addStar(x, y, name)(set),
  addPlanet: (parentId, name) => mindGraphActions.addPlanet(parentId, name)(set),
  addSatellite: (parentId, name) => mindGraphActions.addSatellite(parentId, name)(set),
  removeNode: (nodeId) => mindGraphActions.removeNode(nodeId)(set),
  moveStar: (id, x, y) => mindGraphActions.moveStar(id, x, y)(set),
  setNodeColor: (id: number, color: string) => mindGraphActions.setNodeColor(id, color)(set),
  setNodeRadius: (id: number, radius: number) => mindGraphActions.setNodeRadius(id, radius)(set),
  setNodeContent: (id: number, content: string) => mindGraphActions.setNodeContent(id, content)(set),
}));