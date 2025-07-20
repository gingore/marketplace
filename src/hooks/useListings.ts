"use client";

import { useState, useEffect } from 'react'
import { supabase, type Listing, type Message } from '@/lib/supabase'

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = async (category?: string) => {
    try {
      setLoading(true)
      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      setListings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single()

      if (error) throw error
      
      // Add the new listing to the local state
      setListings(prev => [data, ...prev])
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create listing'
      return { data: null, error: errorMessage }
    }
  }

  const getListing = async (id: string): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching listing:', err)
      return null
    }
  }

  const sendMessage = async (messageData: Omit<Message, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single()

      if (error) throw error

      // Here you could also trigger an email notification
      // await sendEmailNotification(messageData)

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      return { data: null, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  return {
    listings,
    loading,
    error,
    fetchListings,
    createListing,
    getListing,
    sendMessage,
    refetch: fetchListings
  }
}
