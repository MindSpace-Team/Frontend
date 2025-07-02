import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Canvas from "./Canvas";

// Mock next/image
jest.mock("next/image", () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt || "mocked image"} />;
});

// Mock useBackgroundStore
jest.mock("@/store/backgroundStore", () => ({
  useBackgroundStore: () => "/test-bg.jpg",
}));

describe("Canvas", () => {
  it("renders background image and svg area", () => {
    render(
      <Canvas>
        <svg><circle cx="10" cy="10" r="5" /></svg>
      </Canvas>
    );
    expect(screen.getByAltText("background")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/test-bg.jpg");
    // SVG 영역이 렌더링되는지 확인
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onCanvasContextMenu when right-clicked on svg", () => {
    const handleContextMenu = jest.fn();
    render(
      <Canvas onCanvasContextMenu={handleContextMenu}>
        <svg><rect x="0" y="0" width="100" height="100" /></svg>
      </Canvas>
    );
    const svg = document.querySelector("svg");
    fireEvent.contextMenu(svg!);
    expect(handleContextMenu).toHaveBeenCalled();
  });
}); 