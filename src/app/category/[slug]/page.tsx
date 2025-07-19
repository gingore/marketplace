import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ListingGrid from "@/components/ListingGrid";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const categoryItems = Array.from({ length: 15 }, (_, i) => ({
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
        <Sidebar currentCategory={categoryName} />

        {/* Main Content */}
        <main className="flex-1">
          <ListingGrid items={categoryItems} title={categoryName} />
        </main>
      </div>
    </div>
  );
}
