"use client";
import React, { useRef, useEffect } from "react";
import StarsBackground from "@/components/home/StarsBackground";
import Spaceship from "@/components/home/Spaceship";
import "@/styles/globals.css";
import "@/styles/BackGround.css";
import "@/styles/home.css";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 가로 스크롤
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 이미 가로 스크롤이면 무시
      if (container.scrollWidth <= container.clientWidth) return; // 스크롤 필요없음
      e.preventDefault();
      container.scrollBy({
        left: e.deltaY,
        behavior: "smooth",
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black text-white font-orbitron">
      <Spaceship>
        {/* 창문 영역에만 children 보임 */}
        <div className="w-full h-full relative">
          <StarsBackground />
          <div
            className="home-scroll-container"
            ref={containerRef}
            style={{
              width: "100%",
              height: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              display: "flex",
              flexDirection: "row",
              scrollSnapType: "x mandatory",
              position: "relative",
              zIndex: 1,
            }}
          >
            <section className="home-section">
              <h1 className="text-4xl font-bold">🧠 Mind Space에 오신 걸 환영합니다!</h1>
            </section>
            <section className="home-section">
              <h2 className="text-3xl">1. 별을 우클릭해 행성을 추가하세요 🌍</h2>
            </section>
            <section className="home-section">
              <h2 className="text-3xl">2. 행성에 위성을 추가할 수도 있어요 🛰️</h2>
            </section>
            <section className="home-section">
              <h2 className="text-3xl">3. 노드를 클릭해 상세 내용을 작성하세요 📝</h2>
            </section>
          </div>
        </div>
      </Spaceship>
    </div>
  );
}
