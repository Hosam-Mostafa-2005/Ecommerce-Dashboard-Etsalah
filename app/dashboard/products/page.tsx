// src/app/dashboard/products/page.tsx
"use client";

import { useRouter } from "next/navigation";
import productsData from "../../mocks/data/products.json";
import { DollarSign, Eye } from "lucide-react";

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

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
}

const products: Product[] = productsData as Product[];

const getStockVariant = (
  stock: number
): "default" | "destructive" | "secondary" | "outline" => {
  if (stock > 50) return "default";
  if (stock > 10) return "secondary";
  return "destructive";
};

const getStockLabel = (stock: number): string => {
  if (stock > 50) return "In Stock";
  if (stock > 10) return "Low Stock";
  if (stock > 0) return "Very Low";
  return "Out of Stock";
};

const ProductsPage = () => {
  const router = useRouter();

  const handleShowProduct = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-800">
        📦 Products Management
      </h1>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold text-amber-600">
            Products Catalog ({products.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  {/* Product ID */}
                  <TableCell className="font-medium text-blue-600">
                    #{product.id}
                  </TableCell>

                  {/* Title */}
                  <TableCell className="font-semibold text-gray-700 max-w-xs truncate">
                    {product.title}
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-amber-400 text-black hover:bg-amber-200"
                    >
                      {product.category}
                    </Badge>
                  </TableCell>

                  {/* Price - مميز بالبرتقالي */}
                  <TableCell className="text-right font-extrabold text-amber-700 flex items-center justify-end">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                    {product.price.toFixed(2)}
                  </TableCell>

                  {/* Stock Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={getStockVariant(product.stock)}
                      className="py-1 px-3"
                    >
                      {getStockLabel(product.stock)} ({product.stock})
                    </Badge>
                  </TableCell>

                  {/* Action - Show Product Button */}
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleShowProduct(product.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Details
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

export default ProductsPage;
