import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkPerformance, type MonthlyReading, type FlagStatus } from "@/lib/performance";
import PerformanceMonitorDashboard, {
  type MonitoredSystemWithStatus,
} from "@/components/PerformanceMonitorDashboard";

export const metadata = {
  title: "Performance Monitor — Brightbox Efficiency",
};

interface SystemRow {
  id: string;
  system_reference: string;
  postcode: string;
  address_line: string | null;
  system_size_kwp: number;
  monthly_baseline_kwh: number[];
  created_at: string;
}

interface ReadingRow {
  system_id: string;
  reading_month: number;
  reading_year: number;
  actual_kwh: number;
}

export default async function PerformanceMonitorPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/performance-monitor");

  const { data: systems } = await supabase
    .from("monitored_systems")
    .select("id, system_reference, postcode, address_line, system_size_kwp, monthly_baseline_kwh, created_at")
    .order("created_at", { ascending: false });

  const systemRows = (systems ?? []) as SystemRow[];
  const systemIds = systemRows.map((s) => s.id);

  let readingRows: ReadingRow[] = [];
  if (systemIds.length > 0) {
    const { data: readings } = await supabase
      .from("performance_readings")
      .select("system_id, reading_month, reading_year, actual_kwh")
      .in("system_id", systemIds)
      .order("reading_year", { ascending: true })
      .order("reading_month", { ascending: true });
    readingRows = (readings ?? []) as ReadingRow[];
  }

  const systemsWithStatus: MonitoredSystemWithStatus[] = systemRows.map((s) => {
    const ownReadings = readingRows.filter((r) => r.system_id === s.id);
    const monthlyReadings: MonthlyReading[] = ownReadings.map((r) => ({
      month: r.reading_month,
      actualKwh: r.actual_kwh,
      expectedKwh: s.monthly_baseline_kwh[r.reading_month - 1] ?? 0,
    }));
    const check = checkPerformance({ readings: monthlyReadings });

    return {
      id: s.id,
      systemReference: s.system_reference,
      postcode: s.postcode,
      addressLine: s.address_line,
      systemSizeKwp: s.system_size_kwp,
      monthlyBaselineKwh: s.monthly_baseline_kwh,
      readingCount: ownReadings.length,
      status: check.currentStatus as FlagStatus,
      summary: check.summary,
      likelyCause: check.likelyCause,
    };
  });

  return <PerformanceMonitorDashboard systems={systemsWithStatus} />;
}
