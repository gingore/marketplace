"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient, type Listing } from "@/lib/api-client";

interface ItemGridProps {
  category?: string;
  title?: string;
  enableSearch?: boolean;
  enableCategoryFilter?: boolean;
}

interface PaginationInfo {
  total: number | null;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const categories = [
  "All",
  "Vehicles",
  "Property Rentals",
  "Apparel", 
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups"
];

export default function ItemGrid({ 
  category, 
  title = "Today's picks", 
  enableSearch = false,
  enableCategoryFilter = false 
}: ItemGridProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "All");
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchListings = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      }

      const currentOffset = isLoadMore ? offset : 0;

      const result = await apiClient.getListings({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: searchTerm || undefined,
        limit: 20,
        offset: currentOffset
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        const responseData = result.data as { data?: Listing[]; pagination?: PaginationInfo };
        const newListings = responseData.data || [];
        const pagination = responseData.pagination;

        if (isLoadMore) {
          setListings(prev => [...prev, ...newListings]);
          setOffset(prev => prev + 20);
        } else {
          setListings(newListings);
          setOffset(20);
        }
        setHasMore(pagination?.hasMore || false);
      } else {
        if (!isLoadMore) {
          setListings([]);
          setOffset(0);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setOffset(0);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setOffset(0);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchListings(true);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiClient.getListings({
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchTerm || undefined,
          limit: 20,
          offset: 0
        });

        if (isCancelled) return; // Prevent state updates if component unmounted

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data) {
          const responseData = result.data as { data?: Listing[]; pagination?: PaginationInfo };
          const newListings = responseData.data || [];
          const pagination = responseData.pagination;

          setListings(newListings);
          setOffset(20);
          setHasMore(pagination?.hasMore || false);
        } else {
          setListings([]);
          setOffset(0);
          setHasMore(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching listings:', err);
          setError(err instanceof Error ? err.message : 'Failed to load listings');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchTerm]);

  if (loading && listings.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchListings()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {enableSearch && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
          
          {enableCategoryFilter && (
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 
              `No listings match "${searchTerm}"` : 
              selectedCategory !== "All" ? 
                `No items listed in ${selectedCategory} yet` :
                "No listings available yet"
            }
          </p>
          <Link 
            href="/create"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {selectedCategory !== "All" ? "List an Item" : "Create First Listing"}
          </Link>
        </div>
      ) : (
        <>
          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map((item) => (
              <Link 
                key={item.id} 
                href={`/item/${item.id}`}
                className="block hover:shadow-lg transition-shadow"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="aspect-square bg-blue-100 border-2 border-dashed border-blue-300 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400"></div>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="font-semibold text-lg mb-1">{item.price}</div>
                    <div className="text-sm text-gray-600 mb-1 line-clamp-2">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.location}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
