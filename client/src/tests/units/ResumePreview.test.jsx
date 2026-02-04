import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResumePreview from "../../components/ResumePreview";

// Mock templates
vi.mock("../../components/templates/ClassicTemplate", () => ({
  default: () => <div data-testid="classic">Classic</div>,
}));
vi.mock("../../components/templates/ModernTemplate", () => ({
  default: () => <div data-testid="modern">Modern</div>,
}));
vi.mock("../../components/templates/MinimalTemplate", () => ({
  default: () => <div data-testid="minimal">Minimal</div>,
}));
vi.mock("../../components/templates/MinimalImageTemplate", () => ({
  default: () => <div data-testid="minimal-image">MinimalImage</div>,
}));

describe("ResumePreview", () => {
  const mockData = {};

  it("renders classic template by default or explicit", () => {
    render(<ResumePreview data={mockData} template="classic" />);
    expect(screen.getByTestId("classic")).toBeInTheDocument();
  });

  it("renders modern template", () => {
    render(<ResumePreview data={mockData} template="modern" />);
    expect(screen.getByTestId("modern")).toBeInTheDocument();
  });

  it("renders minimal template", () => {
    render(<ResumePreview data={mockData} template="minimal" />);
    expect(screen.getByTestId("minimal")).toBeInTheDocument();
  });

  it("renders minimal-image template", () => {
    render(<ResumePreview data={mockData} template="minimal-image" />);
    expect(screen.getByTestId("minimal-image")).toBeInTheDocument();
  });
});
