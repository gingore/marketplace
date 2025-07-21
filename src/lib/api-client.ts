const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : '/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Request failed' };
      }

      return { data: result };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  async getListings(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    
    searchParams.set('_t', Date.now().toString());

    const query = searchParams.toString();
    return this.request(`/listings${query ? `?${query}` : ''}`);
  }

  async getListing(id: string) {
    return this.request(`/listings/${id}`);
  }

  async createListing(listing: {
    title: string;
    price: string;
    seller_email: string;
    description?: string;
    category: string;
    location?: string;
    image_url?: string;
  }) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  }

  async updateListing(id: string, updates: Partial<{
    title: string;
    price: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
  }>) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteListing(id: string) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async getMessages(params: {
    listing_id?: string;
    seller_email?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params.listing_id) searchParams.set('listing_id', params.listing_id);
    if (params.seller_email) searchParams.set('seller_email', params.seller_email);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    return this.request(`/messages?${searchParams.toString()}`);
  }

  async sendMessage(message: {
    listing_id: string;
    buyer_name: string;
    buyer_email: string;
    message: string;
    seller_email: string;
  }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Upload failed' };
      }

      return { data: result.data };
    } catch (error) {
      console.error('Upload failed:', error);
      return { error: 'Network error' };
    }
  }

  async deleteImage(fileName: string) {
    return this.request(`/upload?fileName=${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

export interface Listing {
  id: string;
  title: string;
  price: string;
  seller_email: string;
  description?: string;
  category: string;
  location: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_email: string;
  message: string;
  seller_email: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface UploadResponse {
  fileName: string;
  url: string;
  size: number;
  type: string;
}
