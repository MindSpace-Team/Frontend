import { create } from "zustand";
import { MindNode } from "@/store/mindGraphStore";

// 별(트리) 최상위 id 찾기
function findRootId(id: number, nodes: { [id: number]: MindNode }): number {
  let cur = nodes[id];
  while (cur && cur.parentId !== undefined && cur.parentId !== null) {
    cur = nodes[cur.parentId];
  }
  return cur ? cur.id : id;
}

type PopupState = { id: number; x: number; y: number } | null;

interface PopupStore {
  popup: PopupState;
  setPopup: (popup: PopupState) => void;
  pausedRootIds: Set<number>; // 정지된 트리(별)의 rootId만 저장
  togglePauseRoot: (id: number, nodes: { [id: number]: MindNode }) => void;
  resetPaused: () => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  popup: null,
  setPopup: (popup) => set({ popup }),
  pausedRootIds: new Set(),
  togglePauseRoot: (id, nodes) =>
    set((state) => {
      const rootId = findRootId(id, nodes);
      const next = new Set(state.pausedRootIds);
      if (next.has(rootId)) next.delete(rootId); // 재생
      else next.add(rootId); // 정지
      return { pausedRootIds: next };
    }),
  resetPaused: () => set({ pausedRootIds: new Set() }),
}));
