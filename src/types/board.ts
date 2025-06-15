export interface BoardPost {
  id: number;
  nodeId: number;  // 연결된 노드의 ID
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardState {
  posts: { [id: number]: BoardPost };
  selectedNodeId: number | null;
  addPost: (nodeId: number, title: string, content: string) => void;
  updatePost: (postId: number, title: string, content: string) => void;
  deletePost: (postId: number) => void;
  setSelectedNodeId: (nodeId: number | null) => void;
  getPostByNodeId: (nodeId: number) => BoardPost | undefined;
} 