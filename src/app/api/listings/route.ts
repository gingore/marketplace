import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: listings, error, count } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings', details: error.message },
        { status: 500 }
      );
    }

    const formattedListings = listings?.map(listing => ({
      ...listing,
      price: `$${listing.price}`
    }));

    return NextResponse.json({
      success: true,
      data: formattedListings,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: count ? offset + limit < count : false
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const requiredFields = ['title', 'price', 'seller_email', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: `Required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.seller_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!body.price.startsWith('$')) {
      return NextResponse.json(
        { error: 'Price must be in format $XX.XX' },
        { status: 400 }
      );
    }

    const priceString = body.price.slice(1);
    const priceNumber = parseFloat(priceString);
    
    if (isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    const listingData = {
      title: body.title.trim(),
      price: priceNumber,
      seller_email: body.seller_email.toLowerCase().trim(),
      description: body.description?.trim() || '',
      category: body.category,
      location: body.location || 'Not specified',
      image_url: body.image_url || null
    };

    const { data: listing, error } = await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      console.error('Listing data:', listingData);
      return NextResponse.json(
        { error: 'Failed to create listing', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...listing,
          price: `$${listing.price}`
        },
        message: 'Listing created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
