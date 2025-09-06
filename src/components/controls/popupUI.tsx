import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { usePopupStore } from "@/store/popupStore";
import { useMindGraphStore } from "@/store/mindGraphStore";
import { useNameInputStore } from "@/store/nameInputStore";

export default function PopupUI() {
  const { popup, setPopup, pausedRootIds, togglePauseRoot } = usePopupStore();
  const {
    nodes,
    removeNode,
    setNodeColor,
    setNodeRadius,
    selectNode,
    setPlanetDesign,
    setNodeOrbitSpeed,
  } = useMindGraphStore();
  const { openNameInput } = useNameInputStore();

  const [subPopup, setSubPopup] = useState<null | "color" | "size" | "design" | "speed">(null);
  const [color, setColor] = useState("#000");
  const [radius, setRadius] = useState<number | string>(0);
  const [orbitSpeed, setOrbitSpeed] = useState<number | string>(0);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!popup) return;
    const node = nodes[popup.id];
    if (!node) return;
    setColor(node.color);
    setRadius(node.radius);
    setOrbitSpeed(node.orbitSpeed ?? 0.3);
    setSubPopup(null);
  }, [popup, nodes]);

  // 팝업 외부 클릭 시 닫기 기능 추가
  useEffect(() => {
    if (!popup) return;

    function handleClickOutside(e: MouseEvent) {
      const popupEl = document.querySelector(".pause-popup");
      const subEl = document.querySelector(".pause-popup-sub");

      if (
        popupEl &&
        !popupEl.contains(e.target as Node) &&
        (!subEl || !subEl.contains(e.target as Node))
      ) {
        setPopup(null);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup, setPopup]);

  if (!popup) return null;
  const node = nodes[popup.id];
  if (!node) return null;

  const rootId = (() => {
    let cur = node;
    while (cur && cur.parentId !== undefined && cur.parentId !== null) {
      cur = nodes[cur.parentId];
    }
    return cur ? cur.id : node.id;
  })();

  const isPaused = pausedRootIds.has(rootId);

  const menuContent = (
    <div
      className="pause-popup"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#26272d",
        padding: "12px 24px",
        color: "#fff",
        fontSize: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        boxShadow: "0 -6px 24px #0006",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      <button
        onClick={() => {
          selectNode(node.id);
          setPopup(null);
        }}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#2a5a8a",
          color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >글쓰기</button>
      <button
        onClick={() => setSubPopup("color")}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#333",
          color: "#6fd1ff", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >색상 변경</button>
      <button
        onClick={() => setSubPopup("size")}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#333",
          color: "#ffe37d", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >사이즈 변경</button>
      {(node.type === "planet" || node.type === "satellite") && (
        <button
        onClick={() => setSubPopup("speed")}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#333",
          color: "#7af", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >공전 속도 조절</button>
      )}
      <button
        onClick={() => {
          togglePauseRoot(node.id, nodes);
          setPopup(null);
        }}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#333",
          color: isPaused ? "#1ecd5a" : "#ff3535",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >{isPaused ? "재생" : "정지"}</button>
      {node.type === "star" && (
        <button
          onClick={() => {
            openNameInput({ type: 'planet', parentId: node.id });
            setPopup(null);
          }}
          style={{
            border: "none", borderRadius: 8,
            padding: "8px 16px", background: "#333",
            color: "#2ad", fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}
        >행성 추가</button>
      )}
      {node.type === "planet" && (
        <button
          onClick={() => setSubPopup("design")}
          style={{
            border: "none", borderRadius: 8,
            padding: "8px 16px", background: "#333",
            color: "#f7c873", fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}
        >행성 디자인 변경</button>
      )}
      {node.type === "planet" && (
        <button
          onClick={() => {
            openNameInput({ type: 'satellite', parentId: node.id });
            setPopup(null);
          }}
          style={{
            border: "none", borderRadius: 8,
            padding: "8px 16px", background: "#333",
            color: "#ad2", fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}
        >위성 추가</button>
      )}
      <button
        onClick={() => {
          removeNode(node.id);
          setPopup(null);
        }}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#333",
          color: "#faa", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >삭제</button>
      <button
        onClick={() => setPopup(null)}
        style={{
          border: "none", borderRadius: 8,
          padding: "8px 16px", background: "#333",
          color: "#aaa", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}
      >닫기</button>
    </div>
  );

  const subPopupContent = subPopup && (
    <div
      className="pause-popup-sub"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "80px",
        transform: "translateX(-50%)",
        background: "#31323a",
        borderRadius: 10,
        padding: "14px 20px",
        color: "#fff",
        fontSize: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 6px 20px #0007",
        zIndex: 10000,
        gap: 10,
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {subPopup === "color" && (
        <>
          <div style={{ marginBottom: 5 }}>색상 선택</div>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ width: 48, height: 48, border: "none", background: "none" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => {
                setNodeColor(node.id, color);
                setSubPopup(null);
              }}
              style={{
                background: "#2ad", border: "none", color: "#fff",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
            >적용</button>
            <button
              onClick={() => {
                setColor(node.color);
                setSubPopup(null);
              }}
              style={{
                background: "none", border: "1px solid #444", color: "#bbb",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
            >취소</button>
          </div>
        </>
      )}
      {subPopup === "size" && (
        <>
          <div style={{ marginBottom: 5 }}>사이즈 변경</div>
          <input
            type="number"
            min={5}
            max={400}
            value={radius}
            onChange={e => {
              setRadius(e.target.value === "" ? "" : Number(e.target.value));
            }}
            style={{
              width: 64, border: "1px solid #444", background: "none",
              color: "#fff", borderRadius: 6, padding: "5px 7px", textAlign: "center"
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => {
                if (typeof radius === "number" && radius >= 5 && radius <= 5000) {
                  setNodeRadius(node.id, radius);
                  setSubPopup(null);
                }
              }}
              style={{
                background: "#2ad", border: "none", color: "#fff",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
              disabled={
                typeof radius !== "number" || radius < 5 || radius > 5000
              }
            >적용</button>
            <button
              onClick={() => {
                setRadius(node.radius);
                setSubPopup(null);
              }}
              style={{
                background: "none", border: "1px solid #444", color: "#bbb",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
            >취소</button>
          </div>
        </>
      )}
      {subPopup === "speed" && (
        <>
          <div style={{ marginBottom: 5 }}>공전 속도 조절</div>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={orbitSpeed}
            onChange={e => {
              setOrbitSpeed(e.target.value === "" ? "" : Number(e.target.value));
            }}
            style={{
              width: 64, border: "1px solid #444", background: "none",
              color: "#fff", borderRadius: 6, padding: "5px 7px", textAlign: "center"
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => {
                if (typeof orbitSpeed === "number" && orbitSpeed >= 0 && orbitSpeed <= 1) {
                  setNodeOrbitSpeed(node.id, orbitSpeed);
                  setSubPopup(null);
                } else {
                  setValidationMessage("숫자는 0에서 1 사이로 입력해주세요.");
                  setTimeout(() => {
                    setValidationMessage(null);
                  }, 3000);
                }
              }}
              style={{
                background: "#2ad", border: "none", color: "#fff",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
            >적용</button>
            <button
              onClick={() => {
                setOrbitSpeed(node.orbitSpeed ?? 0.3);
                setSubPopup(null);
              }}
              style={{
                background: "none", border: "1px solid #444", color: "#bbb",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
            >취소</button>
          </div>
        </>
      )}
      {subPopup === "design" && (
        <>
          <div style={{ marginBottom: 5 }}>행성 디자인 선택</div>
          <div style={{ display: "flex", gap: 16 }}>
            {/* 기본형 */}
            <button
              onClick={() => {
                setPlanetDesign(node.id, "default");
                setSubPopup(null);
              }}
              style={{ background: "none", border: node.planetDesign === "default" ? "2px solid #2ad" : "1px solid #444", borderRadius: 8, padding: 6, cursor: "pointer" }}
            >
              <svg width="40" height="40">
                <circle cx="20" cy="20" r="15" fill={node.color} stroke="#fff" strokeWidth="4" />
              </svg>
              <div style={{ fontSize: 13, color: "#fff", marginTop: 2 }}>기본형</div>
            </button>
            {/* 지구형 */}
            <button
              onClick={() => {
                setPlanetDesign(node.id, "earth");
                setSubPopup(null);
              }}
              style={{ background: "none", border: node.planetDesign === "earth" ? "2px solid #2ad" : "1px solid #444", borderRadius: 8, padding: 6, cursor: "pointer" }}
            >
              <svg width="40" height="40">
                <circle cx="20" cy="20" r="15" fill="#3af" stroke="#1e7" strokeWidth="7" />
                <ellipse cx="25" cy="15" rx="8" ry="3" fill="#1e7" opacity="0.7" />
                <ellipse cx="10" cy="25" rx="5" ry="2" fill="#fff" opacity="0.3" />
              </svg>
              <div style={{ fontSize: 13, color: "#fff", marginTop: 2 }}>지구형</div>
            </button>
            {/* 고리형 */}
            <button
              onClick={() => {
                setPlanetDesign(node.id, "ringed");
                setSubPopup(null);
              }}
              style={{ background: "none", border: node.planetDesign === "ringed" ? "2px solid #2ad" : "1px solid #444", borderRadius: 8, padding: 6, cursor: "pointer" }}
            >
              <svg width="40" height="40">
                <ellipse cx="20" cy="20" rx="20" ry="7" fill="none" stroke="#e6c07b" strokeWidth="5" opacity="0.7" />
                <circle cx="20" cy="20" r="15" fill="#e6c07b" stroke="#b88f4a" strokeWidth="4" />
                <ellipse cx="20" cy="28" rx="13" ry="3" fill="#fff2" />
                <ellipse cx="20" cy="14" rx="10" ry="2" fill="#fff3" />
              </svg>
              <div style={{ fontSize: 13, color: "#fff", marginTop: 2 }}>고리형</div>
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => setSubPopup(null)}
              style={{
                background: "none", border: "1px solid #444", color: "#bbb",
                borderRadius: 6, padding: "2px 13px", cursor: "pointer"
              }}
            >취소</button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {ReactDOM.createPortal(menuContent, document.body)}
      {subPopup && ReactDOM.createPortal(subPopupContent, document.body)}
      {validationMessage && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 50, 50, 0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 10001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {validationMessage}
        </div>,
        document.body
      )}
    </>
  );
}
