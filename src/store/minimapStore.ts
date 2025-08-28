import { create } from 'zustand';

interface MinimapState {
  isMinimapVisible: boolean;
  showMinimap: () => void;
  hideMinimap: () => void;
  minimapZoomLevel: number;
  setMinimapZoomLevel: (level: number) => void;
  lastInteractionTime: number; // New state to track last interaction
  recordInteraction: () => void; // New action to record interaction
}

export const useMinimapStore = create<MinimapState>((set) => ({
  isMinimapVisible: false,
  showMinimap: () => set({ isMinimapVisible: true }),
  hideMinimap: () => set({ isMinimapVisible: false }),
  minimapZoomLevel: 1,
  setMinimapZoomLevel: (level) => set({ minimapZoomLevel: level }),
  lastInteractionTime: Date.now(), // Initialize with current time
  recordInteraction: () => set({ lastInteractionTime: Date.now() }), // Update interaction time
}));
