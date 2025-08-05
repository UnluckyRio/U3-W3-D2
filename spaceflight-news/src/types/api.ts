// Interfacce per i dati dell'API Spaceflight News

// Interfaccia per l'autore di un articolo
export interface Author {
  name: string;
  socials: string | null;
}

// Interfaccia per i lanci associati a un articolo
export interface Launch {
  launch_id: string;
  provider: string;
}

// Interfaccia per gli eventi associati a un articolo
export interface Event {
  event_id: string;
  provider: string;
}

// Interfaccia per un singolo articolo
export interface Article {
  id: number;
  title: string;
  authors: Author[];
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: Launch[];
  events: Event[];
}

// Interfaccia per la risposta dell'API che contiene la lista di articoli
export interface ArticlesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}