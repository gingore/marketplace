# Marketplace Demo

A modern marketplace application built with Next.js, Tailwind CSS, and Supabase.

## Features

📝 **Create Listing**: Users can upload photos and fill in title, description, price, email, and category  
🔍 **Browse & Search**: Show all listings in a responsive grid with category filtering  
📄 **Listing Detail**: Dedicated page for each item with full info and messaging  
💬 **Message Seller**: Store buyer messages in Supabase with email notifications  

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (Database, Storage, Auth)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketplace-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Update `.env.local` with your credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Open the SQL Editor
   - Copy and paste the contents of `database.sql`
   - Run the script to create tables and policies

5. **Set up storage**
   - In your Supabase dashboard, go to Storage
   - Create a new bucket called `images`
   - Make it public
   - Set up the storage policies (already included in database.sql)

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   - Visit [http://localhost:3000](http://localhost:3000)
   - Start creating listings!

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page with listings grid
│   ├── create/            # Create listing form
│   ├── create-listing/    # Listing type selection
│   ├── listing/[id]/      # Individual listing detail
│   └── category/[slug]/   # Category filtered listings
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── Sidebar.tsx        # Categories sidebar
│   ├── ListingGrid.tsx    # Listings display grid
│   └── ui/               # Base UI components
├── hooks/                 # Custom React hooks
│   └── useListings.ts     # Listings data management
└── lib/                   # Utility functions
    ├── supabase.ts        # Supabase client setup
    └── upload.ts          # Image upload utilities
```

## Key Features Implementation

### Create Listing
- Image upload with validation (5MB max, JPEG/PNG/WebP/GIF)
- Form validation for required fields
- Category selection from predefined list
- Auto-redirect to listing detail after creation

### Browse & Search
- Real-time data fetching from Supabase
- Category filtering with URL-based routing
- Responsive grid layout
- Loading states and error handling

### Listing Detail
- Dynamic routing with listing ID
- Image display with Next.js Image optimization
- Seller contact information
- Message form with validation

### Message Seller
- Contact form with buyer name, email, and message
- Messages stored in Supabase with listing relationship
- Success/error feedback
- Email notification capability (extensible)

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
```

## Database Schema

### listings
- `id` (UUID, primary key)
- `title` (text, required)
- `description` (text)
- `price` (text, required)
- `email` (text, required)
- `category` (text, required)
- `image_url` (text)
- `location` (text, default: "Palo Alto, CA")
- `created_at` (timestamp)
- `updated_at` (timestamp)

### messages
- `id` (UUID, primary key)
- `listing_id` (UUID, foreign key)
- `buyer_name` (text, required)
- `buyer_email` (text, required)
- `message` (text, required)
- `seller_email` (text, required)
- `created_at` (timestamp)

## Deployment

The app is ready for deployment on Vercel:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own marketplace application!
