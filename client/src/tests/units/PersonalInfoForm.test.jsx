import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PersonalInfoForm from "../../components/PersonalInfoForm";

describe("PersonalInfoForm", () => {
  const mockOnChange = vi.fn();
  const mockSetRemoveBackground = vi.fn();
  const mockData = {
    full_name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    location: "Taipei",
    linkedin: "https://linkedin.com/in/johndoe",
    website: "https://johndoe.com",
    image: "http://example.com/avatar.jpg",
  };

  it("renders all fields correctly", () => {
    render(
      <PersonalInfoForm
        data={mockData}
        onChange={mockOnChange}
        removeBackground={false}
        setRemoveBackground={mockSetRemoveBackground}
      />,
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  it("calls onChange when fields are updated", () => {
    render(
      <PersonalInfoForm
        data={mockData}
        onChange={mockOnChange}
        removeBackground={false}
        setRemoveBackground={mockSetRemoveBackground}
      />,
    );

    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "Jane Doe",
      }),
    );
  });

  it("handles image upload", () => {
    const { container } = render(
      <PersonalInfoForm
        data={mockData}
        onChange={mockOnChange}
        removeBackground={false}
        setRemoveBackground={mockSetRemoveBackground}
      />,
    );

    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    const fileInput = container.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        image: file,
      }),
    );
  });

  it("handles remove background toggle", () => {
    const dataWithImageFile = {
      ...mockData,
      image: new File([""], "photo.png", { type: "image/png" }),
    };

    render(
      <PersonalInfoForm
        data={dataWithImageFile}
        onChange={mockOnChange}
        removeBackground={false}
        setRemoveBackground={mockSetRemoveBackground}
      />,
    );

    const toggle = screen.getByRole("checkbox");
    fireEvent.click(toggle);
    expect(mockSetRemoveBackground).toHaveBeenCalled();
  });
});
