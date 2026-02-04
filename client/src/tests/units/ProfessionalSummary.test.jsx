import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfessionalSummary from "../../components/ProfessionalSummary";
import api from "../../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

vi.mock("../../configs/api", () => ({
  default: { post: vi.fn() },
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn() },
}));

describe("ProfessionalSummary", () => {
  const mockOnChange = vi.fn();
  const mockSetResumeData = vi.fn();
  const mockData = "Experienced developer.";

  beforeEach(() => {
    useSelector.mockReturnValue({ token: "mock-token" });
    vi.clearAllMocks();
  });

  it("renders text area with data", () => {
    render(
      <ProfessionalSummary
        data={mockData}
        onChange={mockOnChange}
        setResumeData={mockSetResumeData}
      />,
    );
    expect(screen.getByDisplayValue(mockData)).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    render(
      <ProfessionalSummary
        data={mockData}
        onChange={mockOnChange}
        setResumeData={mockSetResumeData}
      />,
    );
    const textarea = screen.getByDisplayValue(mockData);
    fireEvent.change(textarea, { target: { value: "New summary" } });
    expect(mockOnChange).toHaveBeenCalledWith("New summary");
  });

  it("calls AI enhance", async () => {
    render(
      <ProfessionalSummary
        data={mockData}
        onChange={mockOnChange}
        setResumeData={mockSetResumeData}
      />,
    );
    api.post.mockResolvedValue({ data: { enhancedContent: "Better summary" } });

    const button = screen.getByRole("button", { name: /AI Enhance/i });
    fireEvent.click(button);

    // Check loading state text
    expect(screen.getByText(/Enhancing.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/ai/enhance-pro-sum",
        expect.objectContaining({
          userContent: expect.stringContaining(mockData),
        }),
        { headers: { Authorization: "mock-token" } },
      );
    });

    await waitFor(() => {
      expect(mockSetResumeData).toHaveBeenCalled();
    });
  });

  it("handles AI error", async () => {
    render(
      <ProfessionalSummary
        data={mockData}
        onChange={mockOnChange}
        setResumeData={mockSetResumeData}
      />,
    );
    api.post.mockRejectedValue(new Error("AI Failed"));

    const button = screen.getByRole("button", { name: /AI Enhance/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("AI Failed");
    });
  });
});
