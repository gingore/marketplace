import Link from "next/link";

interface HeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
}

export default function Header({ showBackButton = false, backUrl = "/" }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Link href={backUrl} className="p-2 hover:bg-gray-100 rounded-full mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">f</span>
            </div>
            <h1 className="text-xl font-semibold">Marketplace</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h3a2 2 0 002-2v-1a6 6 0 10-12 0v1a2 2 0 002 2h3m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
  );
}
