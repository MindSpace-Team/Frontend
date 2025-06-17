import { create } from 'zustand';

interface BackgroundState {
  currentBackground: string;
  setBackground: (background: string) => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  currentBackground: '/space/space1.webp',
  setBackground: (background) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('background', background);
    }
    set({ currentBackground: background });
  },
}));

// 클라이언트 사이드에서만 localStorage에서 값을 가져오도록 설정
if (typeof window !== 'undefined') {
  const savedBackground = localStorage.getItem('background');
  if (savedBackground) {
    useBackgroundStore.setState({ currentBackground: savedBackground });
  }
} 