"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

const ROTATE_MS = 10000;

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  // Only one slide is ever mounted, so only one image downloads at a time —
  // this drives a fade-in transition each time the active slide changes,
  // rather than crossfading between two images that are both already loaded.
  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [active]);

  const slide = slides[active];

  return (
    <Image
      key={slide.src}
      src={slide.src}
      alt={slide.alt}
      fill
      priority={active === 0}
      sizes="(max-width: 1024px) 100vw, 1024px"
      className={`object-cover transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
