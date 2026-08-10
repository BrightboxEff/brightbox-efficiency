"use client";

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-border-muted"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pattern="^#[0-9A-Fa-f]{6}$"
          className="w-28 rounded-md border border-border-muted bg-white px-3 py-2 text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
        />
      </div>
    </div>
  );
}
