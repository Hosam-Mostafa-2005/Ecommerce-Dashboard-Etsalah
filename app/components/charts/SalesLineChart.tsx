"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

/* ================= TYPES ================= */
interface Props {
  data: {
    month: string;
    sales: number;
  }[];
}

/* ================= TOOLTIP ================= */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs">
      <p className="font-semibold mb-1">{d.month}</p>
      <p className="font-mono text-emerald-400">${d.sales.toLocaleString()}</p>
    </div>
  );
};

/* ================= COMPONENT ================= */
export default function SalesLineChart({ data }: Props) {
  if (!data?.length) return null;

  const lastPoint = data[data.length - 1];

  return (
    // ملاحظة: شيلنا الـ Card والـ Header من هنا عشان نتحكم فيهم من الصفحة الرئيسية
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
              stroke: "white",
              strokeWidth: 2,
            }}
          />

          {/* نقطة مضيئة عند آخر شهر */}
          <ReferenceDot
            x={lastPoint.month}
            y={lastPoint.sales}
            r={5}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
