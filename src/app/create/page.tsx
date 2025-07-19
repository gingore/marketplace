"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    email: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/create-listing" />

      <div className="max-w-6xl mx-auto p-6 flex gap-8">
        {/* Left Side - Form */}
        <div className="w-80 flex-shrink-0">
          {/* Navigation Steps */}
          <div className="flex items-center gap-6 mb-6 text-sm">
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

          <h2 className="text-lg font-semibold mb-4">Create new listing</h2>
          
          <div className="space-y-4">
            {/* Photo Upload */}
            <div>
              <div className="w-full h-48 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-600 text-sm">Add photos</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <Input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-gray-300 rounded-lg"
              />
            </div>

            {/* Price */}
            <div>
              <Input
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-gray-300 rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-gray-300 rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <Textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full h-32 resize-none bg-gray-50 border-gray-300 rounded-lg"
              />
            </div>

            {/* Next Button */}
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 font-medium">
              Next
            </Button>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-6">Preview</h3>
            
            <div className="flex gap-6">
              {/* Preview Image */}
              <div className="w-80 h-60 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg"></div>
              </div>

              {/* Preview Details */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold">{formData.title || "Title"}</h4>
                    <p className="text-xl font-bold text-gray-900">{formData.price || "Price"}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Listed 1 hour ago</p>
                    <p>in Palo Alto, CA</p>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-1">Seller Information</h5>
                    <p className="text-sm text-gray-600">Greg Wientjes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
