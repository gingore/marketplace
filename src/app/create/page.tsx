import Link from "next/link";
import Header from "@/components/layout/header";

export default function CreateListingType() {
  const listingTypes = [
    {
      id: "item-for-sale",
      title: "Item for sale",
      description: "List a single item to sell to local buyers",
      icon: "🏷️",
      href: "/create/item"
    },
    {
      id: "create-multiple",
      title: "Create multiple listings",
      description: "Bulk upload multiple items at once",
      icon: "📋",
      href: "/create/bulk"
    },
    {
      id: "vehicle-for-sale",
      title: "Vehicle for sale",
      description: "Sell cars, motorcycles, and other vehicles",
      icon: "🚗",
      href: "/create/vehicle"
    },
    {
      id: "home-for-sale",
      title: "Home for sale or rent",
      description: "List properties for sale or rental",
      icon: "🏠",
      href: "/create/property"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/" />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-2">What are you listing?</h1>
          <p className="text-gray-600 mb-6">Choose the type of listing you&apos;d like to create</p>
          
          <div className="space-y-3">
            {listingTypes.map((type) => (
              <Link
                key={type.id}
                href={type.href}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{type.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
