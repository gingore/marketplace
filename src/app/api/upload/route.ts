import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type', 
          details: `Allowed types: ${allowedTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: 'File too large', 
          details: `Maximum file size is ${maxSize / (1024 * 1024)}MB` 
        },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `listing-${timestamp}-${randomString}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to generate public URL' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          fileName: fileName,
          url: urlData.publicUrl,
          size: file.size,
          type: file.type
        },
        message: 'File uploaded successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    
    if (error instanceof Error && error.message.includes('FormData')) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'fileName parameter is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from('listing-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      return NextResponse.json(
        { error: 'Failed to delete file', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
