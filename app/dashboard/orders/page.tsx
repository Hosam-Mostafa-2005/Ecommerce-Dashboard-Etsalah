// src/app/orders/page.tsx
"use client";

import { useRouter } from "next/navigation";
import ordersData from "../../mocks/data/orders.json";

// **********************************************
// استيراد مكونات Shadcn/ui
// **********************************************
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const getStatusVariant = (
  status: OrderStatus
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

const OrdersPage = () => {
  const router = useRouter();

  const handleShowOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        🧾 Orders Managment
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Orders List ({orders.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="pl-23">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  {/* Order ID */}
                  <TableCell className="font-medium text-primary">
                    #{order.id}
                  </TableCell>

                  {/* Customer ID */}
                  <TableCell>{order.customerId}</TableCell>

                  {/* Date */}
                  <TableCell className="text-muted-foreground">
                    {order.date}
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-right font-semibold">
                    ${order.total.toFixed(2)}
                  </TableCell>

                  {/* Status using Badge */}
                  <TableCell>
                    <Badge
                      className="ml-20"
                      variant={getStatusVariant(order.status)}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  {/* Action - Show Order Button */}
                  <TableCell className="text-right">
                    {/* استخدام مكون Button من shadcn */}
                    <Button
                      onClick={() => handleShowOrder(order.id)}
                      variant="destructive" // يمكنك استخدام "default" أو "secondary"
                      size="sm"
                    >
                      Show Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
