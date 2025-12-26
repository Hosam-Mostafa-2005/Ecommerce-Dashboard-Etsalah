"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Customer {
  id: string;
  name: string;
  totalSpent: number;
}

export default function TopCustomersBarChart({
  customers,
}: {
  customers: Customer[];
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={customers} layout="vertical">
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="totalSpent" radius={[0, 6, 6, 0]} fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
