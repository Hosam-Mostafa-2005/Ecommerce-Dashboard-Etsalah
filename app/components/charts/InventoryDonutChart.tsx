"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // Green, Amber, Red

interface Props {
  inStock?: number;
  lowStock?: number;
  outOfStock?: number;
}

export default function InventoryDonutChart({
  inStock = 0,
  lowStock = 0,
  outOfStock = 0,
}: Props) {
  const data = [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  return (
    // خلينا الارتفاع 100% عشان ياخد مساحة الكارت اللي برا
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            cornerRadius={5}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            itemStyle={{ color: "#1e293b", fontWeight: "bold" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
