import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockedFunction } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

vi.mock("@react-pdf/renderer", () => {
  const MockPDFDownloadLink = vi.fn(
    ({
      children,
    }: {
      children: (state: { loading: boolean }) => React.ReactNode;
    }) =>
      React.createElement(
        "div",
        { "data-testid": "pdf-download-link" },
        children({ loading: false }),
      ),
  );

  return {
    PDFDownloadLink: MockPDFDownloadLink,
    Document: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", null, children),
    Page: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", null, children),
    Text: ({ children }: { children: React.ReactNode }) =>
      React.createElement("span", null, children),
    View: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", null, children),
    StyleSheet: {
      create: <T extends Record<string, object>>(styles: T): T => styles,
    },
    Font: {
      register: vi.fn(),
    },
  };
});

import { CvDownloadButton } from "@/components/career/cv-download-button";
import { PDFDownloadLink } from "@react-pdf/renderer";

type RenderPropFn = (props: {
  document: React.ReactElement;
  fileName?: string;
  children: (state: { loading: boolean }) => React.ReactNode;
}) => React.ReactElement;

const mockedPDFDownloadLink = PDFDownloadLink as unknown as MockedFunction<RenderPropFn>;

describe("CvDownloadButton", () => {
  beforeEach(() => {
    mockedPDFDownloadLink.mockImplementation(
      ({ children }: Parameters<RenderPropFn>[0]) =>
        React.createElement(
          "div",
          { "data-testid": "pdf-download-link" },
          children({ loading: false }),
        ),
    );
  });

  it("renders a button with the download CV label when ready", () => {
    render(<CvDownloadButton />);

    const button = screen.getByRole("button", { name: /descargar cv en pdf/i });
    expect(button).toBeInTheDocument();
  });

  it("button is enabled when the PDF is ready", () => {
    render(<CvDownloadButton />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("renders a spinner and loading label when PDF is generating", () => {
    mockedPDFDownloadLink.mockImplementationOnce(
      ({ children }: Parameters<RenderPropFn>[0]) =>
        React.createElement(
          "div",
          { "data-testid": "pdf-download-link" },
          children({ loading: true }),
        ),
    );

    const { container } = render(<CvDownloadButton />);

    const button = screen.getByRole("button", {
      name: /generando pdf del cv/i,
    });
    expect(button).toBeDisabled();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("accepts a custom fileName prop without throwing", () => {
    expect(() =>
      render(<CvDownloadButton fileName="custom-cv.pdf" />),
    ).not.toThrow();
  });

  it("renders inside the PDFDownloadLink wrapper", () => {
    render(<CvDownloadButton />);

    expect(screen.getByTestId("pdf-download-link")).toBeInTheDocument();
  });
});
