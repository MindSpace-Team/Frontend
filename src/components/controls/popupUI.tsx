import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePopupStore } from "@/store/popupStore";
import { useMindGraphStore } from "@/store/mindGraphStore";

function svgToScreen(svg: SVGSVGElement, x: number, y: number) {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const screenCTM = svg.getScreenCTM();
  if (!screenCTM) return { left: x, top: y };
  const transformed = pt.matrixTransform(screenCTM);
  return { left: transformed.x, top: transformed.y };
}

export default function PopupUI() {
  const { popup, setPopup, pausedRootIds, togglePauseRoot } = usePopupStore();
  const { nodes, addPlanet, addSatellite, removeNode } = useMindGraphStore();
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!popup) return;
    const svg = document.querySelector("svg");
    if (!svg) return;
    setPos(svgToScreen(svg as SVGSVGElement, popup.x, popup.y));
  }, [popup]);

  if (!popup || !pos) return null;
  const node = nodes[popup.id];
  if (!node) return null;

  const POPUP_W = 150;
  const POPUP_H = 180;
  let left = pos.left + 30;
  let top = pos.top - 16;
  const windowW = window.innerWidth;
  const windowH = window.innerHeight;
  if (left + POPUP_W > windowW) left = pos.left - POPUP_W - 30;
  if (left < 0) left = 10;
  if (top + POPUP_H > windowH) top = windowH - POPUP_H - 10;
  if (top < 0) top = pos.top + 40;

  const rootId = (() => {
    let cur = node;
    while (cur && cur.parentId !== undefined && cur.parentId !== null) {
      cur = nodes[cur.parentId];
    }
    return cur ? cur.id : node.id;
  })();

  const isPaused = pausedRootIds.has(rootId);

  const content = (
    <div
      className="pause-popup"
      style={{
        position: "fixed",
        left,
        top,
        width: POPUP_W,
        minHeight: 110,
        background: "#26272d",
        borderRadius: 10,
        padding: "8px 0",
        color: "#fff",
        fontSize: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        boxShadow: "0 6px 24px #0006",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      <button
        onClick={() => {
          togglePauseRoot(node.id, nodes);
          setPopup(null);
        }}
        style={{
          border: "none",
          borderRadius: 0,
          padding: "15px 24px",
          background: "none",
          color: isPaused ? "#1ecd5a" : "#ff3535",
          fontWeight: 700,
          fontSize: 17,
          cursor: "pointer",
          borderBottom: "1px solid #333",
        }}
      >{isPaused ? "재생" : "정지"}</button>
      {node.type === "star" && (
        <button
          onClick={() => {
            addPlanet(node.id);
            setPopup(null);
          }}
          style={{
            border: "none", borderRadius: 0,
            padding: "15px 24px", background: "none",
            color: "#2ad", fontWeight: 700, fontSize: 17, cursor: "pointer",
            borderBottom: "1px solid #333",
          }}
        >행성 추가</button>
      )}
      {node.type === "planet" && (
        <button
          onClick={() => {
            addSatellite(node.id);
            setPopup(null);
          }}
          style={{
            border: "none", borderRadius: 0,
            padding: "15px 24px", background: "none",
            color: "#ad2", fontWeight: 700, fontSize: 17, cursor: "pointer",
            borderBottom: "1px solid #333",
          }}
        >위성 추가</button>
      )}
      <button
        onClick={() => {
          removeNode(node.id);
          setPopup(null);
        }}
        style={{
          background: "none",
          color: "#faa",
          border: "none",
          fontWeight: 700,
          fontSize: 17,
          borderRadius: 0,
          padding: "15px 24px",
          cursor: "pointer",
          borderBottom: "1px solid #333",
        }}
      >삭제</button>
      <button
        onClick={() => setPopup(null)}
        style={{
          background: "none",
          color: "#aaa",
          border: "none",
          fontWeight: 700,
          fontSize: 17,
          borderRadius: 0,
          padding: "15px 24px",
          cursor: "pointer"
        }}
      >닫기</button>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}