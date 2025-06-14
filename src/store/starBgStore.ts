import { create } from "zustand";

type StarBgState = {
  warpMode: boolean;
  starSpeed: number;
  starDirection: number;
  setWarpMode: (v: boolean) => void;
  setStarSpeed: (v: number) => void;
  setStarDirection: (v: number) => void;
};

export const useStarBgStore = create<StarBgState>((set) => ({
  warpMode: false,
  starSpeed: 0,
  starDirection: 1,
  setWarpMode: (v) => set({ warpMode: v }),
  setStarSpeed: (v) => set({ starSpeed: v }),
  setStarDirection: (v) => set({ starDirection: v }),
}));
