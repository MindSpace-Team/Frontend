import React from 'react';
import Image from 'next/image';

interface BottomMenuProps {
  onClose: () => void;
  onSelectBackground: (bgName: string) => void;
}

const backgrounds = [
  { name: 'space1', path: '/space/space1.webp' },
  { name: 'space2', path: '/space/space2.webp' },
  { name: 'space3', path: '/space/space3.webp' },
];

export default function BottomMenu({ onClose, onSelectBackground }: BottomMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 flex justify-center gap-4">
      {backgrounds.map((bg) => (
        <button
          key={bg.name}
          onClick={() => onSelectBackground(bg.name)}
          className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-400">
            <Image
              src={bg.path}
              alt={bg.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <span className="text-sm">{bg.name}</span>
        </button>
      ))}
      <button
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-red-400"
      >
        ✕
      </button>
    </div>
  );
} 