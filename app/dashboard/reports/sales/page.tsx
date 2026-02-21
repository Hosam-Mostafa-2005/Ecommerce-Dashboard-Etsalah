"use client";

import React, { useMemo } from "react";
import SalesLineChart from "@/app/components/charts/SalesLineChart";
import orders from "@/app/mocks/data/orders.json";
import {
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

/* ================= TYPES ================= */
interface Order {
  id: string;
  customerId: string;
  productId: string;
  date: string;
  total: number | string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

/* ================= HELPER ================= */

const KpiCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-white rounded-xl border shadow-sm p-5">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 bg-slate-100 rounded-lg">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

/* ================= PAGE ================= */

export default function SalesAnalyticsPage() {
  const ordersArr: Order[] = orders as Order[];

  /* ===== MONTHLY SALES ===== */

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const totals = new Array(12).fill(0);

    ordersArr.forEach((order) => {
      const d = new Date(order.date);
      if (!isNaN(d.getTime())) {
        totals[d.getMonth()] += Number(order.total);
      }
    });

    return months.map((m, i) => ({
      month: m,
      sales: totals[i],
    }));
  }, [ordersArr]);

  /* ===== KPI CALCULATIONS ===== */

  const stats = useMemo(() => {
    const totalRevenue = monthlyData.reduce((s, m) => s + m.sales, 0);
    const totalOrders = ordersArr.length;
    const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

    const bestMonth = monthlyData.reduce((a, b) => (a.sales > b.sales ? a : b));

    const worstMonth = monthlyData.reduce((a, b) =>
      a.sales < b.sales ? a : b,
    );

    const last = monthlyData[monthlyData.length - 1]?.sales || 0;
    const prev = monthlyData[monthlyData.length - 2]?.sales || 0;

    const growth = prev === 0 ? 0 : ((last - prev) / prev) * 100;

    return {
      totalRevenue,
      totalOrders,
      avgOrder,
      bestMonth,
      worstMonth,
      growth,
    };
  }, [monthlyData, ordersArr]);

  /* ================= UI ================= */

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
        <p className="text-slate-500">Monthly revenue performance overview.</p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <KpiCard
          title="Avg Order Value"
          value={`$${stats.avgOrder.toFixed(0)}`}
          icon={BarChart3}
        />
        <KpiCard
          title="Monthly Growth"
          value={`${stats.growth.toFixed(1)}%`}
          icon={TrendingUp}
        />
      </div>

      {/* SALES CHART CARD */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Sales Performance</h2>
            <p className="text-sm text-slate-500">
              Monthly revenue trend over the current year
            </p>
          </div>

          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="w-full h-[360px]">
            <SalesLineChart data={monthlyData} />
          </div>
        </div>

        {/* MINI STATS */}
        <div className="border-t p-6 grid grid-cols-3 text-center text-sm">
          <div>
            <p className="text-slate-500">Best Month</p>
            <p className="font-bold text-emerald-600">
              {stats.bestMonth.month}
            </p>
            <p className="text-xs text-slate-400">
              ${stats.bestMonth.sales.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Worst Month</p>
            <p className="font-bold text-red-500">{stats.worstMonth.month}</p>
            <p className="text-xs text-slate-400">
              ${stats.worstMonth.sales.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Year Total</p>
            <p className="font-bold text-slate-900">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* INSIGHTS BOX */}
      <div className="bg-linear-to-r from-orange-300 to-grey-700 text-black rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-2">📊 Performance Insight</h3>

        <p className="text-sm opacity-90">
          Your best performing month was{" "}
          <span className="font-bold">{stats.bestMonth.month}</span> generating{" "}
          <span className="font-bold">
            ${stats.bestMonth.sales.toLocaleString()}
          </span>
          . Monthly growth is currently{" "}
          <span className="font-bold">{stats.growth.toFixed(1)}%</span>.
        </p>
      </div>
    </div>
  );
}
