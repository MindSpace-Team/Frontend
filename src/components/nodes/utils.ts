import { MindNode } from "@/store/mindGraphStore";

export function findRootId(id: number, nodes: { [id: number]: MindNode }): number {
  let cur = nodes[id];
  while (cur && cur.parentId !== undefined && cur.parentId !== null) {
    cur = nodes[cur.parentId];
  }
  return cur ? cur.id : id;
}