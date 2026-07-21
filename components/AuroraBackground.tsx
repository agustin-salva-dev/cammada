"use client";

import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("@/components/Aurora"), {
  ssr: false,
});

interface AuroraBackgroundProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
}

export default function AuroraBackground(props: AuroraBackgroundProps) {
  return <Aurora {...props} />;
}
