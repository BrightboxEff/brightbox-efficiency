"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MONTH_LABELS } from "@/types";
import { BRAND } from "@/lib/brand";

interface GenerationChartProps {
  monthlyGenerationKwh: number[];
}

export default function GenerationChart({ monthlyGenerationKwh }: GenerationChartProps) {
  const data = monthlyGenerationKwh.map((kwh, i) => ({
    month: MONTH_LABELS[i],
    kwh,
  }));

  return (
    <div className="mt-8 rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-charcoal">Monthly generation (kWh)</h2>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BRAND.colors.borderMuted} />
            <XAxis dataKey="month" stroke={BRAND.colors.charcoal} fontSize={12} />
            <YAxis stroke={BRAND.colors.charcoal} fontSize={12} />
            <Tooltip
              formatter={(value: number) => [`${Math.round(value)} kWh`, "Generation"]}
              contentStyle={{
                borderColor: BRAND.colors.borderMuted,
                borderRadius: 6,
                fontSize: 13,
              }}
            />
            <Bar dataKey="kwh" fill={BRAND.colors.mossGreen} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
