import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EducationForm from "../../components/EducationForm";

describe("EducationForm", () => {
  const mockOnChange = vi.fn();
  const mockData = [
    {
      institution: "University of Test",
      degree: "Bachelor of Testing",
      field: "Computer Science",
      graduation_date: "2023-05",
      gpa: "4.0",
      is_current: false,
    },
  ];

  it("renders empty state correctly", () => {
    render(<EducationForm data={[]} onChange={mockOnChange} />);
    expect(screen.getByText(/No education added yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Education/i }),
    ).toBeInTheDocument();
  });

  it("renders education items correctly", () => {
    render(<EducationForm data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue("University of Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bachelor of Testing")).toBeInTheDocument();
  });

  it("calls onChange when adding a new education", () => {
    render(<EducationForm data={[]} onChange={mockOnChange} />);
    const addButton = screen.getByRole("button", { name: /Add Education/i });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
    const expectedNewItem = expect.arrayContaining([
      expect.objectContaining({
        institution: "",
        degree: "",
      }),
    ]);
    expect(mockOnChange).toHaveBeenCalledWith(expectedNewItem);
  });

  it("updates fields correctly", () => {
    render(<EducationForm data={mockData} onChange={mockOnChange} />);
    const institutionInput = screen.getByDisplayValue("University of Test");

    fireEvent.change(institutionInput, { target: { value: "New University" } });

    expect(mockOnChange).toHaveBeenCalled();
    const updatedData = [...mockData];
    updatedData[0] = { ...updatedData[0], institution: "New University" };
    expect(mockOnChange).toHaveBeenCalledWith(updatedData);
  });

  it("removes an education item", () => {
    render(<EducationForm data={mockData} onChange={mockOnChange} />);
    const buttons = screen.getAllByRole("button");

    const deleteButton = buttons.find(
      (btn) => !btn.textContent.includes("Add Education"),
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnChange).toHaveBeenCalledWith([]);
    } else {
      throw new Error("Delete button not found");
    }
  });
});
