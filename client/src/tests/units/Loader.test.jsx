import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from "../../components/Loader";

describe("Loader Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass(
      "flex items-center justify-center h-screen",
    );
  });

  it("contains the spinning element", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      "size-12 border-3 border-gray-400 border-t-transparent rounded-full",
    );
  });
});
