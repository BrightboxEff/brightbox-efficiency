"use client";

import { useState } from "react";

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onBlur={() => setOpen(false)}
        aria-label="More information"
        aria-expanded={open}
        className="ml-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-charcoal/40 text-[9px] font-semibold leading-none text-charcoal/50 transition hover:border-charcoal/70 hover:text-charcoal/80"
      >
        i
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-20 mb-2 w-44 -translate-x-1/2 rounded-md bg-charcoal px-2.5 py-2 text-left text-[11px] font-normal leading-snug normal-case tracking-normal text-cream shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
