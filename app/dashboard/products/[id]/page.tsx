import { notFound } from "next/navigation";
import Link from "next/link";
import products from "@/app/mocks/data/products.json";
import orders from "@/app/mocks/data/orders.json";
import { Card } from "@/components/ui/card";

// --- 1. مجموعة الأيقونات المحسنة ---
const Icons = {
  Back: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  ),
  Alert: () => (
    <svg
      className="w-5 h-5 text-orange-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  StarFilled: () => (
    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Tag: () => (
    <svg
      className="w-4 h-4 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  ),
  Box: () => (
    <svg
      className="w-4 h-4 text-purple-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  Hash: () => (
    <svg
      className="w-4 h-4 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
      />
    </svg>
  ),
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product: any = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link
          href="/dashboard/products"
          className="text-blue-600 hover:underline mt-2"
        >
          Return to products
        </Link>
      </div>
    );
  }

  // Logic
  const pendingOrders = orders.filter(
    (o) => o.productId === product.id && o.status === "Pending",
  );
  const pendingCount = pendingOrders.length;

  // Logic: Stock Status Colors
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5;
  const stockColor = isOutOfStock
    ? "bg-red-100 text-red-700 border-red-200"
    : isLowStock
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";
  const stockLabel = isOutOfStock
    ? "Out of Stock"
    : isLowStock
      ? "Low Stock"
      : "In Stock";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/products"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-2 transition-colors"
          >
            <Icons.Back /> Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* ================= LEFT COLUMN: IMAGE (4 Cols) ================= */}
        {/* LEFT COLUMN IMAGE */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white p-4 shadow-sm sticky top-6 max-w-sm mx-auto">
            <div className="relative h-72 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INFO (8 Cols) ================= */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {/* 1. Main Info Card */}
          <Card className="p-6 border-gray-100 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Categories & Brand Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <Icons.Tag /> {product.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  <Icons.Box /> {product.brand}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Icons.StarFilled key={i} />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  ({product.rating} Rating)
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                {product.description}
              </p>
            </div>
          </Card>

          {/* 2. Price & Stock Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price Box */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                Unit Price
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">USD</span>
              </div>
            </div>

            {/* Stock Box */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                Inventory Status
              </span>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {product.stock}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">Units left</span>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${stockColor}`}
                >
                  {stockLabel}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Technical Specs (ID) */}
          <div className="bg-white px-5 py-4 rounded-xl border border-gray-100 flex items-center gap-3 text-sm text-gray-500">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icons.Hash />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-semibold">
                System Product ID
              </span>
              <span className="font-mono text-gray-900 select-all">
                {product.id}
              </span>
            </div>
          </div>

          {/* 4. Live Status Section */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Order Status
            </h3>
            {pendingCount > 0 ? (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
                <div className="p-2 bg-white rounded-lg shadow-sm text-orange-600">
                  <Icons.Alert />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-orange-900">
                    Action Needed
                  </h4>
                  <p className="text-sm text-orange-700 mt-0.5">
                    There are{" "}
                    <span className="font-bold underline">
                      {pendingCount} pending orders
                    </span>{" "}
                    requiring your attention.
                  </p>
                </div>
                <button className="px-4 py-2 bg-white text-orange-700 text-sm font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition shadow-sm whitespace-nowrap">
                  Process Orders
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-emerald-100 text-emerald-600">
                  <Icons.Check />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">
                    All Clear
                  </h4>
                  <p className="text-sm text-emerald-700">
                    No pending orders for this product.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
