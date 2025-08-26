export type NodeType = "star" | "planet" | "satellite";
export type PlanetDesignType = "default" | "earth" | "ringed";
export type NodeId = number;

export interface MindNode {
  id: NodeId;
  name: string;
  type: NodeType;
  x?: number;
  y?: number;
  radius: number;
  color: string;
  parentId?: NodeId;
  children: NodeId[];
  orbitSpeed?: number;
  initialAngle?: number;
  content?: string;
  planetDesign?: PlanetDesignType; // planet만 사용
}

export interface MindGraphData {
  nodes: { [id: number]: MindNode };
  rootIds: NodeId[];
}

export interface MindGraphState extends MindGraphData {
  selectedNodeId: NodeId | null;
  selectNode: (id: NodeId | null) => void;
  addStar: (x: number, y: number, name: string) => void;
  addPlanet: (parentId: NodeId, name: string) => void;
  addSatellite: (parentId: NodeId, name: string) => void;
  removeNode: (nodeId: NodeId) => void;
  moveStar: (id: NodeId, x: number, y: number) => void;
  setNodeColor: (id: NodeId, color: string) => void;
  setNodeRadius: (id: NodeId, radius: number) => void;
  setNodeContent: (id: NodeId, content: string) => void;
  setPlanetDesign: (id: NodeId, design: PlanetDesignType) => void;
  fetchGraph: () => Promise<void>;
  saveGraph: () => Promise<void>;
}