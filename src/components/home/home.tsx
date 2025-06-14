"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/globals.css";
import "@/styles/home.css";
import { StarsBackground } from "@/components/ui/stars-background";

const SECTIONS = [
  <section className="home-section" key="1">
    <h2 className="text-3xl">🧠 Mind Space에 오신 걸 환영합니다!</h2>
  </section>,
  <section className="home-section" key="2">
    <h2 className="text-3xl">1. 별을 우클릭해 행성을 추가하세요 🌍</h2>
  </section>,
  <section className="home-section" key="3">
    <h2 className="text-3xl">2. 행성에 위성을 추가할 수도 있어요 🛰️</h2>
  </section>,
  <section className="home-section" key="4">
    <h2 className="text-3xl">3. 노드를 클릭해 상세 내용을 작성하세요 📝</h2>
  </section>,
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [isAppearing, setIsAppearing] = useState(false);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const isScrolling = useRef(false);

  // 별 warp + 섹션 변경 타이밍 관리
  useEffect(() => {
    if (nextIndex !== null && isWarping) {
      // warp 중, 글자 숨김
      const warpDuration = 1000; // 별 warp 총 시간과 동일하게!
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex(null);
        setIsWarping(false);
        setIsAppearing(true);
        setTimeout(() => setIsAppearing(false), 320); // 등장 모션 0.32초
      }, warpDuration);
    }
  }, [isWarping, nextIndex]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current || isWarping || isAppearing) return;
      e.preventDefault();

      // 이동할 섹션 결정
      const direction = e.deltaY > 0 ? 1 : -1;
      const target = currentIndex + direction;
      if (target < 0 || target >= SECTIONS.length) return;

      // warp 트리거
      setIsWarping(true);
      setNextIndex(target);
      window.dispatchEvent(new Event("star-warp"));

      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, 1200);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex, isWarping, isAppearing]);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white font-orbitron">
      <StarsBackground />
      <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-10 pointer-events-none select-none">
        <AnimatePresence mode="wait">
          {!isWarping && (
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{
                scale: isAppearing ? [0.75, 1.12, 1] : 1,
                opacity: 1,
                transition: { duration: 0.32, ease: [0.2, 0.7, 0.5, 1] },
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
              className="flex items-center justify-center w-full"
            >
              {SECTIONS[currentIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
