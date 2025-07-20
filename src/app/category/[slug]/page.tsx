"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ListingGrid from "@/components/ListingGrid";
import { useListings } from "@/hooks/useListings";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [categoryName, setCategoryName] = useState<string>("");
  const { listings, loading, error, fetchListings } = useListings();

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      const name = resolvedParams.slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setCategoryName(name);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!categoryName) return;
    fetchListings(categoryName);
  }, [categoryName, fetchListings]);

  // Convert Supabase listings to the format expected by ListingGrid
  const categoryItems = listings.map(listing => ({
    id: parseInt(listing.id) || 0,
    title: listing.title,
    price: listing.price,
    location: listing.location,
    image: listing.image_url || "/placeholder-image.jpg"
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto p-4 flex gap-6">
          <Sidebar currentCategory={categoryName} />
          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto p-4 flex gap-6">
          <Sidebar currentCategory={categoryName} />
          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading listings: {error}</p>
                <button 
                  onClick={() => fetchListings(categoryName)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        <Sidebar currentCategory={categoryName} />

        {/* Main Content */}
        <main className="flex-1">
          {categoryItems.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">{categoryName}</h2>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No listings found in this category</p>
              </div>
            </div>
          ) : (
            <ListingGrid items={categoryItems} title={categoryName} />
          )}
        </main>
      </div>
    </div>
  );
}
