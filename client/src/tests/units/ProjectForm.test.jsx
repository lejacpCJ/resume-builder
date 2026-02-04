import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectForm from "../../components/ProjectForm";

describe("ProjectForm", () => {
  const mockOnChange = vi.fn();
  const mockData = [
    {
      name: "Project A",
      type: "Web App",
      description: "Cool project.",
    },
  ];

  it("renders empty state/header correctly", () => {
    render(<ProjectForm data={[]} onChange={mockOnChange} />);
    expect(screen.getByText("Add Project")).toBeInTheDocument();
  });

  it("renders projects correctly", () => {
    render(<ProjectForm data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue("Project A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Web App")).toBeInTheDocument();
  });

  it("adds a project", () => {
    render(<ProjectForm data={[]} onChange={mockOnChange} />);
    fireEvent.click(screen.getByText("Add Project"));
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: "" })]),
    );
  });

  it("updates a project", () => {
    render(<ProjectForm data={mockData} onChange={mockOnChange} />);
    fireEvent.change(screen.getByDisplayValue("Project A"), {
      target: { value: "Project B" },
    });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("removes a project", () => {
    render(<ProjectForm data={mockData} onChange={mockOnChange} />);
    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(
      (btn) => !btn.textContent.includes("Add Project"),
    );
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnChange).toHaveBeenCalledWith([]);
    } else {
      throw new Error("Delete button not found");
    }
  });
});
