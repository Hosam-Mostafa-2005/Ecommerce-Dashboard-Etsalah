"use client";

import { useRouter } from "next/navigation";
import productsData from "../../mocks/data/products.json";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Filter,
  Download,
  Plus,
  ShoppingBag,
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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

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

// دالة مخصصة لألوان المخزون لتناسب الثيم الفخم
const getStockStyles = (stock: number): string => {
  if (stock > 50) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (stock > 10) return "bg-amber-50 text-amber-700 border-amber-200";
  if (stock > 0) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-red-50 text-red-700 border-red-200";
};

const getStockLabel = (stock: number): string => {
  if (stock > 50) return "In Stock";
  if (stock > 10) return "Low Stock";
  if (stock > 0) return "Very Low";
  return "Out of Stock";
};

const ProductsPage = () => {
  const router = useRouter();

  // =========================
  // SEARCH & FILTERS
  // =========================
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((product) =>
      categoryFilter === "all" ? true : product.category === categoryFilter,
    )
    .filter((product) =>
      stockFilter === "all"
        ? true
        : stockFilter === "in"
          ? product.stock > 0
          : product.stock === 0,
    );

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter]);

  const handleShowProduct = (productId: string) => {
    router.push(`/dashboard/products/${productId}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-amber-500" />
            Products Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your inventory, pricing, and product details efficiently.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white hidden sm:flex">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* ===== TABLE CARD ===== */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Products Catalog
              </CardTitle>
              <CardDescription>
                Showing {filteredProducts.length} items based on current
                filters.
              </CardDescription>
            </div>

            {/* SEARCH + FILTERS TOOLBAR */}
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
                  placeholder="Search products or ID..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-9 w-full sm:w-60 bg-slate-50/50 border-slate-200 focus-visible:ring-amber-500"
                />
              </form>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 w-full sm:w-[150px] appearance-none rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Sportswear">Sportswear</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="h-10 w-full sm:w-[140px] appearance-none rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
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
                  Product Name
                </TableHead>
                <TableHead className="font-semibold text-slate-600 hidden md:table-cell">
                  Category
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Price
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-600">
                  Stock Status
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* ID */}
                  <TableCell className="font-mono text-xs font-medium text-slate-400">
                    #{product.id.slice(0, 5)}
                  </TableCell>

                  {/* Product Name */}
                  <TableCell className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors max-w-[200px] truncate">
                    {product.title}
                  </TableCell>

                  {/* Category */}
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 border-slate-200 font-medium"
                    >
                      {product.category}
                    </Badge>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-right font-bold text-slate-900">
                    $
                    {product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`font-semibold tracking-wide whitespace-nowrap ${getStockStyles(product.stock)}`}
                    >
                      {getStockLabel(product.stock)} ({product.stock})
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleShowProduct(product.id)}
                      variant="outline"
                      size="sm"
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* EMPTY STATE */}
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">
                        No products found
                      </p>
                      <p className="text-sm">
                        We couldn't find any products matching your search or
                        filters.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          setSearchTerm("");
                          setInputValue("");
                          setCategoryFilter("all");
                          setStockFilter("all");
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
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-900">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-medium text-slate-900">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="gap-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50"
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
              className="gap-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
