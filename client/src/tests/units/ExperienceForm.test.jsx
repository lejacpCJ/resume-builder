import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ExperienceForm from "../../components/ExperienceForm";
import api from "../../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../configs/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("ExperienceForm", () => {
  const mockOnChange = vi.fn();
  const mockData = [
    {
      company: "Tech Corp",
      position: "Developer",
      start_date: "2022-01",
      end_date: "2023-01",
      description: "Wrote code.",
      is_current: false,
    },
  ];

  beforeEach(() => {
    useSelector.mockReturnValue({
      token: "mock-token",
    });
    vi.clearAllMocks();
  });

  it("renders empty state correctly", () => {
    render(<ExperienceForm data={[]} onChange={mockOnChange} />);
    expect(
      screen.getByText(/No work experience added yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Experience/i }),
    ).toBeInTheDocument();
  });

  it("renders experience items correctly", () => {
    render(<ExperienceForm data={mockData} onChange={mockOnChange} />);
    expect(screen.getByDisplayValue("Tech Corp")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Developer")).toBeInTheDocument();
  });

  it("adds a new experience item", () => {
    render(<ExperienceForm data={[]} onChange={mockOnChange} />);
    const addButton = screen.getByRole("button", { name: /Add Experience/i });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
    const expectedNewItem = expect.arrayContaining([
      expect.objectContaining({
        company: "",
        position: "",
      }),
    ]);
    expect(mockOnChange).toHaveBeenCalledWith(expectedNewItem);
  });

  it("removes an experience item", () => {
    render(<ExperienceForm data={mockData} onChange={mockOnChange} />);
    const buttons = screen.getAllByRole("button");

    const deleteButton = buttons.find((btn) => !btn.textContent);

    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnChange).toHaveBeenCalledWith([]);
    } else {
      // Fallback: look for the one with red class if textContent check fails
      const redButtons = document.querySelectorAll(".text-red-500");
      if (redButtons.length > 0) {
        fireEvent.click(redButtons[0]);
        expect(mockOnChange).toHaveBeenCalledWith([]);
      } else {
        throw new Error("Delete button not found");
      }
    }
  });

  it("updates experience fields", () => {
    render(<ExperienceForm data={mockData} onChange={mockOnChange} />);
    const companyInput = screen.getByDisplayValue("Tech Corp");
    fireEvent.change(companyInput, { target: { value: "New Company" } });

    expect(mockOnChange).toHaveBeenCalled();
    const updatedData = [...mockData];
    updatedData[0] = { ...updatedData[0], company: "New Company" };
    expect(mockOnChange).toHaveBeenCalledWith(updatedData);
  });

  it("calls AI enhance API", async () => {
    render(<ExperienceForm data={mockData} onChange={mockOnChange} />);

    api.post.mockResolvedValue({
      data: { enhancedContent: "Enhanced description" },
    });

    const enhanceButton = screen.getByText(/Enhance with AI/i);
    fireEvent.click(enhanceButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "api/ai/enhance-job-desc",
        expect.objectContaining({
          userContent: expect.stringContaining("enhance this job description"),
        }),
        { headers: { Authorization: "mock-token" } },
      );
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      const updatedData = [...mockData];
      updatedData[0] = {
        ...updatedData[0],
        description: "Enhanced description",
      };
      expect(mockOnChange).toHaveBeenCalledWith(updatedData);
    });
  });

  it("handles AI API error", async () => {
    render(<ExperienceForm data={mockData} onChange={mockOnChange} />);

    const errorMessage = "API Error";
    api.post.mockRejectedValue(new Error(errorMessage));

    const enhanceButton = screen.getByText(/Enhance with AI/i);
    fireEvent.click(enhanceButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
