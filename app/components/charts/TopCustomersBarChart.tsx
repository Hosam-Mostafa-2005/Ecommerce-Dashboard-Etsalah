"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Customer {
  id: string;
  name: string;
  totalSpent: number;
}

interface Props {
  customers?: Customer[];
}

export default function TopCustomersBarChart({ customers = [] }: Props) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={customers}
          layout="vertical"
          margin={{ left: 10, right: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 13, fill: "#475569", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Bar dataKey="totalSpent" radius={[0, 6, 6, 0]} barSize={24}>
            {customers.map((_, index) => (
              <Cell key={index} fill={index === 0 ? "#3b82f6" : "#94a3b8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
