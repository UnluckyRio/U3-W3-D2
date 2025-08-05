// Servizio per le chiamate API a Spaceflight News
import { Article, ArticlesResponse } from '../types/api';

const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

// Classe per gestire le chiamate API
export class SpaceflightNewsAPI {
  // Metodo per ottenere la lista degli articoli
  static async getArticles(limit: number = 10, offset: number = 0): Promise<ArticlesResponse> {
    try {
      const response = await fetch(`${BASE_URL}/articles?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      const data: ArticlesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Errore nel recupero degli articoli:', error);
      throw error;
    }
  }

  // Metodo per ottenere un singolo articolo per ID
  static async getArticleById(id: string): Promise<Article> {
    try {
      const response = await fetch(`${BASE_URL}/articles/${id}`);
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      const data: Article = await response.json();
      return data;
    } catch (error) {
      console.error(`Errore nel recupero dell'articolo ${id}:`, error);
      throw error;
    }
  }

  // Metodo per cercare articoli per titolo
  static async searchArticles(query: string, limit: number = 10): Promise<ArticlesResponse> {
    try {
      const response = await fetch(`${BASE_URL}/articles?search=${encodeURIComponent(query)}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      const data: ArticlesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Errore nella ricerca degli articoli:', error);
      throw error;
    }
  }
}