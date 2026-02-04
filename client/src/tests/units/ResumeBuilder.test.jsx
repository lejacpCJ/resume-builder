import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResumeBuilder from "../../pages/ResumeBuilder";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../configs/api";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  Link: ({ children }) => <a href="/app">{children}</a>,
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../configs/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    promise: async (fn) => {
      if (typeof fn === "function") await fn();
      return Promise.resolve();
    },
  },
}));

// Mock Child Components
vi.mock("../../components/PersonalInfoForm", () => ({
  default: () => <div data-testid="personal-info-form">PersonalInfoForm</div>,
}));
vi.mock("../../components/ProfessionalSummary", () => ({
  default: () => (
    <div data-testid="professional-summary">ProfessionalSummary</div>
  ),
}));
vi.mock("../../components/ExperienceForm", () => ({
  default: () => <div data-testid="experience-form">ExperienceForm</div>,
}));
vi.mock("../../components/EducationForm", () => ({
  default: () => <div data-testid="education-form">EducationForm</div>,
}));
vi.mock("../../components/ProjectForm", () => ({
  default: () => <div data-testid="project-form">ProjectForm</div>,
}));
vi.mock("../../components/SkillsForm", () => ({
  default: () => <div data-testid="skills-form">SkillsForm</div>,
}));
vi.mock("../../components/ResumePreview", () => ({
  default: () => <div data-testid="resume-preview">ResumePreview</div>,
}));
vi.mock("../../components/TemplateSector", () => ({
  default: () => <div data-testid="template-sector">TemplateSector</div>,
}));
vi.mock("../../components/ColorPicker", () => ({
  default: () => <div data-testid="color-picker">ColorPicker</div>,
}));

describe("ResumeBuilder Page", () => {
  const mockResumeData = {
    _id: "123",
    title: "Test Resume",
    personal_info: { full_name: "Test User" },
    professional_summary: "Summary",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  };

  beforeEach(() => {
    useParams.mockReturnValue({ resumeId: "123" });
    useSelector.mockReturnValue({ token: "mock-token" });
    api.get.mockResolvedValue({ data: { resume: mockResumeData } });
    vi.clearAllMocks();
  });

  it("fetches and renders initial state", async () => {
    render(<ResumeBuilder />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/api/resumes/get/123",
        expect.any(Object),
      );
    });

    expect(screen.getByTestId("personal-info-form")).toBeInTheDocument();
    expect(screen.getByTestId("resume-preview")).toBeInTheDocument();
  });

  it("navigates sections correctly", async () => {
    render(<ResumeBuilder />);
    await waitFor(() =>
      expect(screen.getByTestId("personal-info-form")).toBeInTheDocument(),
    );

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton); // To Summary
    expect(screen.getByTestId("professional-summary")).toBeInTheDocument();

    fireEvent.click(nextButton); // To Experience
    expect(screen.getByTestId("experience-form")).toBeInTheDocument();
  });

  it("saves resume data", async () => {
    render(<ResumeBuilder />);
    await waitFor(() =>
      expect(screen.getByTestId("personal-info-form")).toBeInTheDocument(),
    );

    api.put.mockResolvedValue({
      data: { message: "Saved", resume: mockResumeData },
    });

    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "/api/resumes/update",
        expect.any(FormData),
        expect.any(Object),
      );
    });
  });
});
