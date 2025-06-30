"use client";
import React, { useState } from "react";
import Canvas from "@/components/canvas/Canvas";
import Nodes from "@/components/nodes/nodes";
import ContextMenu from "@/components/common/ContextMenu";
import { useMindGraphStore } from "@/store/mindGraphStore";
import { useNameInputStore } from "@/store/nameInputStore";
import NameInputModal from "@/components/common/NameInputModal";
import PopupUI from "@/components/controls/popupUI";
import { useBackgroundStore } from "@/store/backgroundStore";
import BottomMenu from "@/components/controls/BottomMenu";
import Editor from "../editor/Editor";
import NodeTree from '../tree/NodeTree';

type MenuState =
  | null
  | { x: number; y: number; target: "canvas"; svgX: number; svgY: number };

export default function NodeManager() {
  const nodes = useMindGraphStore(s => s.nodes);
  const { openNameInput } = useNameInputStore();
  const { setBackground } = useBackgroundStore();
  const [menu, setMenu] = useState<MenuState>(null);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

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
        openNameInput({ type: "star", x: menu.svgX, y: menu.svgY });
        setMenu(null);
      } else if (label === "배경 변경") {
        setShowBottomMenu(true);
        setMenu(null);
      } else {
        setMenu(null);
      }
    }
  }

  const menuWidth = isMenuVisible ? 280 : 0;
  const canvasWidth = `calc(100vw - ${menuWidth}px)`;
  const canvasMarginLeft = `${menuWidth}px`;

  return (
    <>
      <NameInputModal />
      <NodeTree onMenuStateChange={setIsMenuVisible} />
      <Canvas onCanvasContextMenu={handleCanvasContextMenu}>
        <svg
          width={canvasWidth}
          height="100vh"
          viewBox="0 0 1920 1080"
          style={{ 
            width: canvasWidth, 
            height: "100vh", 
            background: "#111926",
            marginLeft: canvasMarginLeft,
            transition: "width 0.3s ease-in-out, margin-left 0.3s ease-in-out"
          }}
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
            { label: "배경 변경", onClick: () => handleMenuOption("배경 변경") },
            { label: "취소", onClick: () => setMenu(null) },
          ]}
          onClose={() => setMenu(null)}
        />
      )}
      {showBottomMenu && (
        <BottomMenu
          onClose={() => setShowBottomMenu(false)}
          onSelectBackground={(bgName: string) => {
            setBackground(`/space/${bgName}.webp`);
            setShowBottomMenu(false);
          }}
        />
      )}
      <Editor />
    </>
  );
}