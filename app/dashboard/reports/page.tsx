"use client";

import React, { useMemo } from "react";
import {
  MoreHorizontal,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Package,
  CheckCircle2,
  Calendar,
  ArrowDownToLine,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import SalesLineChart from "@/app/components/charts/SalesLineChart";
import orders from "@/app/mocks/data/orders.json";

/* ================= TYPES ================= */
interface Order {
  id: string;
  customerId: string;
  productId: string;
  date: string;
  total: number | string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

/* ================= HELPER COMPONENTS ================= */

// 1. KPI Card
const KpiCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
        {trend}
      </span>
      <span className="text-slate-400 ml-2">{subtext}</span>
    </div>
  </div>
);

// 2. Section Container
const DashboardSection = ({
  title,
  subtitle,
  children,
  className,
  action,
}: any) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col ${className}`}
  >
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action || (
        <button className="text-slate-400 hover:text-slate-600 transition">
          <MoreHorizontal size={20} />
        </button>
      )}
    </div>
    <div className="p-6 w-full h-full flex-1">{children}</div>
  </div>
);

/* ================= PAGE ================= */
export default function SalesAnalyticsPage() {
  const ordersArr: Order[] = orders as Order[];

  /* ===== DATA PROCESSING (useMemo) ===== */

  const analytics = useMemo(() => {
    // 1. Monthly Data (Existing)
    const monthlyTotals: Record<number, number> = {};
    const monthsNames = [
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

    // 2. Status Distribution
    const statusCounts: Record<string, number> = {
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    // 3. Daily Activity (By Day of Week)
    const dailyActivity: Record<number, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 4. Totals
    let totalRevenue = 0;
    let successfulOrders = 0;

    ordersArr.forEach((order) => {
      const date = new Date(order.date);
      const val = Number(order.total || 0);

      if (isNaN(date.getTime())) return;

      // Monthly
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex] = (monthlyTotals[monthIndex] || 0) + val;

      // Status
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

      // Daily
      const dayIndex = date.getDay();
      dailyActivity[dayIndex] += 1; // Count orders per day of week

      // KPIs
      totalRevenue += val;
      if (order.status === "Delivered") successfulOrders++;
    });

    // Formatting Monthly
    const monthlyChart = Object.keys(monthlyTotals)
      .map(Number)
      .sort((a, b) => a - b)
      .map((i) => ({
        month: monthsNames[i],
        sales: monthlyTotals[i],
      }));

    // Formatting Status (Pie Chart)
    const statusChart = Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
    }));

    // Formatting Daily (Bar Chart)
    const dailyChart = Object.keys(dailyActivity)
      .map(Number)
      .map((i) => ({
        day: dayNames[i],
        orders: dailyActivity[i],
      }));

    // KPI Values
    const totalOrders = ordersArr.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const successRate = totalOrders
      ? (successfulOrders / totalOrders) * 100
      : 0;

    // Recent Orders
    const recentOrders = [...ordersArr]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      monthlyChart,
      statusChart,
      dailyChart,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      successRate,
      recentOrders,
    };
  }, [ordersArr]);

  /* ===== COLORS ===== */
  const STATUS_COLORS: Record<string, string> = {
    Pending: "#f59e0b", // Amber
    Shipped: "#3b82f6", // Blue
    Delivered: "#10b981", // Green
    Cancelled: "#ef4444", // Red
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Sales Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            Deep dive into revenue, order status, and trends.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
            <Calendar size={16} /> Select Date
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-sm">
            <ArrowDownToLine size={16} /> Export
          </button>
        </div>
      </div>

      {/* === KPI GRID === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          trend="+12.5%"
          subtext="vs last month"
        />
        <KpiCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={Package}
          trend="+8.2%"
          subtext="new orders"
        />
        <KpiCard
          title="Avg. Order Value"
          value={`$${analytics.avgOrderValue.toFixed(0)}`}
          icon={TrendingUp}
          trend="+2.4%"
          subtext="per order"
        />
        <KpiCard
          title="Success Rate"
          value={`${analytics.successRate.toFixed(1)}%`}
          icon={CheckCircle2}
          trend="+1.2%"
          subtext="completion rate"
        />
      </div>

      {/* === MAIN CHARTS ROW === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance (Line Chart) - Takes 2 Cols */}
        <DashboardSection
          title="Revenue Trend"
          subtitle="Monthly financial performance"
          className="lg:col-span-2 min-h-[400px]"
        >
          {analytics.monthlyChart.length > 0 ? (
            <SalesLineChart data={analytics.monthlyChart} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={32} className="mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          )}
        </DashboardSection>

        {/* Order Status (Pie Chart) - Takes 1 Col */}
        <DashboardSection
          title="Order Status"
          subtitle="Distribution by current status"
          className="min-h-[400px]"
        >
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {analytics.statusChart.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={STATUS_COLORS[entry.name] || "#94a3b8"}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {analytics.statusChart.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[entry.name] }}
                  ></span>
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>

      {/* === SECONDARY ROW === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List - Takes 1 Col */}
        <DashboardSection
          title="Recent Transactions"
          subtitle="Last 5 processed orders"
        >
          <div className="space-y-4">
            {analytics.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order.id.slice(0, 6)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    ${order.total}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium 
                                ${
                                  order.status === "Delivered"
                                    ? "bg-green-50 text-green-700"
                                    : order.status === "Pending"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Daily Activity (Bar Chart) - Takes 2 Cols */}
        <DashboardSection
          title="Daily Order Volume"
          subtitle="Peak sales days of the week"
          className="lg:col-span-2"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.dailyChart}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
