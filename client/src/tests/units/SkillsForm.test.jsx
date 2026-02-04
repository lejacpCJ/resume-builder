import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SkillsForm from "../../components/SkillsForm";

describe("SkillsForm", () => {
  const mockOnChange = vi.fn();
  const mockData = ["React", "Node.js"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders skills", () => {
    render(<SkillsForm data={mockData} onChange={mockOnChange} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("adds a skill via button", () => {
    render(<SkillsForm data={mockData} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText(/Enter a skill/i);
    fireEvent.change(input, { target: { value: "Python" } });

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([...mockData, "Python"]);
  });

  it("adds a skill via Enter key", () => {
    render(<SkillsForm data={mockData} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText(/Enter a skill/i);
    fireEvent.change(input, { target: { value: "Python" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockOnChange).toHaveBeenCalledWith([...mockData, "Python"]);
  });

  it("removes a skill", () => {
    render(<SkillsForm data={mockData} onChange={mockOnChange} />);
    const buttons = screen.getAllByRole("button");
    const removeButtons = buttons.filter(
      (btn) => !btn.textContent.includes("Add"),
    );

    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
      expect(mockOnChange).toHaveBeenCalledWith(["Node.js"]);
    } else {
      throw new Error("Remove buttons not found");
    }
  });

  it("does not add duplicate skill", () => {
    render(<SkillsForm data={mockData} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText(/Enter a skill/i);
    fireEvent.change(input, { target: { value: "React" } }); // Already exists

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
