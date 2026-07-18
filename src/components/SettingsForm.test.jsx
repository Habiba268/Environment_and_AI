import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsForm from "./SettingsForm";

describe("SettingsForm", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows validation errors when submitted empty", async () => {
    render(<SettingsForm />);

    fireEvent.click(screen.getByRole("button", { name: /save settings/i }));

    expect(
      await screen.findByText("First name is required")
    ).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("submits successfully with valid data and logs the values", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<SettingsForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByLabelText("Important only"));

    fireEvent.click(screen.getByRole("button", { name: /save settings/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Settings saved successfully!"
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        notification: "Important only",
      })
    );
  });

  it("does not submit and shows no success message when data is invalid", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<SettingsForm />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save settings/i }));

    expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("toggles dark mode, updates the document theme, and persists to localStorage", async () => {
    render(<SettingsForm />);

    const toggle = screen.getByLabelText(/dark mode/i);
    expect(toggle).not.toBeChecked();
    expect(document.documentElement.dataset.theme).toBe("light");

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
    expect(localStorage.getItem("settings-form-theme")).toBe("dark");
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
    });
    expect(localStorage.getItem("settings-form-theme")).toBe("light");
  });

  it("restores dark mode from localStorage on mount", () => {
    localStorage.setItem("settings-form-theme", "dark");

    render(<SettingsForm />);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByLabelText(/dark mode/i)).toBeChecked();
  });

  it("switches visible text when the language is changed", async () => {
    render(<SettingsForm />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save settings/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/language/i), {
      target: { value: "es" },
    });

    expect(await screen.findByText("Configuración")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /guardar configuración/i })
    ).toBeInTheDocument();
  });
});
