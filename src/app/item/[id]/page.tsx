"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";
import { supabase, type Listing } from "@/lib/supabase";

export default function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
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
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        const { data: listing, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching listing:', error);
          setListing(null);
        } else if (listing) {
          const formattedListing = {
            ...listing,
            price: `$${listing.price}`
          };
          setListing(formattedListing);
        } else {
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
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listing.id,
          buyer_name: buyerName.trim(),
          buyer_email: buyerEmail.toLowerCase().trim(),
          message: message.trim(),
          seller_email: listing.seller_email.toLowerCase().trim()
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API error:', result);
        let errorMessage = 'Failed to send message. Please try again.';
        if (result.error) {
          errorMessage = `Error: ${result.error}`;
          if (result.details) {
            errorMessage += ` - ${result.details}`;
          }
        }
        setMessageStatus({ type: 'error', text: errorMessage });
      } else {
        setMessageStatus({ type: 'success', text: 'Message sent successfully!' });
        setMessage("I want to buy your item!");
        setBuyerName("");
        setBuyerEmail("");
      }
    } catch (err) {
      console.error('Send message error:', err);
      console.error('Error type:', typeof err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setMessageStatus({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setIsSending(false);
    }
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
            <p className="text-gray-600">Item not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} backUrl="/" />

      <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
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
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
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
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l-6-6m0 0V9a2 2 0 012-2h4m-6 6l6 6m-6-6H9a2 2 0 002-2v4m6-6l6 6m-6-6v4a2 2 0 002 2h4" />
                </svg>
                <span>Listed {new Date(listing.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{listing.location}</span>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{listing.description}</p>
              </div>
            )}

            {/* Seller Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Seller Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Contact seller at:</p>
                <p className="font-medium">{listing.seller_email}</p>
              </div>
            </div>

            {/* Message Section */}
            <div className="border-t border-gray-200 pt-6">
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
