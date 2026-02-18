"use client";

import React from "react";
import dynamic from "next/dynamic";

const CvDownloadButtonLazy = dynamic(
  () =>
    import("@/components/career/cv-download-button").then(
      (mod) => mod.CvDownloadButton,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-36 animate-pulse rounded-lg bg-[#333333]" />
    ),
  },
);

export function CvDownloadButtonDynamic(): React.ReactElement {
  return <CvDownloadButtonLazy />;
}
