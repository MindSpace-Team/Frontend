"use client";
import React, { useState } from "react";
import Canvas from "@/components/canvas/Canvas";
import Nodes from "@/components/nodes/nodes";
import ContextMenu from "@/components/common/ContextMenu";
import { useMindGraphStore } from "@/store/mindGraphStore";
import PopupUI from "@/components/controls/popupUI";

type MenuState =
  | null
  | { x: number; y: number; target: "canvas"; svgX: number; svgY: number };

export default function NodeManager() {
  const nodes = useMindGraphStore(s => s.nodes);
  const addStar = useMindGraphStore(s => s.addStar);

  const [menu, setMenu] = useState<MenuState>(null);

  const handleCanvasContextMenu = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const x = ((e.clientX - rect.left) / rect.width) * vb.width + vb.x;
    const y = ((e.clientY - rect.top) / rect.height) * vb.height + vb.y;
    setMenu({ x: e.clientX, y: e.clientY, target: "canvas", svgX: x, svgY: y });
  };

  function handleMenuOption(label: string) {
    if (!menu) return;
    if (menu.target === "canvas") {
      if (label === "별 추가") {
        addStar(menu.svgX, menu.svgY);
        setMenu(null);
      } else {
        setMenu(null);
      }
    }
  }

  return (
    <>
      <Canvas onCanvasContextMenu={handleCanvasContextMenu}>
        <svg
          width="100vw"
          height="100vh"
          viewBox="0 0 1920 1080"
          style={{ width: "100vw", height: "100vh", background: "#111926" }}
          onClick={() => menu && setMenu(null)}
        >
          <Nodes nodes={nodes} />
          <PopupUI />
        </svg>
      </Canvas>
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          options={[
            { label: "별 추가", onClick: () => handleMenuOption("별 추가") },
            { label: "취소", onClick: () => setMenu(null) },
          ]}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  );
}