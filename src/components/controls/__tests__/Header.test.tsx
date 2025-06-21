import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../header/Header";

describe("Header component", () => {
  it("renders navigation links", () => {
    render(<Header />);

    // Check for navigation links
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Canvas")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
}); 