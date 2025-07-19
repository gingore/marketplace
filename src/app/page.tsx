import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ListingGrid from "@/components/ListingGrid";

export default function Home() {
  const todaysPicksItems = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: "Lorem ipsum dolor sit",
    price: "$2,300",
    location: "Palo Alto, CA",
    image: "/placeholder-image.jpg"
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        <Sidebar currentCategory="Electronics" />

        {/* Main Content */}
        <main className="flex-1">
          <ListingGrid items={todaysPicksItems} title="Today&apos;s picks" />
        </main>
      </div>

      {/* Floating Action Button */}
      <Link 
        href="/create-listing"
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Link>
    </div>
  );
}
