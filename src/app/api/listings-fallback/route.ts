import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Alternative POST endpoint using raw SQL to bypass schema cache issues
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validation
    const requiredFields = ['title', 'price', 'email', 'category'];
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Price validation
    if (!body.price.startsWith('$')) {
      return NextResponse.json(
        { error: 'Price must be in format $XX.XX' },
        { status: 400 }
      );
    }

    // Use raw SQL to bypass schema cache issues
    const { data: listing, error } = await supabase.rpc('create_listing_raw', {
      p_title: body.title.trim(),
      p_price: body.price,
      p_email: body.email.toLowerCase().trim(),
      p_description: body.description?.trim() || '',
      p_category: body.category,
      p_location: body.location || 'Not specified',
      p_image_url: body.image_url || null
    });

    if (error) {
      console.error('Error creating listing via RPC:', error);
      return NextResponse.json(
        { 
          error: 'Schema cache issue detected',
          details: error.message,
          solution: 'Please refresh the Supabase schema cache in your dashboard: Settings → API → Reload Schema'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: listing,
        message: 'Listing created successfully via fallback method'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        hint: 'Try refreshing the Supabase schema cache in your dashboard'
      },
      { status: 500 }
    );
  }
}
