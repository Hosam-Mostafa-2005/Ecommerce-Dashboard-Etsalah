"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ordersData from "../../../mocks/data/orders.json";
import productsData from "../../../mocks/data/products.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Delivered":
      return "default";
    case "Processing":
      return "secondary";
    case "Canceled":
      return "destructive";
    case "Shipped":
      return "outline";
    default:
      return "secondary";
  }
};

export default function OrderDetailsPageClient() {
  const params = useParams();
  //   const id = params?.id as string | undefined;
  // helper
  const stripPrefixToNumber = (s: string) => parseInt(s.slice(1), 10);

  const id = params?.id as string | undefined;
  if (!id) return <div>Loading...</div>;

  // 1️⃣ الحصول على الأوردر حسب الـ id
  const order = ordersData.find((o) => o.id === id);
  if (!order) {
    return <div>Order not found</div>;
  }

  // 2️⃣ الحصول على المنتج المرتبط بالأوردر
  const product = productsData.find(
    (p) => stripPrefixToNumber(p.id) === stripPrefixToNumber(order.productId)
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  if (!id)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;

  if (!order) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-red-600">
              ❌ Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            Order with ID "{id}" does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Order Details: <span className="text-primary">#{order.id}</span>
      </h1>

      {/* تخطيط الصفحة: شبكة بعمودين على الشاشات الكبيرة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* العمود الأول: تفاصيل الطلب الأساسية والحالة */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-xl">
              📊 Basic Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* حالة الطلب */}
            <div className="flex items-center justify-between border-b pb-3">
              <strong className="text-gray-600">Status:</strong>
              <Badge
                variant={getStatusVariant(order.status)}
                className="text-md py-1 px-3"
              >
                {order.status}
              </Badge>
            </div>

            {/* الإجمالي */}
            <div className="flex items-center justify-between border-b pb-3">
              <strong className="text-gray-600">Total Paid:</strong>
              <span className="text-2xl font-extrabold text-green-600">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>

            {/* تاريخ الطلب */}
            <div className="flex items-center justify-between border-b pb-3">
              <strong className="text-gray-600">Order Date:</strong>
              <span>{order.date}</span>
            </div>

            {/* العميل */}
            <div className="flex items-center justify-between">
              <strong className="text-gray-600">Customer ID:</strong>
              <span className="font-medium text-blue-600">
                {order.customerId}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* العمود الثاني: تفاصيل المنتج ضمن هذا الطلب */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-xl">📦 Product in Order</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between border-b pb-3">
              <strong className="text-gray-600">Product ID:</strong>
              <span className="font-medium">{product.id}</span>
            </div>

            {/* يمكن هنا جلب اسم المنتج وتفاصيله الحقيقية */}
            <div className="flex justify-between border-b pb-3">
              <strong className="text-gray-600">Product Name:</strong>
              <span className="text-gray-500">{product.title}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <strong className="text-gray-600">Quantity:</strong>
              <span>{product.stock}</span>
            </div>

            <Separator className="mt-4 mb-4" />

            {/* زر إجراء جديد */}
            <div className="text-center">
              <Link href={`/dashboard/orders/o1/${product.id}`}>
                <Button variant="outline">View Product Page</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
