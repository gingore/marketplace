"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

export default function ListingDetail({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("I want to buy your bike!");

  // Mock data - in a real app this would come from an API
  const listing = {
    id: params.id,
    title: "Bike 24 inch",
    price: "$99",
    location: "Palo Alto, CA",
    listedTime: "1 hour ago",
    seller: "Wei Gu",
    description: "Great condition bike, perfect for commuting or leisure rides.",
    images: ["/placeholder-image.jpg"]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/" />

      <div className="max-w-6xl mx-auto p-6 flex gap-8">
        {/* Left Side - Image */}
        <div className="flex-1">
          <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg aspect-[4/3] flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg"></div>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="w-80 flex-shrink-0">
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
              <p className="text-2xl font-bold text-gray-900">{listing.price}</p>
            </div>

            {/* Listing Info */}
            <div className="text-sm text-gray-600">
              <p>Listed {listing.listedTime}</p>
              <p>in {listing.location}</p>
            </div>

            {/* Seller Info */}
            <div>
              <h3 className="font-semibold mb-2">Seller Information</h3>
              <p className="text-gray-700">{listing.seller}</p>
            </div>

            {/* Message Section */}
            <div>
              <h3 className="font-semibold mb-3">Send seller a message</h3>
              <div className="space-y-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 resize-none"
                  placeholder="Type your message here..."
                />
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
