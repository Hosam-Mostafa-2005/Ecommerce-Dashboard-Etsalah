"use client";

import React, { useMemo } from "react";
import customers from "@/app/mocks/data/customers.json";
import {
  Users,
  DollarSign,
  ShoppingBag,
  Activity,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* =====================================================
   TYPES
===================================================== */
interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
}

/* =====================================================
   HELPER FUNCTIONS
===================================================== */
// استخراج الحروف الأولى للاسم (مثال: Ahmed Ali -> AA)
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/* =====================================================
   CUSTOM TOOLTIPS
===================================================== */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-gray-800 text-white text-xs rounded-lg shadow-xl p-3 backdrop-blur-sm">
        <p className="font-semibold mb-1">{label ? label : payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-gray-300 capitalize">{entry.name}:</span>
            <span className="font-mono font-medium">
              {entry.name === "Revenue" || entry.dataKey === "totalSpent"
                ? `$${entry.value.toLocaleString()}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* =====================================================
   MAIN PAGE COMPONENTS
===================================================== */

export default function CustomerInsightsPage() {
  const data = customers as Customer[];

  // --- Analytics Logic ---
  const metrics = useMemo(() => {
    const now = new Date();
    const newCustomers = data.filter((c) => {
      const joined = new Date(c.joined);
      const diffDays =
        (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    });

    const returningCustomers = data.length - newCustomers.length;
    const totalRevenue = data.reduce((s, c) => s + c.totalSpent, 0);
    const totalOrders = data.reduce((s, c) => s + c.orders, 0);

    const segments = {
      vip: data.filter((c) => c.totalSpent >= 1000),
      regular: data.filter((c) => c.totalSpent >= 200 && c.totalSpent < 1000),
      low: data.filter((c) => c.totalSpent < 200),
    };

    const topSpenders = [...data]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const topBuyers = [...data].sort((a, b) => b.orders - a.orders).slice(0, 5);

    return {
      newCustomers,
      returningCustomers,
      totalRevenue,
      totalOrders,
      segments,
      topSpenders,
      topBuyers,
    };
  }, [data]);

  // --- Chart Data ---
  const pieData = [
    { name: "VIP", value: metrics.segments.vip.length, color: "#8b5cf6" }, // Violet-500
    {
      name: "Regular",
      value: metrics.segments.regular.length,
      color: "#3b82f6",
    }, // Blue-500
    { name: "Low Value", value: metrics.segments.low.length, color: "#94a3b8" }, // Gray-400
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 space-y-8 font-sans text-slate-900">
      {/* HEADER Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Insights
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Overview of customer retention, segmentation, and top performers.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            Download Report
          </button>
          <button className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            Add Customer
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Customers"
          value={data.length}
          trend="+12%"
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          trend="+8.2%"
          icon={DollarSign}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatsCard
          title="Total Orders"
          value={metrics.totalOrders}
          trend="+5%"
          icon={ShoppingBag}
          color="text-violet-600"
          bg="bg-violet-50"
        />
        <StatsCard
          title="Active Rate"
          value={`${((metrics.returningCustomers / data.length) * 100).toFixed(0)}%`}
          trend="+2%"
          icon={Activity}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SEGMENTATION PIE CHART */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Customer Segments
            </h3>
            <p className="text-sm text-slate-500">
              Distribution based on spending
            </p>
          </div>

          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900">
                {data.length}
              </span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Users
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-center gap-4 text-sm">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP SPENDERS BAR CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Top Spenders
              </h3>
              <p className="text-sm text-slate-500">
                Highest revenue generating clients
              </p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.topSpenders}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 13, fill: "#64748b", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="totalSpent" radius={[0, 6, 6, 0]} name="Revenue">
                  {/* Hardcoded Gradient Look using mapping */}
                  {metrics.topSpenders.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#10b981" : "#34d399"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LISTS GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* NEW CUSTOMERS LIST */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Signups</h3>
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              Last 30 Days
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {metrics.newCustomers.length > 0 ? (
              metrics.newCustomers.slice(0, 5).map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(customer.joined).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No new customers found
              </div>
            )}
          </div>
        </div>

        {/* LOYAL CUSTOMERS LIST */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Most Loyal</h3>
            <span className="text-xs font-medium bg-violet-50 text-violet-700 px-2 py-1 rounded-full">
              By Orders
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {metrics.topBuyers.map((customer, index) => (
              <div
                key={customer.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {customer.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {customer.orders} completed orders
                    </p>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  ${customer.totalSpent.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */

function StatsCard({ title, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium">
        <span className="text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
          <ArrowUpRight size={12} /> {trend}
        </span>
        <span className="text-slate-400 ml-2">from last month</span>
      </div>
    </div>
  );
}
