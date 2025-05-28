"use client";
import React, { useState } from "react";
import Canvas from "@/components/canvas/Canvas";
import useMindGraph from "@/components/controls/useMindGraph";
import Nodes from "@/components/nodes/nodes";
import ContextMenu from "@/components/common/ContextMenu";

type Mode =
  | null
  | { type: "addPlanet" }
  | { type: "addSatellite" }
  | { type: "delete" };

type MenuState =
  | null
  | { x: number; y: number; target: "canvas"; svgX: number; svgY: number };

export default function NodeManager() {
  const { graph, addStar, addPlanet, addSatellite, removeNode } = useMindGraph();
  const [menu, setMenu] = useState<MenuState>(null);
  const [mode, setMode] = useState<Mode>(null);

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
      } else if (label === "행성 추가") {
        setMode({ type: "addPlanet" });
        setMenu(null);
      } else if (label === "위성 추가") {
        setMode({ type: "addSatellite" });
        setMenu(null);
      } else if (label === "삭제") {
        setMode({ type: "delete" });
        setMenu(null);
      } else {
        setMenu(null);
      }
    }
  }

  // 모드별로 부모노드 선택
  function handleNodeClick(nodeId: number) {
    if (!mode) return;
    if (mode.type === "addPlanet") {
      addPlanet(nodeId);
      setMode(null);
    } else if (mode.type === "addSatellite") {
      addSatellite(nodeId);
      setMode(null);
    } else if (mode.type === "delete") {
      removeNode(nodeId);
      setMode(null);
    }
  }

  return (
    <Canvas onCanvasContextMenu={handleCanvasContextMenu}>
      <svg
        width="100vw"
        height="100vh"
        viewBox="0 0 1920 1080"
        style={{ width: "100vw", height: "100vh", background: "#111926" }}
        onClick={() => menu && setMenu(null)}
      >
        <Nodes nodes={graph.nodes} onNodeClick={handleNodeClick} />
      </svg>
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          options={[
            { label: "별 추가", onClick: () => handleMenuOption("별 추가") },
            { label: "행성 추가", onClick: () => handleMenuOption("행성 추가") },
            { label: "위성 추가", onClick: () => handleMenuOption("위성 추가") },
            { label: "삭제", onClick: () => handleMenuOption("삭제") },
            { label: "취소", onClick: () => setMenu(null) }
          ]}
          onClose={() => setMenu(null)}
        />
      )}
      {mode?.type === "addPlanet" && (
        <div style={{
          position: "fixed", left: 24, top: 24, color: "#fff",
          background: "#222b", padding: "6px 16px", borderRadius: 8, zIndex: 9999
        }}>
          연결할 별을 선택하세요
        </div>
      )}
      {mode?.type === "addSatellite" && (
        <div style={{
          position: "fixed", left: 24, top: 24, color: "#fff",
          background: "#222b", padding: "6px 16px", borderRadius: 8, zIndex: 9999
        }}>
          연결할 행성을 선택하세요
        </div>
      )}
      {mode?.type === "delete" && (
        <div style={{
          position: "fixed", left: 24, top: 24, color: "#fff",
          background: "#222b", padding: "6px 16px", borderRadius: 8, zIndex: 9999
        }}>
          삭제할 노드를 클릭하세요
        </div>
      )}
    </Canvas>
  );
}
