"use client";

import React from "react";
import dynamic from "next/dynamic";

interface CvLabels {
  download: string
  generating: string
  ariaReady: string
  ariaLoading: string
}

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

interface CvDownloadButtonDynamicProps {
  readonly labels: CvLabels;
}

export function CvDownloadButtonDynamic({ labels }: CvDownloadButtonDynamicProps): React.ReactElement {
  return <CvDownloadButtonLazy labels={labels} />;
}
