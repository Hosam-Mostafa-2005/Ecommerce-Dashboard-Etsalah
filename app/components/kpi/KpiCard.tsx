// app/components/kpis/KpiCard.tsx
import React from "react";

type Props = {
  title: string;
  value: string | number;
  delta?: string | number;
  subtitle?: string;
};

export default function KpiCard({ title, value, delta, subtitle }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {value}
          </div>
        </div>
        {delta !== undefined && (
          <div
            className={`text-sm font-medium ${
              String(delta).toString().includes("-")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {delta}
          </div>
        )}
      </div>
      {subtitle && <div className="mt-2 text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
}
