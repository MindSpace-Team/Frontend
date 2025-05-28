import React from "react";

type ContextMenuProps = {
  x: number;
  y: number;
  options: { label: string; onClick: () => void }[];
  onClose: () => void;
};

export default function ContextMenu({ x, y, options, onClose }: ContextMenuProps) {
  React.useEffect(() => {
    const close = () => onClose();
    const timer = setTimeout(() => {
      window.addEventListener("mousedown", close);
    }, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", close);
    };
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        background: "#222",
        color: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 12px #0007",
        zIndex: 999,
        minWidth: 90,
        padding: 6,
        fontSize: 15,
        userSelect: "none",
      }}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    >
      {options.map(opt => (
        <div
          key={opt.label}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: 6,
            transition: "background 0.15s",
          }}
          onClick={opt.onClick}
          onMouseDown={e => e.stopPropagation()}
          onMouseUp={e => e.stopPropagation()}
          onContextMenu={e => e.preventDefault()}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}