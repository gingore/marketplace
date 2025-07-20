import Link from "next/link";

interface SidebarProps {
  currentCategory?: string;
}

export default function Sidebar({ currentCategory }: SidebarProps) {
  const categories = [
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

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <Link 
                href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm hover:text-blue-600 block py-1 ${
                  category === currentCategory ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
