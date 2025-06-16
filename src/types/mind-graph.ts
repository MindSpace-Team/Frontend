export type NodeType = "star" | "planet" | "satellite";
export type NodeId = number;

export interface MindNode {
  id: NodeId;
  type: NodeType;
  x?: number;
  y?: number;
  radius: number;
  color: string;
  parentId?: NodeId;
  children: NodeId[];
  initialAngle?: number;
}

export interface MindGraphState {
  nodes: { [id: number]: MindNode };
  rootIds: NodeId[];
  addStar: (x: number, y: number) => void;
  addPlanet: (parentId: NodeId) => void;
  addSatellite: (parentId: NodeId) => void;
  removeNode: (nodeId: NodeId) => void;
  moveStar: (id: NodeId, x: number, y: number) => void;
  setNodeColor: (id: NodeId, color: string) => void;
  setNodeRadius: (id: NodeId, radius: number) => void;
}