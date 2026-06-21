"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface RecentProduct {
  id: string;
  handle: string;
  title: string;
  price: number;
  image: string;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("raaghas_recent_views");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse recently viewed:", e);
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-serif text-charcoal tracking-tight">Recently Viewed</h2>
            <p className="text-sm text-gray-500 mt-1">Pick up where you left off</p>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-6 gap-6 hide-scrollbar snap-x">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.handle}`}
              className="group min-w-[200px] max-w-[200px] sm:min-w-[240px] sm:max-w-[240px] snap-start flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 rounded-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 200px, 240px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              <div className="mt-4 flex flex-col flex-1">
                <h3 className="text-sm font-medium text-charcoal truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1">₹{Number(product.price).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
