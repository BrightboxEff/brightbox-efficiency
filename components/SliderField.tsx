"use client";

interface SliderFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  required?: boolean;
  helperText?: string;
}

export default function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  required,
  helperText,
}: SliderFieldProps) {
  const numericValue = value === "" ? min : Number(value);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-charcoal">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            id={id}
            type="number"
            required={required}
            min={0}
            step={step}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 rounded-md border border-border-muted bg-white px-2 py-1 text-right text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          />
          {unit && <span className="text-sm text-charcoal/60">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(numericValue, min), max)}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full accent-moss"
      />
      {helperText && <p className="mt-1 text-xs text-charcoal/50">{helperText}</p>}
    </div>
  );
}
