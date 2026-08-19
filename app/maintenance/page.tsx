import { BRAND } from "@/lib/brand";

export default function MaintenanceConsultationPage() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-semibold text-charcoal">Maintenance Consultation</h1>
      <p className="mt-3 text-charcoal/70">Coming soon.</p>
      <p className="mt-6 text-sm text-charcoal/70">
        For more details in the meantime, email{" "}
        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="font-medium text-moss underline underline-offset-2"
        >
          {BRAND.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
