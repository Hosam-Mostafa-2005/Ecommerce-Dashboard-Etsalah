"use client";

import { useRouter } from "next/navigation";
import customerData from "../../mocks/data/customers.json";

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

const CustomersPage = () => {
  const router = useRouter();

  const handleShowCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-800">
        👥 Customers Management
      </h1>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold text-amber-600">
            Customers List ({customers.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {" "}
          {/* إزالة الحشو من محتوى البطاقة */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  {/* Customer ID */}
                  <TableCell className="font-medium text-blue-600">
                    #{customer.id}
                  </TableCell>

                  {/* Name */}
                  <TableCell className="font-semibold text-gray-700">
                    {customer.name}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-muted-foreground">
                    {customer.email}
                  </TableCell>

                  {/* Orders Count */}
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      {customer.orders}
                    </Badge>
                  </TableCell>

                  {/* Total Spent - مميز بالبرتقالي */}
                  <TableCell className="text-right font-extrabold text-amber-700">
                    ${customer.totalSpent.toFixed(2)}
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="text-sm text-gray-500">
                    {new Date(customer.joined).toLocaleDateString()}
                  </TableCell>

                  {/* Action - Show Customer Button */}
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleShowCustomer(customer.id)}
                      // استخدام لون برتقالي مخصص (Amber)
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      size="sm"
                    >
                      View Profile
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

export default CustomersPage;
