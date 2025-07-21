import { supabase } from '@/lib/supabase'

export async function uploadImage(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `listings/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return { url: data.publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'Failed to upload image' 
    }
  }
}

export function validateImageFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)'
  }

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB'
  }

  return null
}
