import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Test Supabase connection
export async function GET() {
  try {
    // First, try to get the current user/session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Auth status:', { user: user?.id || 'anonymous', error: authError?.message });

    // Try to query the listings table schema
    const { data: schemaData, error: schemaError } = await supabase
      .from('listings')
      .select('*')
      .limit(1);

    console.log('Schema query result:', { 
      data: schemaData, 
      error: schemaError?.message,
      code: schemaError?.code,
      details: schemaError?.details
    });

    // Try to get table information using a simple query
    const { data: testInsert, error: insertError } = await supabase
      .from('listings')
      .select('id, title, email, created_at')
      .limit(0);

    console.log('Column test result:', { 
      success: !insertError,
      error: insertError?.message,
      code: insertError?.code
    });

    return NextResponse.json({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      authStatus: authError?.message || 'Connected',
      schemaQuery: {
        success: !schemaError,
        error: schemaError?.message,
        code: schemaError?.code,
        dataLength: schemaData?.length || 0
      },
      columnTest: {
        success: !insertError,
        error: insertError?.message,
        code: insertError?.code,
        hint: insertError ? "Check if your database tables have the correct schema" : "Schema looks good"
      }
    });

  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { 
        error: 'Connection test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      { status: 500 }
    );
  }
}
