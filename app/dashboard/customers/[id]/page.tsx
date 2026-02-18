import { notFound } from "next/navigation";
import Link from "next/link";
import customers from "@/app/mocks/data/customers.json";
import CustomerEditableInfo from "@/app/components/CustomerEdit/CustomerEdit";

// أيقونات بسيطة كـ SVG مباشر لعدم الاعتماد على مكتبات خارجية
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
  Mail: () => (
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
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Phone: () => (
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
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  Order: () => (
    <svg
      className="w-5 h-5 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-5 h-5 text-purple-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
};

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
}

const customersData = customers as Customer[];

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const customer = customersData.find((c) => c.id === id);

  if (!customer) return notFound();

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Icons.Back />
          <span>Back to Customers</span>
        </Link>
        <span className="text-xs font-mono text-gray-400">
          ID: {customer.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT COLUMN (PROFILE) ================= */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            {/* Avatar Circle */}
            <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 mb-4 border-4 border-white shadow-sm">
              {initials}
            </div>

            <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500 mb-6">Customer</p>

            <div className="flex justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Account
              </span>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Icons.Mail />
                </div>
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Icons.Phone />
                </div>
                <span>+20 100 000 0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (DETAILS) ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Icons.Order />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customer.orders}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Icons.Calendar />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Joined Date</p>
                <p className="text-2xl font-bold text-gray-900">Oct 24, 2024</p>
              </div>
            </div>
          </div>

          {/* General Information */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <CustomerEditableInfo customer={customer} />
          </section>

          {/* Notes Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Internal Notes
            </h2>
            <div className="relative">
              <textarea
                className="w-full border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none shadow-sm"
                rows={4}
                placeholder="Add private notes about this customer..."
              />
              <div className="absolute bottom-3 right-3">
                <button className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
                  Save Note
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
