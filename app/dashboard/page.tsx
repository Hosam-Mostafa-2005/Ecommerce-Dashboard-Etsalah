"use client";

import { Button } from "@/components/ui/button";
import SalesLineChart from "../components/charts/SalesLineChart";
import KpiCard from "../components/kpi/KpiCard";
import InventoryDonutChart from "../components/charts/InventoryDonutChart";
import TopCustomersBarChart from "../components/charts/TopCustomersBarChart";

import customers from "../mocks/data/customers.json";
import orders from "../mocks/data/orders.json";
import products from "../mocks/data/products.json";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

/* ================= DATA PREP ================= */
const totalProducts = products.length;
const inStock = products.filter((p) => p.stock > 0).length;
const outOfStock = products.filter((p) => p.stock === 0).length;
const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

const topRatedProduct = products.slice().sort((a, b) => b.rating - a.rating)[0];

const topCustomers = customers
  .slice()
  .sort((a, b) => b.orders - a.orders)
  .slice(0, 5);

const getCustomerName = (customerId: string): string => {
  const customer = (customers as Customer[]).find((c) => c.id === customerId);
  return customer ? customer.name : `Customer ID: ${customerId}`;
};

/* ================= PAGE ================= */
export default function DashboardPage() {
  const ordersArr: Order[] = orders as Order[];

  const totalOrders = ordersArr.length;
  const totalRevenue = ordersArr.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const recentOrders = ordersArr
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const totalRevMonth = () => {
    const monthlyTotals: Record<string, number> = {};

    ordersArr.forEach((order) => {
      const date = new Date(order.date);
      if (isNaN(date.getTime())) return;

      const month = String(date.getMonth() + 1).padStart(2, "0");
      monthlyTotals[month] =
        (monthlyTotals[month] || 0) + Number(order.total || 0);
    });

    return Object.keys(monthlyTotals)
      .sort()
      .map((month) => ({
        month,
        sales: monthlyTotals[month],
      }));
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ================= KPI CARDS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
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
          value={`$${avgOrderValue.toFixed(2)}`}
        />
      </section>

      {/* ================= ROW 1: SALES + SIDE COLUMN ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Sales Trends</h2>
          <SalesLineChart data={totalRevMonth()} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Inventory */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Inventory Overview</h2>

            <InventoryDonutChart
              inStock={inStock}
              lowStock={lowStock}
              outOfStock={outOfStock}
            />

            <div className="flex justify-between text-xs mt-3">
              <span className="text-green-600">In {inStock}</span>
              <span className="text-yellow-600">Low {lowStock}</span>
              <span className="text-red-600">Out {outOfStock}</span>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Top Customers</h2>

            <TopCustomersBarChart customers={topCustomers} />

            <Link
              href="/dashboard/customers"
              className="text-sm text-amber-600 font-medium hover:underline block mt-3"
            >
              View all customers →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ROW 2: RECENT ORDERS ================= */}
      <section>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-lg font-semibold">Recent Activity: Orders</h2>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3 grow overflow-auto">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">
                    {getCustomerName(order.customerId)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ROW 3: PRODUCT SNAPSHOT ================= */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Product Snapshot</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Products</p>
            <p className="font-bold">{totalProducts}</p>
          </div>
          <div>
            <p className="text-gray-500">In Stock</p>
            <p className="font-bold text-green-600">{inStock}</p>
          </div>
          <div>
            <p className="text-gray-500">Low Stock</p>
            <p className="font-bold text-yellow-600">{lowStock}</p>
          </div>
          <div>
            <p className="text-gray-500">Out of Stock</p>
            <p className="font-bold text-red-600">{outOfStock}</p>
          </div>
        </div>

        {topRatedProduct && (
          <p className="text-sm mt-4">
            ⭐ Top Rated:{" "}
            <span className="font-medium">{topRatedProduct.title}</span>
          </p>
        )}
      </section>
    </div>
  );
}
