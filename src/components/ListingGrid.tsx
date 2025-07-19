import Link from "next/link";

interface ListingItem {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
}

interface ListingGridProps {
  items: ListingItem[];
  title?: string;
}

export default function ListingGrid({ items, title }: ListingGridProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {title && <h2 className="text-xl font-semibold mb-6">{title}</h2>}
      
      {/* Items Grid */}
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={`/listing/${item.id}`}
            className="block hover:shadow-lg transition-shadow"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-blue-100 border-2 border-dashed border-blue-300 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400"></div>
              </div>
              <div className="p-3">
                <div className="font-semibold text-lg mb-1">{item.price}</div>
                <div className="text-sm text-gray-600 mb-1">{item.title}</div>
                <div className="text-xs text-gray-500">{item.location}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
