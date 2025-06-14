import { MindNode } from '@/types/mind-graph';

export function newId(): number {
  return Math.floor(Math.random() * 1e9) + Date.now();
}

export function getDescendants(id: number, nodes: { [id: number]: MindNode }): number[] {
  const node = nodes[id];
  if (!node) return [];
  return node.children.reduce<number[]>(
    (acc, childId) => acc.concat(childId, ...getDescendants(childId, nodes)),
    []
  );
}