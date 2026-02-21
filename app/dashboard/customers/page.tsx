"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import customerData from "../../mocks/data/customers.json";
import {
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Plus,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  orders: number;
  totalSpent: number;
  joined: string;
}

const customers: Customer[] = customerData as Customer[];

// دالة لاستخراج الحرف الأول من الاسم للأفاتار
const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const CustomersPage = () => {
  const router = useRouter();

  // =========================
  // SEARCH & FILTERS
  // =========================
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [spendingFilter, setSpendingFilter] = useState("all");

  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((customer) =>
      spendingFilter === "all"
        ? true
        : spendingFilter === "vip"
          ? customer.totalSpent >= 1000
          : spendingFilter === "regular"
            ? customer.totalSpent >= 300 && customer.totalSpent < 1000
            : customer.totalSpent < 300,
    );

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, spendingFilter]);

  const handleShowCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-amber-500" />
            Customers Management
          </h1>
          <p className="text-slate-500 mt-1">
            View, track, and manage your customer directory and behaviors.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white hidden sm:flex">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          {/* زر الإضافة باللون البرتقالي */}
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* ===== TABLE CARD ===== */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Customers Directory
              </CardTitle>
              <CardDescription>
                Showing {filteredCustomers.length} active customers.
              </CardDescription>
            </div>

            {/* SEARCH + FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchTerm(inputValue);
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name, email or ID..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  // تأثير الـ Focus باللون البرتقالي
                  className="pl-9 w-full sm:w-[260px] bg-slate-50/50 border-slate-200 focus-visible:ring-amber-500"
                />
              </form>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={spendingFilter}
                  onChange={(e) => setSpendingFilter(e.target.value)}
                  // تأثير الـ Focus باللون البرتقالي
                  className="h-10 w-full sm:w-40 appearance-none rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="all">All Tiers</option>
                  <option value="vip">VIP ($1000+)</option>
                  <option value="regular">Regular ($300+)</option>
                  <option value="low">Low Spend</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-200">
                <TableHead className="w-20 font-semibold text-slate-600">
                  ID
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-slate-600 hidden md:table-cell">
                  Contact Info
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-600">
                  Orders
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Total Spent
                </TableHead>
                <TableHead className="font-semibold text-slate-600 hidden lg:table-cell">
                  Joined Date
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCustomers.map((customer) => {
                const isVip = customer.totalSpent >= 1000;
                const isRegular =
                  customer.totalSpent >= 300 && customer.totalSpent < 1000;

                return (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* ID */}
                    <TableCell className="font-mono text-xs font-medium text-slate-400">
                      #{customer.id.slice(0, 5)}
                    </TableCell>

                    {/* Customer Info (Avatar + Name) */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm
                          ${isVip ? "bg-purple-100 text-purple-700" : "bg-amber-50 text-amber-600"}
                        `}
                        >
                          {getInitials(customer.name)}
                        </div>
                        {/* تأثير الـ Hover على الاسم باللون البرتقالي */}
                        <div className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {customer.name}
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-sm text-slate-500 hidden md:table-cell">
                      {customer.email}
                    </TableCell>

                    {/* Orders */}
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 border-slate-200"
                      >
                        {customer.orders}
                      </Badge>
                    </TableCell>

                    {/* Total Spent & Tier */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          $
                          {customer.totalSpent.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        {isVip && (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase tracking-wider bg-purple-50 text-purple-700 border-purple-200"
                          >
                            VIP
                          </Badge>
                        )}
                        {isRegular && (
                          <Badge
                            variant="outline"
                            // شارة الـ Pro بدرجة برتقالي مختلفة قليلاً
                            className="text-[10px] uppercase tracking-wider bg-orange-50 text-orange-700 border-orange-200"
                          >
                            Pro
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm text-slate-500 hidden lg:table-cell">
                      {new Date(customer.joined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleShowCustomer(customer.id)}
                        size="sm"
                        variant="outline"
                        // زر العرض باللون البرتقالي
                        className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 gap-1.5"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* EMPTY STATE */}
              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">
                        No customers found
                      </p>
                      <p className="text-sm">
                        We couldn't find any customers matching your current
                        filters.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          setSearchTerm("");
                          setInputValue("");
                          setSpendingFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===== PAGINATION ===== */}
      {filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-900">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-medium text-slate-900">
              {Math.min(startIndex + itemsPerPage, filteredCustomers.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {filteredCustomers.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="gap-1 text-slate-600"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>

            <span className="text-sm font-medium text-slate-700">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="gap-1 text-slate-600"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
