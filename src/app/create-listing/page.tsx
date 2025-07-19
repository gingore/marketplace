import Link from "next/link";

export default function CreateListingType() {
  const listingTypes = [
    {
      id: "item-for-sale",
      title: "Item for sale",
      description: "Lorem ipsum dolor sit",
      icon: "🏷️"
    },
    {
      id: "create-multiple",
      title: "Create multiple listings",
      description: "Lorem ipsum dolor sit",
      icon: "📋"
    },
    {
      id: "vehicle-for-sale",
      title: "Vehicle for sale",
      description: "Lorem ipsum dolor sit",
      icon: "🚗"
    },
    {
      id: "home-for-sale",
      title: "Home for sale or rent",
      description: "Lorem ipsum dolor sit",
      icon: "🏠"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 mr-8">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">f</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-8 text-sm">
            <button className="flex items-center gap-2 text-blue-600 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Choose listing type
            </button>
            
            <button className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Your listings
            </button>
            
            <button className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seller help
            </button>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5l-5-5h5V3h5v14z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-2">Choose listing type</h1>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {listingTypes.map((type) => (
            <Link 
              key={type.id}
              href="/create"
              className="block"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{type.icon}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
