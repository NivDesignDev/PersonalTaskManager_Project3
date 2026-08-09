import { describe, test, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

// Mock the global network fetch interface completely to prevent real database hits during tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Simulates an empty database array on boot
  })
);

describe("Personal Task Manager Full-Stack UI Suite", () => {
  
  // TEST CASE 1: App Branding Title Validation
  test("1. Renders core application workspace branding title text", async () => {
    await act(async () => {
      render(<App />);
    });
    const brandElement = screen.getByText(/TaskManager/i);
    expect(brandElement).toBeInTheDocument();
  });

  // TEST CASE 2: Sidebar Filter Control Link Validation
  test("2. Displays the master All Tasks sidebar navigation filter control link", async () => {
    await act(async () => {
      render(<App />);
    });
    const allTasksButton = screen.getByRole("button", { name: /all tasks/i });
    expect(allTasksButton).toBeInTheDocument();
  });
  // TEST CASE 3: Workspace Account Initials Identity Badge Validation
  test("3. Renders the user account workspace account placeholder initials badge", async () => {
    await act(async () => {
      render(<App />);
    });
    const initialsBadge = screen.getByText("ND");
    expect(initialsBadge).toBeInTheDocument();
  });

  // TEST CASE 4: Active Navigation Tab Context Title Validation
  test("4. Dynamically prints the active application filter tab state inside window header", async () => {
    await act(async () => {
      render(<App />);
    });
    const headerContext = screen.getByRole("heading", { name: /all tasks/i });
    expect(headerContext).toBeInTheDocument();
  });

  // TEST CASE 5: Empty Dataset Dashboard Fallback Message Canvas Validation
  test("5. Displays customized dashed placeholder message canvas when database dataset is empty", async () => {
    await act(async () => {
      render(<App />);
    });
    const fallbackMessage = screen.getByText(/No tasks found here/i);
    expect(fallbackMessage).toBeInTheDocument();
  });

});




