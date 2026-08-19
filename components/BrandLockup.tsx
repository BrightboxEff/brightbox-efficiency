import Image from "next/image";

interface BrandLockupProps {
  size?: "sm" | "lg";
}

const sizes = {
  sm: { icon: 22, primary: "text-sm", accent: "text-[10px]", gap: "gap-2" },
  lg: { icon: 40, primary: "text-xl", accent: "text-xs", gap: "gap-3" },
};

export default function BrandLockup({ size = "lg" }: BrandLockupProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <Image
        src="/brightbox-icon.png"
        alt=""
        width={237}
        height={219}
        priority={size === "lg"}
        style={{ width: s.icon, height: "auto" }}
      />
      <div className="leading-tight">
        <span className={`block font-semibold text-moss ${s.primary}`}>BRIGHTBOX</span>
        <span className={`block tracking-widest text-gold ${s.accent}`}>EFFICIENCY</span>
      </div>
    </div>
  );
}
