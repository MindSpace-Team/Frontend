"use client";
import React, { useRef, useEffect } from "react";
import StarsBackground from "@/components/home/StarsBackground";
import "@/styles/globals.css";
import "@/styles/BackGround.css";
import "@/styles/home.css";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;
      e.preventDefault();

      const direction = e.deltaY > 0 ? 1 : -1;
      const scrollAmount = window.innerWidth;

      container.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });

      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white font-orbitron">
        <div className="w-full h-full relative">
          <StarsBackground />
          <div
            className="home-scroll-container"
            ref={containerRef}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "auto",
            }}
          >
            <section className="home-section">
              <h1 className="text-4xl font-bold">
                🧠 Mind Space에 오신 걸 환영합니다!
              </h1>
            </section>
            <section className="home-section">
              <h2 className="text-3xl">
                1. 별을 우클릭해 행성을 추가하세요 🌍
              </h2>
            </section>
            <section className="home-section">
              <h2 className="text-3xl">
                2. 행성에 위성을 추가할 수도 있어요 🛰️
              </h2>
            </section>
            <section className="home-section">
              <h2 className="text-3xl">
                3. 노드를 클릭해 상세 내용을 작성하세요 📝
              </h2>
            </section>
          </div>
        </div>
    </div>
  );
}
