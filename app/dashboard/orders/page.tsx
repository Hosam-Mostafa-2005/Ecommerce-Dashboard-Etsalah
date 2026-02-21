"use client";

import { useRouter } from "next/navigation";
import ordersData from "../../mocks/data/orders.json";

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

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Package,
  Filter,
} from "lucide-react";

export type OrderStatus = "Delivered" | "Processing" | "Canceled" | "Shipped";

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  total: number;
  status: OrderStatus;
  date: string;
}

const orders: Order[] = ordersData as Order[];

// دالة لتحديد ألوان الحالات بشكل يتناسب مع ثيم البرتقالي
const getStatusStyles = (status: OrderStatus): string => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    case "Processing":
      // تم تغيير Processing إلى الأزرق لكي لا يتعارض مع لون البراند الأساسي (البرتقالي)
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "Shipped":
      // تم تخصيص الشحن للون البنفسجي الهادئ أو يمكن تركه كلون آخر
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "Canceled":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const OrdersPage = () => {
  const router = useRouter();

  // =========================
  // SEARCH & FILTER
  // =========================
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((order) =>
      statusFilter === "all" ? true : order.status === statusFilter,
    );

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleShowOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          {/* لون الأيقونة برتقالي */}
          <Package className="h-8 w-8 text-amber-500" />
          Orders Management
        </h1>
        <p className="text-slate-500 mt-1">
          Track, manage, and process all customer orders from one place.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Orders List
              </CardTitle>
              <CardDescription>
                Showing {filteredOrders.length} orders based on your filters.
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
                  placeholder="Search order or customer..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-9 w-full sm:w-[250px] bg-slate-50/50 border-slate-200 focus-visible:ring-amber-500"
                />
              </form>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full sm:w-40 appearance-none rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-200">
                <TableHead className="w-[120px] font-semibold text-slate-600">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Date
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Total
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* Order ID */}
                  <TableCell className="font-mono text-sm font-medium text-slate-500">
                    #{order.id.slice(0, 8)}
                  </TableCell>

                  {/* Customer */}
                  <TableCell className="font-medium text-slate-900 group-hover:text-amber-600 transition-colors">
                    {order.customerId}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-right font-bold text-slate-900">
                    $
                    {order.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold tracking-wide ${getStatusStyles(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleShowOrder(order.id)}
                      variant="outline"
                      size="sm"
                      // تغيير ألوان الزر لتكون برتقالية
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p>No orders found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===== PAGINATION ===== */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-900">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-medium text-slate-900">
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {filteredOrders.length}
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

export default OrdersPage;
