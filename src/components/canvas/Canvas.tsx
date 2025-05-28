import React from "react";

const Canvas = () => {
  return (
    <div
      className="w-full h-screen bg-black relative"
      style={{
        // 우주 배경 느낌(색상만, 추후 이미지나 그라디언트로 커스텀 가능)
        background: "radial-gradient(ellipse at center, #222 0%, #000 100%)",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      {/* 초기에는 아무것도 없음 */}
      {/* 향후 별/행성/위성 추가 기능 및 안내 문구 등 추가 가능 */}
    </div>
  );
};

export default Canvas;