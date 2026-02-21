"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import SalesLineChart from "../components/charts/SalesLineChart";
import KpiCard from "../components/kpi/KpiCard";
import InventoryDonutChart from "../components/charts/InventoryDonutChart";
import TopCustomersBarChart from "../components/charts/TopCustomersBarChart";

import customers from "../mocks/data/customers.json";
import orders from "../mocks/data/orders.json";
import products from "../mocks/data/products.json";

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

/* ================= TYPES ================= */
interface Order {
  id: string;
  customerId: string;
  productId: string;
  date: string;
  total: number | string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

/* ================= PAGE ================= */
export default function DashboardPage() {
  const [visibleCount, setVisibleCount] = useState(5);

  const ordersArr: Order[] = orders as Order[];

  // --- Memoized Data Prep ---
  const {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    recentOrders,
    monthlySales,
  } = useMemo(() => {
    let revenue = 0;
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

    ordersArr.forEach((o) => {
      const val = Number(o.total || 0);
      revenue += val;

      const d = new Date(o.date);
      if (!isNaN(d.getTime())) {
        monthlyTotals[d.getMonth()] = (monthlyTotals[d.getMonth()] || 0) + val;
      }
    });

    const monthlyData = Object.keys(monthlyTotals)
      .map(Number)
      .sort((a, b) => a - b)
      .map((i) => ({
        month: monthsNames[i],
        sales: monthlyTotals[i],
      }));

    const sortedOrders = [...ordersArr].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return {
      totalOrders: ordersArr.length,
      totalRevenue: revenue,
      avgOrderValue: ordersArr.length ? revenue / ordersArr.length : 0,
      recentOrders: sortedOrders,
      monthlySales: monthlyData,
    };
  }, [ordersArr]);

  // Product Stats
  const { totalProducts, inStock, outOfStock, lowStock, topRatedProduct } =
    useMemo(() => {
      const sorted = [...products].sort((a, b) => b.rating - a.rating);
      return {
        totalProducts: products.length,
        inStock: products.filter((p) => p.stock > 0).length,
        outOfStock: products.filter((p) => p.stock === 0).length,
        lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
        topRatedProduct: sorted[0],
      };
    }, []);

  // Customer Stats
  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a: any, b: any) => b.orders - a.orders)
      .slice(0, 5);
  }, []);

  const getCustomerName = (customerId: string): string => {
    const customer = (customers as Customer[]).find((c) => c.id === customerId);
    return customer ? customer.name : `Customer ID: ${customerId}`;
  };
  const MIN_ITEMS = 5;

  /* ================= UI ================= */
  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back. Here is your overview.
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          delta="+8.2%"
        />
        <KpiCard title="Total Orders" value={totalOrders} delta="-1.5%" />
        <KpiCard
          title="Total Customers"
          value={customers.length}
          delta="+2.1%"
        />
        <KpiCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(0)}`}
        />
      </section>

      {/* ================= ROW 1: MAIN CHARTS ================= */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales (Takes 2 columns on XL) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 xl:col-span-2 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Sales Trends
          </h2>
          {/* Important: Set explicit height for chart container */}
          <div className="flex-1 w-full h-[300px]">
            <SalesLineChart data={monthlySales} />
          </div>
        </div>

        {/* Inventory & Top Customers (Takes 1 column on XL) */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          {/* Inventory */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Inventory Overview
            </h2>
            {/* Explicit height here too */}
            <div className="h-[200px] w-full">
              <InventoryDonutChart
                inStock={inStock}
                lowStock={lowStock}
                outOfStock={outOfStock}
              />
            </div>
            <div className="flex justify-center gap-4 text-xs mt-4 font-medium">
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {inStock} In
              </span>
              <span className="text-amber-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {lowStock} Low
              </span>
              <span className="text-red-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {outOfStock} Out
              </span>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Top Customers
            </h2>
            {/* Explicit height */}
            <div className="flex-1 w-full min-h-[150px]">
              <TopCustomersBarChart customers={topCustomers} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROW 2: ORDERS & PRODUCTS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Takes 2 Columns) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              {recentOrders.slice(0, visibleCount).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getCustomerName(order.customerId)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-slate-900">
                      ${Number(order.total).toFixed(2)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Show More Logic */}
            <div className="flex justify-center mt-6">
              {visibleCount < recentOrders.length ? (
                visibleCount > MIN_ITEMS ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVisibleCount((prev) => prev + 5)}
                    >
                      Load More
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVisibleCount((prev) => prev - 5)}
                    >
                      Show Less
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                  >
                    Load More
                  </Button>
                )
              ) : visibleCount > MIN_ITEMS ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setVisibleCount(MIN_ITEMS)}
                >
                  Collapse List
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Product Snapshot (Takes 1 Column) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Product Snapshot
            </h2>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mb-8">
              <div>
                <p className="text-slate-500 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalProducts}
                </p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">In Stock</p>
                <p className="text-2xl font-bold text-emerald-600">{inStock}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">{lowStock}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
              </div>
            </div>
          </div>

          {topRatedProduct && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 mt-1">
                <Star size={16} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
                  Top Rated Item
                </p>
                <p className="text-sm font-medium text-yellow-900 mt-0.5">
                  {topRatedProduct.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
