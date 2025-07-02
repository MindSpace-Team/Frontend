import { create } from "zustand";

type NameInputData = {
  type: "star" | "planet" | "satellite";
  parentId?: number;
  x?: number;
  y?: number;
} | null;

interface NameInputState {
  isOpen: boolean;
  data: NameInputData;
  openNameInput: (data: NameInputData) => void;
  closeNameInput: () => void;
}

export const useNameInputStore = create<NameInputState>((set) => ({
  isOpen: false,
  data: null,
  openNameInput: (data) => set({ isOpen: true, data }),
  closeNameInput: () => set({ isOpen: false, data: null }),
})); 