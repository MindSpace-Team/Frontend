"use client";
import { create } from "zustand";

export const INIT_W = 1920;
export const INIT_H = 1080;
export const MIN_SCALE = 0.001;
export const MAX_SCALE = 50;

type ViewBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type CanvasState = {
  viewBox: ViewBox;
  setViewBox: (viewBox: ViewBox) => void;
  zoom: (mouseX: number, mouseY: number, scaleBy: number) => void;
  pan: (dx: number, dy: number) => void;
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  viewBox: { x: 0, y: 0, w: INIT_W, h: INIT_H },
  setViewBox: (viewBox) => set({ viewBox }),
  zoom: (mouseX, mouseY, scaleBy) => {
    const { viewBox } = get();
    let newW = viewBox.w * scaleBy;
    let newH = viewBox.h * scaleBy;

    const newScale = INIT_W / newW;
    if (newScale < MIN_SCALE) {
      newW = INIT_W / MIN_SCALE;
      newH = INIT_H / MIN_SCALE;
    }
    if (newScale > MAX_SCALE) {
      newW = INIT_W / MAX_SCALE;
      newH = INIT_H / MAX_SCALE;
    }

    const kx = (mouseX - viewBox.x) / viewBox.w;
    const ky = (mouseY - viewBox.y) / viewBox.h;
    const newX = mouseX - newW * kx;
    const newY = mouseY - newH * ky;

    set({ viewBox: { x: newX, y: newY, w: newW, h: newH } });
  },
  pan: (dx, dy) => {
    const { viewBox } = get();
    set({
      viewBox: {
        ...viewBox,
        x: viewBox.x - dx,
        y: viewBox.y - dy,
      },
    });
  },
}));
