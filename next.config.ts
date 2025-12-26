import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // يجب تحديد البروتوكول (http أو https)
        hostname: "images.unsplash.com", // النطاق الرئيسي
        // يمكنك إضافة pathname إذا كنت تريد تقييد المسارات
        // pathname: '/photo-**',
      },
    ],
  },
};

export default nextConfig;
