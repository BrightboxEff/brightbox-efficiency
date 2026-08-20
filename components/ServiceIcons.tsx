/**
 * components/ServiceIcons.tsx
 * Small line icons for the landing page's service cards. Inline SVG rather
 * than an icon library dependency — each inherits colour via currentColor.
 */

const shared = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CalculatorIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <rect x="4" y="2.5" width="16" height="19" rx="2" />
      <line x1="8" y1="6.5" x2="16" y2="6.5" />
      <circle cx="8" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MaintenanceIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <path d="M14.7 6.3a3.5 3.5 0 0 1-4.6 4.6L4.5 16.5a1.5 1.5 0 0 0 2.1 2.1l5.6-5.6a3.5 3.5 0 0 1 4.6-4.6l-2.1 2.1-1.5-1.5 2.1-2.1z" />
      <circle cx="6" cy="18" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TutoringIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <path d="M2 8.5 12 4l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6 10.8v4.4c0 1.2 2.7 2.3 6 2.3s6-1.1 6-2.3v-4.4" />
      <path d="M20 9v5.5" />
    </svg>
  );
}

export function SurveyIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <path d="M7 3.5h8l3 3v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M15 3.5v3h3" />
      <path d="M8.5 12.5h7M8.5 15.5h7M8.5 9.5h4" />
    </svg>
  );
}

export function CostIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 8.8c-.4-.7-1.3-1.2-2.5-1.2-1.7 0-3 1-3 2.4s1.3 2 3 2.4c1.7.4 3 1 3 2.4 0 1.4-1.3 2.4-3 2.4-1.2 0-2.1-.5-2.5-1.2" />
      <path d="M12 6v1.6M12 16.4V18" />
    </svg>
  );
}

export function BatteryIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <rect x="3" y="7" width="16" height="10" rx="1.5" />
      <path d="M20.5 10v4" />
      <path d="M12.5 9.5 9.5 13h3l-3 3.5" />
    </svg>
  );
}

export function ReceiptIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} {...shared}>
      <path d="M6 3.5h12v17l-2.2-1.5-2.2 1.5-2.1-1.5-2.1 1.5-2.2-1.5L6 20.5z" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" />
    </svg>
  );
}
