"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ItemGrid from "@/components/marketplace/item-grid";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      // Convert slug back to category name with proper URL decoding
      // e.g., "garden-&-outdoor" -> "Garden & Outdoor"
      let name = resolvedParams.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Properly decode URL-encoded characters like %26 back to &
      name = decodeURIComponent(name);
      
      setCategoryName(name);
    }
    getParams();
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        <Sidebar currentCategory={categoryName} />

        {/* Main Content */}
        <main className="flex-1">
          {categoryName && (
            <>
              {/* Category Header with Create Button */}
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
                <Link href={`/create/item?category=${encodeURIComponent(categoryName)}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    + Create Listing in {categoryName}
                  </Button>
                </Link>
              </div>
              
              <ItemGrid 
                category={categoryName}
                title=""
                enableSearch={true}
                enableCategoryFilter={false}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
