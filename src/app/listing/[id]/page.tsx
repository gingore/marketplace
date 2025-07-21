"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { supabase, type Listing } from "@/lib/supabase";
import { apiClient } from "@/lib/api-client";

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("I want to buy your item!");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messageStatus, setMessageStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        // Get the ID from params
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        console.log('Fetching listing with ID:', id);
        
        // Use Supabase directly for more reliable data fetching
        const { data: listing, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Supabase response:', { listing, error });

        if (error) {
          console.error('Error fetching listing:', error);
          setListing(null);
        } else if (listing) {
          // Format price for display
          const formattedListing = {
            ...listing,
            price: `$${listing.price}`
          };
          console.log('Setting listing:', formattedListing);
          setListing(formattedListing);
        } else {
          console.log('No listing found');
          setListing(null);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setListing(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchListing();
  }, [params]);

  const handleSendMessage = async () => {
    if (!buyerName || !buyerEmail || !message || !listing) {
      setMessageStatus({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setIsSending(true);
    setMessageStatus(null);

    try {
      const result = await apiClient.sendMessage({
        listing_id: listing.id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        message: message,
        seller_email: listing.seller_email
      });

      if (result.error) {
        setMessageStatus({ type: 'error', text: result.error });
      } else {
        setMessageStatus({ type: 'success', text: 'Message sent successfully!' });
        setMessage("");
        setBuyerName("");
        setBuyerEmail("");
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessageStatus({ type: 'error', text: 'Failed to send message' });
    }

    setIsSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton={true} backUrl="/" />
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="flex gap-8">
              <div className="flex-1 bg-gray-200 aspect-[4/3] rounded-lg"></div>
              <div className="w-80 space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-500">Debug: Loading...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton={true} backUrl="/" />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Listing not found</p>
            <p className="text-sm text-gray-400 mt-2">Debug: loading = {loading.toString()}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering listing:', listing);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/" />

      <div className="max-w-6xl mx-auto p-6 flex gap-8">
        {/* Left Side - Image */}
        <div className="flex-1">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              width={800}
              height={600}
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
          ) : (
            <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg aspect-[4/3] flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg"></div>
            </div>
          )}
        </div>

        {/* Right Side - Details */}
        <div className="w-80 flex-shrink-0">
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
              <p className="text-2xl font-bold text-gray-900">{listing.price}</p>
            </div>

            {/* Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {listing.category}
              </span>
            </div>

            {/* Listing Info */}
            <div className="text-sm text-gray-600">
              <p>Listed {new Date(listing.created_at).toLocaleDateString()}</p>
              <p>in {listing.location}</p>
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{listing.description}</p>
              </div>
            )}

            {/* Message Section */}
            <div>
              <h3 className="font-semibold mb-3">Message Seller</h3>
              
              {messageStatus && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${
                  messageStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {messageStatus.text}
                </div>
              )}

              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full"
                />
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 resize-none"
                  placeholder="Type your message here..."
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                >
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
