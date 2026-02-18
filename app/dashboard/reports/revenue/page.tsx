"use client";

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  Activity,
  Package,
} from "lucide-react";

// Mock Data Imports
import customers from "@/app/mocks/data/customers.json";
import orders from "@/app/mocks/data/orders.json";
import products from "@/app/mocks/data/products.json";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
}

interface Order {
  productId: string;
  date: string;
  total: number | string;
}

interface Product {
  id: string;
  title: string;
  category: string;
}

/* ================= UI COMPONENTS (Shadcn Style) ================= */

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

/* ================= PAGE COMPONENT ================= */

export default function RevenuePage() {
  const customerData = customers as Customer[];
  const orderData = orders as Order[];
  const productData = products as Product[];

  /* ================= CALCULATIONS & MEMOS ================= */

  // 1. Product Map
  const productMap = useMemo(
    () => new Map(productData.map((p) => [p.id, p])),
    [productData],
  );

  // 2. Total Revenue
  const totalRevenue = useMemo(
    () => orderData.reduce((sum, o) => sum + Number(o.total || 0), 0),
    [orderData],
  );

  // 3. Monthly Metrics
  const { thisMonthRevenue, prevMonthRevenue, revenueGrowth } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    let thisMonth = 0;
    let lastMonth = 0;

    orderData.forEach((o) => {
      const d = new Date(o.date);
      const val = Number(o.total || 0);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        thisMonth += val;
      } else if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
        lastMonth += val;
      }
    });

    const growth =
      lastMonth === 0 ? 0 : ((thisMonth - lastMonth) / lastMonth) * 100;

    return {
      thisMonthRevenue: thisMonth,
      prevMonthRevenue: lastMonth,
      revenueGrowth: growth,
    };
  }, [orderData]);

  // 4. Average Order Value
  const avgOrderRevenue = useMemo(() => {
    if (!orderData.length) return 0;
    return totalRevenue / orderData.length;
  }, [totalRevenue, orderData]);

  // 5. Chart Data: Revenue History (Group by Month)
  const revenueHistory = useMemo(() => {
    const history: Record<string, number> = {};

    // Sort orders by date first
    const sortedOrders = [...orderData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    sortedOrders.forEach((order) => {
      const date = new Date(order.date);
      // Format: "Jan 24"
      const key = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      history[key] = (history[key] || 0) + Number(order.total || 0);
    });

    return Object.entries(history).map(([name, total]) => ({ name, total }));
  }, [orderData]);

  // 6. Chart Data: Top Categories
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    orderData.forEach((order) => {
      const product = productMap.get(order.productId);
      if (product) {
        cats[product.category] =
          (cats[product.category] || 0) + Number(order.total || 0);
      }
    });

    // Convert to array and take top 4 + others
    const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    const top4 = sorted.slice(0, 4).map(([name, value]) => ({ name, value }));
    const othersValue = sorted.slice(4).reduce((sum, [, val]) => sum + val, 0);

    if (othersValue > 0) {
      top4.push({ name: "Others", value: othersValue });
    }

    return top4;
  }, [orderData, productMap]);

  // 7. Top Products List
  const topProductsList = useMemo(() => {
    const prods: Record<string, number> = {};
    orderData.forEach((order) => {
      prods[order.productId] =
        (prods[order.productId] || 0) + Number(order.total || 0);
    });

    return Object.entries(prods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, revenue]) => ({
        id,
        name: productMap.get(id)?.title || "Unknown Product",
        category: productMap.get(id)?.category || "General",
        revenue,
      }));
  }, [orderData, productMap]);

  /* ================= COLORS FOR CHARTS ================= */
  const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#64748b"];

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Revenue Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            {" "}
            detailed overview of your financial performance.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            Export Report
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            Download CSV
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          trend={revenueGrowth}
          icon={DollarSign}
        />

        <KpiCard
          title="Avg. Order Value"
          value={`$${avgOrderRevenue.toFixed(2)}`}
          subtext="Per completed order"
          icon={CreditCard}
        />

        <KpiCard
          title="Orders This Month"
          value={orderData
            .filter(
              (o) => new Date(o.date).getMonth() === new Date().getMonth(),
            )
            .length.toString()}
          subtext="+12% from last month"
          icon={Package}
        />

        <KpiCard
          title="Active Customers"
          value={customerData.length.toString()}
          subtext="Total registered users"
          icon={Activity}
        />
      </div>

      {/* MAIN CHART SECTION */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* BAR CHART (REVENUE HISTORY) */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-sm text-slate-500">
              Monthly revenue performance for the current year.
            </p>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueHistory}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
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
                    dataKey="total"
                    fill="#0f172a"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* DONUT CHART (CATEGORIES) */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <p className="text-sm text-slate-500">
              Distribution across top product categories.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-slate-900">
                  ${totalRevenue.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">
                  Total Sales
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM SECTION: TOP PRODUCTS */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <p className="text-sm text-slate-500">
            Products contributing most to revenue.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topProductsList.map((product, i) => (
              <div key={product.id} className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs mr-4">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium leading-none text-slate-900">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{product.category}</span>
                    <span>
                      {((product.revenue / totalRevenue) * 100).toFixed(1)}% of
                      total
                    </span>
                  </div>
                  {/* Simple Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(product.revenue / topProductsList[0].revenue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function KpiCard({ title, value, trend, subtext, icon: Icon }: any) {
  const isPositive = trend > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs mt-1 flex items-center">
          {trend !== undefined ? (
            <>
              <span
                className={`flex items-center font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className="text-slate-500 ml-1"> from last month</span>
            </>
          ) : (
            <span className="text-slate-500">{subtext}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
