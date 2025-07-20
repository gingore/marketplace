import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/messages - Get messages for listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    const sellerEmail = searchParams.get('seller_email');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate required parameters
    if (!listingId && !sellerEmail) {
      return NextResponse.json(
        { error: 'Either listing_id or seller_email is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (listingId) {
      query = query.eq('listing_id', listingId);
    }
    
    if (sellerEmail) {
      query = query.eq('seller_email', sellerEmail);
    }

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: messages,
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

// POST /api/messages - Send message to seller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validation
    const requiredFields = ['listing_id', 'buyer_name', 'buyer_email', 'message', 'seller_email'];
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
    if (!emailRegex.test(body.buyer_email)) {
      return NextResponse.json(
        { error: 'Invalid buyer email format' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(body.seller_email)) {
      return NextResponse.json(
        { error: 'Invalid seller email format' },
        { status: 400 }
      );
    }

    // Verify listing exists
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, email')
      .eq('id', body.listing_id)
      .single();

    if (listingError) {
      if (listingError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }
      throw listingError;
    }

    // Verify seller email matches listing
    if (listing.email !== body.seller_email) {
      return NextResponse.json(
        { error: 'Seller email does not match listing' },
        { status: 400 }
      );
    }

    const messageData = {
      listing_id: body.listing_id,
      buyer_name: body.buyer_name.trim(),
      buyer_email: body.buyer_email.toLowerCase().trim(),
      message: body.message.trim(),
      seller_email: body.seller_email.toLowerCase().trim(),
      created_at: new Date().toISOString()
    };

    const { data: message, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json(
        { error: 'Failed to send message', details: error.message },
        { status: 500 }
      );
    }

    // TODO: Implement email notification to seller
    // This would typically integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP
    
    return NextResponse.json(
      {
        success: true,
        data: message,
        message: 'Message sent successfully'
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
