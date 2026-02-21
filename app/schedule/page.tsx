"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Package,
  User,
  DollarSign,
  Calendar as CalendarIcon,
  Hash,
} from "lucide-react";

import orders from "@/app/mocks/data/orders.json";

// استيراد مكونات الـ Modal من Shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */
interface OrderData {
  orderId: string;
  customerId: string;
  productId: string;
  total: number | string;
  status: string;
  date: string;
}

/* ================= HELPER ================= */
const getEventColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "#10b981"; // الأخضر
    case "Pending":
      return "#f59e0b"; // الأصفر/البرتقالي
    case "Shipped":
      return "#3b82f6"; // الأزرق
    case "Cancelled":
      return "#ef4444"; // الأحمر
    default:
      return "#64748b"; // الرمادي
  }
};

export default function SchedulePage() {
  // حالة (State) لحفظ الطلب المختار وحالة فتح الـ Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // تجهيز الأحداث (Events) للنتيجة
  const events = orders.map((order) => ({
    title: `Order #${order.id.slice(0, 5)}`,
    date: order.date,
    backgroundColor: getEventColor(order.status),
    borderColor: getEventColor(order.status),
    extendedProps: {
      orderId: order.id,
      customerId: order.customerId,
      productId: order.productId,
      total: order.total,
      status: order.status,
      date: order.date,
    },
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Schedule
        </h1>
        <p className="text-slate-500 mt-1">
          Manage and view your orders delivery timeline.
        </p>
      </div>

      {/* CALENDAR CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable
            selectable
            events={events}
            eventClick={(info) => {
              setSelectedOrder(info.event.extendedProps as OrderData);
              setIsDialogOpen(true);
            }}
            height="auto"
          />
        </div>
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-blue-600" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Complete information for the selected scheduled order.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 mt-4">
              {/* Status Badge */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-500">
                  Current Status
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                  style={{
                    backgroundColor: getEventColor(selectedOrder.status),
                  }}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Hash className="h-3.5 w-3.5" /> Order ID
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.orderId}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <DollarSign className="h-3.5 w-3.5" /> Total Amount
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    ${selectedOrder.total}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <User className="h-3.5 w-3.5" /> Customer ID
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrder.customerId}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <CalendarIcon className="h-3.5 w-3.5" /> Scheduled Date
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
