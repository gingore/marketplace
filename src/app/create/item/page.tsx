"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import { apiClient } from "@/lib/api-client";
import { validateImageFile } from "@/lib/upload";
import LoadingSpinner from "@/components/LoadingSpinner";

const categories = [
  "Vehicles",
  "Property Rentals", 
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups"
];

function CreateItemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    seller_email: "",
    description: "",
    category: "",
    location: "Palo Alto, CA"
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFormData(prev => ({
        ...prev,
        category: categoryParam
      }));
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setError(null);
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processImageFile(imageFile);
    }
  };

  const handlePriceChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    if (cleanValue) {
      const formatted = cleanValue.startsWith('$') ? cleanValue : `$${cleanValue}`;
      handleInputChange('price', formatted);
    } else {
      handleInputChange('price', '');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.seller_email || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validateEmail(formData.seller_email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.price.startsWith('$')) {
      setError("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = null;
      
      if (imageFile) {
        try {
          const uploadResult = await apiClient.uploadImage(imageFile);
          if (uploadResult.error) {
            console.warn('Image upload failed:', uploadResult.error);
          } else {
            imageUrl = uploadResult.data?.url;
          }
        } catch (uploadError) {
          console.warn('Image upload error:', uploadError);
        }
      }

      const { error: createError } = await apiClient.createListing({
        title: formData.title,
        price: formData.price,
        seller_email: formData.seller_email,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        image_url: imageUrl || undefined
      });

      if (createError) {
        throw new Error(createError);
      }

      router.push('/?success=listing-created');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/create" />

      <div className="max-w-2xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold mb-6">Create Item Listing</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos <span className="text-gray-500">(optional)</span>
              </label>
              <div 
                onClick={handleImageSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Add Photos</p>
                    <p className="text-sm text-gray-500">Drag photos here or click to browse</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="What are you selling?"
                className="w-full"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="$0"
                className="w-full"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your item..."
                className="w-full h-32 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Where is this item located?"
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.seller_email}
                onChange={(e) => handleInputChange('seller_email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Creating Listing..." : "Post Listing"}
            </Button>
          </form>
        </div>

        {/* Real-time Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">Preview</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Preview Image */}
            <div className="aspect-square bg-blue-100 border-2 border-dashed border-blue-300 flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400"></div>
              )}
            </div>
            
            {/* Preview Details */}
            <div className="p-4">
              <div className="font-semibold text-lg mb-1">
                {formData.price || "$0"}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {formData.title || "Item title"}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {formData.location}
              </div>
              {formData.category && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {formData.category}
                  </span>
                </div>
              )}
              {formData.description && (
                <div className="text-sm text-gray-700 mt-2">
                  <strong>Description:</strong> {formData.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function CreateItem() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateItemForm />
    </Suspense>
  );
}
