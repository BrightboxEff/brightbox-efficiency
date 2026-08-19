"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BreakevenSeries } from "@/lib/insights";
import { BRAND } from "@/lib/brand";

interface BreakevenChartProps {
  series: BreakevenSeries;
}

const gbp = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default function BreakevenChart({ series }: BreakevenChartProps) {
  return (
    <div className="mt-8 rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-charcoal">25-year cumulative position</h2>
      <p className="mt-1 text-sm text-charcoal/70">
        {series.breakevenYear
          ? `System pays for itself around year ${series.breakevenYear}, then keeps generating net savings.`
          : "This system doesn't break even within 25 years at the current inputs."}
      </p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series.points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="breakevenFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND.colors.mossGreen} stopOpacity={0.4} />
                <stop offset="95%" stopColor={BRAND.colors.mossGreen} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BRAND.colors.borderMuted} />
            <XAxis
              dataKey="year"
              stroke={BRAND.colors.charcoal}
              fontSize={12}
              label={{ value: "Year", position: "insideBottom", offset: -4, fontSize: 12 }}
            />
            <YAxis
              stroke={BRAND.colors.charcoal}
              fontSize={12}
              tickFormatter={(v) => gbp(v)}
              width={80}
            />
            <ReferenceLine y={0} stroke={BRAND.colors.charcoal} strokeOpacity={0.4} />
            <Tooltip
              formatter={(value: number) => [gbp(value), "Cumulative position"]}
              labelFormatter={(year) => `Year ${year}`}
              contentStyle={{
                borderColor: BRAND.colors.borderMuted,
                borderRadius: 6,
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeNetGbp"
              stroke={BRAND.colors.mossGreen}
              strokeWidth={2}
              fill="url(#breakevenFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
