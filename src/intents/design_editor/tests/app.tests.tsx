/* eslint-disable formatjs/no-literal-string-in-jsx */
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { App } from "../app";

// ---------------------------------------------------------------------------
// Mock Canva SDK modules and apiKeyStore
// ---------------------------------------------------------------------------

// Simulate a key already saved so tests start at the idle screen
jest.mock("../lib/apiKeyStore", () => ({
  apiKeyStore: {
    get: jest.fn().mockReturnValue("sk-ant-test-key"),
    set: jest.fn(),
    clear: jest.fn(),
    isSet: jest.fn().mockReturnValue(true),
  },
}));

jest.mock("../hooks/useExport", () => ({
  useExport: jest.fn(() => ({
    phase: "idle",
    run: jest.fn().mockResolvedValue("base64data"),
    error: null,
  })),
}));

jest.mock("../hooks/useTranslate", () => ({
  useTranslate: jest.fn(() => ({
    translate: jest.fn().mockResolvedValue([
      {
        original: "Smart Energy",
        a: "Розумна Енергія",
        b: "Інтелектуальна Енергія",
        c: "Економна Енергія",
      },
    ]),
    isLoading: false,
    error: null,
  })),
}));

jest.mock("../lib/applyTranslation", () => ({
  applyTranslation: jest.fn().mockResolvedValue({ matched: true }),
  applyAllTranslations: jest
    .fn()
    .mockResolvedValue(new Map([["Smart Energy", true]])),
  readTextElements: jest.fn().mockResolvedValue(["Smart Energy"]),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderInTestProvider(node: ReactNode) {
  return render(
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>
    </TestAppI18nProvider>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("App state machine", () => {
  it("renders idle screen with Analyze button on initial load", () => {
    renderInTestProvider(<App />);
    expect(screen.queryByText(/Analyze & Translate page/i)).not.toBeNull();
  });

  it("shows review table after successful analyze flow", async () => {
    renderInTestProvider(<App />);

    fireEvent.click(screen.getByText(/Analyze & Translate page/i));

    await waitFor(() => {
      expect(screen.queryByText(/elements found/i)).not.toBeNull();
    });

    expect(screen.queryByText("Smart Energy")).not.toBeNull();
    expect(screen.queryByText("Розумна Енергія")).not.toBeNull();
  });

  it("transitions to done screen when Finish is clicked", async () => {
    renderInTestProvider(<App />);
    fireEvent.click(screen.getByText(/Analyze & Translate page/i));

    await waitFor(() => screen.getByText(/elements found/i));

    fireEvent.click(screen.getByText(/Finish/i));

    expect(screen.queryByText(/translated/i)).not.toBeNull();
  });

  it("returns to idle when Cancel is clicked", async () => {
    renderInTestProvider(<App />);
    fireEvent.click(screen.getByText(/Analyze & Translate page/i));

    await waitFor(() => screen.getByText(/elements found/i));
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText(/Analyze & Translate page/i)).not.toBeNull();
    });
  });
});
