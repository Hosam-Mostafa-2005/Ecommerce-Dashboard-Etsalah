// src/app/dashboard/products/[productId]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

// استيراد الواجهة الجديدة
// import { Product } from "@/types/product";

import productsData from "../../../../mocks/data/products.json";

// **********************************************
// دالة مساعدة لتحديد لون حالة المخزون
// النوع الآن هو رقم (number) أو يمكن استخدام Product['stock']
// **********************************************
const getStockVariant = (
  stock: number
): "default" | "destructive" | "secondary" => {
  if (stock > 50) return "default";
  if (stock > 10) return "secondary";
  return "destructive";
};

// **********************************************
// Framer Motion Variants
// **********************************************
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
  },
};

// **********************************************
// المكون الرئيسي للصفحة
// **********************************************
const ProductDetailsPage = () => {
  const params = useParams();
  const id = params?.productId as string | undefined;

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500">Loading Product ID...</div>
    );

  // 👈 التعديل الأساسي: تحديد نوع المنتج المستخرج كـ Product | undefined
  // وإجبار productsData ليكون Product[]
  const productsList = productsData;
  const product = productsList.find((p: any) => p.id === id);

  if (!product) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-red-600">
              ❌ Product Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            Product with ID "{id}" does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  // الآن يعرف TypeScript أن 'product' هو بالتأكيد من نوع Product
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-8"
    >
      {/* Container لتوسيط المحتوى */}
      <div className="max-w-7xl mx-auto">
        <motion.h1
          variants={fadeUpVariant as any}
          className="text-3xl font-bold tracking-tight mb-8 text-gray-800"
        >
          Product View: <span className="text-amber-600">{product.title}</span>
        </motion.h1>

        {/* تخطيط الشبكة: ضمان عمل col-span بشكل صحيح */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأول والثاني (2/3): الصورة والوصف */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={fadeUpVariant as any}>
              <Card className="p-6 shadow-xl">
                {/* قسم الصورة (تم تحسينه) */}
                <motion.div
                  variants={imageVariant as any}
                  className="w-full h-120 relative mx-auto rounded-lg overflow-hidden border border-gray-200 mb-2"
                >
                  <Image
                    src={"/images/shoes.jpg"}
                    alt={product.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                <Separator className="my-6" />

                {/* قسم الوصف */}
                <div className="w-full">
                  <CardTitle className="mb-4 text-2xl font-semibold border-b pb-2 text-amber-600">
                    📜 Description
                  </CardTitle>
                  <motion.p
                    variants={fadeUpVariant as any}
                    className="text-gray-700 leading-relaxed"
                  >
                    {product.description}
                  </motion.p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* العمود الثالث (1/3): السعر والتفاصيل الفنية */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={fadeUpVariant as any}>
              {/* بطاقة السعر والتقييم - اللون البرتقالي الأساسي */}
              <Card className="p-6 shadow-xl bg-amber-50/50 border-amber-200">
                <CardTitle className="text-xl mb-4 font-semibold text-amber-700 border-b pb-2">
                  Price & Rating
                </CardTitle>

                {/* السعر */}
                <div className="mb-4">
                  <span className="text-5xl font-extrabold text-amber-600">
                    {/* استخدام product.price بدون أي خطأ في النوع الآن */}$
                    {Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* التقييم */}
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-md font-bold text-gray-700">
                    ({product.rating.toFixed(1)} / 5)
                  </span>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUpVariant as any as any}>
              {/* بطاقة المواصفات والمخزون */}
              <Card className="p-6 shadow-lg">
                <CardTitle className="text-2xl font-extrabold mb-4 border-b pb-2 text-amber-600">
                  ⚙️ Specifications
                </CardTitle>

                <div className="space-y-4 text-sm">
                  {/* Category */}
                  <div className="flex justify-between pb-2 border-b">
                    <strong className="text-gray-600">Category:</strong>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      {product.category}
                    </Badge>
                  </div>

                  {/* Brand */}
                  <div className="flex justify-between pb-2 border-b">
                    <strong className="text-gray-600">Brand:</strong>
                    <span>{product.brand}</span>
                  </div>

                  {/* Product ID */}
                  <div className="flex justify-between pb-2 border-b">
                    <strong className="text-gray-600">Product ID:</strong>
                    <span>{product.id}</span>
                  </div>

                  {/* المخزون */}
                  <div className="flex justify-between pt-2">
                    <strong className="text-gray-600">Stock Status:</strong>
                    <Badge
                      variant={getStockVariant(product.stock)}
                      className="py-1 px-3 text-sm font-semibold"
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : `${product.stock} in stock`}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
