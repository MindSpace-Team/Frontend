import React from 'react';
import Image from 'next/image';
import { useBackgroundStore } from '@/store/backgroundStore';

const backgrounds = [
  '/space/space1.webp',
  '/space/space2.webp',
  '/space/space3.webp',
];

export default function BackgroundSelector() {
  const { currentBackground, setBackground } = useBackgroundStore();

  return (
    <div className="fixed bottom-4 right-4 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
      <h3 className="text-white text-sm mb-2">배경 선택</h3>
      <div className="flex gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg}
            onClick={() => setBackground(bg)}
            className={`w-12 h-12 rounded overflow-hidden border-2 ${
              currentBackground === bg ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Image
              src={bg}
              alt="background preview"
              width={48}
              height={48}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
} 