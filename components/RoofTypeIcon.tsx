interface RoofTypeIconProps {
  type: "pitched" | "hip" | "flat";
  className?: string;
}

const svgProps = {
  viewBox: "0 0 32 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function RoofTypeIcon({ type, className }: RoofTypeIconProps) {
  if (type === "pitched") {
    return (
      <svg {...svgProps} className={className} aria-hidden="true">
        <path d="M4 12 L16 4 L28 12" />
        <path d="M7 12 V20 H25 V12" />
      </svg>
    );
  }

  if (type === "hip") {
    return (
      <svg {...svgProps} className={className} aria-hidden="true">
        <path d="M4 12 L11 5 H21 L28 12" />
        <path d="M7 12 V20 H25 V12" />
      </svg>
    );
  }

  return (
    <svg {...svgProps} className={className} aria-hidden="true">
      <path d="M5 8 V6 H27 V8" />
      <path d="M7 8 V20 H25 V8" />
    </svg>
  );
}
