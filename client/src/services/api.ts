const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5000/api';

export type Card = {
  id?: string;
  name: string;
  number: number;
  set_id?: string;
  created_at?: string;
};

export type TCGGame = 'pokemon' | 'lorcana' | 'magic' | 'yugioh' | 'other';

export type Set = {
  id: string;
  name: string;
  game: TCGGame;
  cards: Card[];
  card_count?: number;
  created_at: string;
  updated_at: string;
};

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Sets API
  async getSets(game?: TCGGame): Promise<Set[]> {
    const params = game ? `?game=${game}` : '';
    return this.request<Set[]>(`/sets${params}`);
  }

  async getSet(id: string): Promise<Set> {
    return this.request<Set>(`/sets/${id}`);
  }

  async createSet(data: { name: string; game: TCGGame; cards: Card[] }): Promise<Set> {
    return this.request<Set>('/sets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSet(id: string, data: { name: string; game: TCGGame; cards: Card[] }): Promise<Set> {
    return this.request<Set>(`/sets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSet(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/sets/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; database: string }> {
    return this.request<{ status: string; timestamp: string; database: string }>('/health');
  }
}

export const apiService = new ApiService();
