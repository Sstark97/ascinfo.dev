"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CvPdfDocument } from "@/components/career/cv-pdf-document";
import { cvData } from "@/src/lib/career/cv-data";

interface CvDownloadButtonProps {
  readonly fileName?: string;
}

export function CvDownloadButton({
  fileName,
}: CvDownloadButtonProps): React.ReactElement {
  const resolvedFileName = fileName ?? "aitor-santana-cv.pdf";

  return (
    <PDFDownloadLink
      document={<CvPdfDocument data={cvData} />}
      fileName={resolvedFileName}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          type="button"
          disabled={loading}
          aria-label={
            loading
              ? "Generando PDF del CV, por favor espera"
              : "Descargar CV en PDF"
          }
          className={[
            "inline-flex items-center gap-2 rounded-lg px-5 py-2.5",
            "border border-[#FCA311] bg-[#FCA311]/10 font-mono text-sm font-medium text-[#FCA311]",
            "transition-all duration-200",
            "hover:bg-[#FCA311]/20 hover:shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCA311] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]",
            "cursor-pointer disabled:cursor-wait disabled:opacity-50",
          ].join(" ")}
        >
          {loading ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-[#FCA311]/30 border-t-[#FCA311]"
              />
              Generando PDF...
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Descargar CV
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}
