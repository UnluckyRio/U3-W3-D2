// Componente per visualizzare la lista degli articoli
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import { SpaceflightNewsAPI } from '../services/api';
// Interfacce per il componente ArticleList
interface Author {
  name: string;
  socials: string | null;
}

interface Launch {
  launch_id: string;
  provider: string;
}

interface Event {
  event_id: string;
  provider: string;
}

interface Article {
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

// Interfaccia per lo stato del componente ArticleList
interface ArticleListState {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const ArticleList: React.FC = () => {
  // State per gestire articoli, loading e errori
  const [state, setState] = useState<ArticleListState>({
    articles: [],
    loading: true,
    error: null
  });
  
  // State per la paginazione
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const ARTICLES_PER_PAGE = 12;

  // Funzione per caricare gli articoli
  const loadArticles = async (page: number = 0, search: string = '') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let response;
      if (search.trim()) {
        response = await SpaceflightNewsAPI.searchArticles(search, ARTICLES_PER_PAGE);
        setIsSearching(true);
      } else {
        response = await SpaceflightNewsAPI.getArticles(ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);
        setIsSearching(false);
      }
      
      const newArticles = page === 0 ? response.results : [...state.articles, ...response.results];
      
      setState({
        articles: newArticles,
        loading: false,
        error: null
      });
      
      setHasMore(response.next !== null);
      setCurrentPage(page);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Errore nel caricamento degli articoli'
      }));
    }
  };

  // Carica gli articoli al primo render
  useEffect(() => {
    loadArticles();
  }, []);

  // Funzione per caricare più articoli (paginazione)
  const loadMoreArticles = () => {
    if (!state.loading && hasMore && !isSearching) {
      loadArticles(currentPage + 1);
    }
  };

  // Funzione per gestire la ricerca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadArticles(0, searchQuery);
    } else {
      loadArticles(0);
    }
  };

  // Funzione per resettare la ricerca
  const resetSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadArticles(0);
  };

  return (
    <Container className="py-4">
      {/* Header con titolo e ricerca */}
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4 text-primary">
            🚀 Spaceflight News
          </h1>
          <p className="text-center text-muted mb-4">
            Le ultime notizie dal mondo dell'esplorazione spaziale
          </p>
          
          {/* Barra di ricerca */}
          <Form onSubmit={handleSearch} className="mb-4">
            <Row className="justify-content-center">
              <Col md={6}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Cerca articoli..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    Cerca
                  </Button>
                  {isSearching && (
                    <Button variant="outline-secondary" onClick={resetSearch}>
                      Reset
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Messaggio di ricerca attiva */}
      {isSearching && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info">
              Risultati per: <strong>"{searchQuery}"</strong> - {state.articles.length} articoli trovati
            </Alert>
          </Col>
        </Row>
      )}

      {/* Gestione errori */}
      {state.error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <Alert.Heading>Errore!</Alert.Heading>
              <p>{state.error}</p>
              <Button variant="outline-danger" onClick={() => loadArticles()}>
                Riprova
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Lista degli articoli */}
      <Row>
        {state.articles.map((article: Article) => (
          <Col key={article.id} lg={4} md={6} className="mb-4">
            <ArticleCard article={article} />
          </Col>
        ))}
      </Row>

      {/* Loading spinner */}
      {state.loading && (
        <Row className="justify-content-center my-4">
          <Col className="text-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Caricamento...</span>
            </Spinner>
            <p className="mt-2 text-muted">Caricamento articoli...</p>
          </Col>
        </Row>
      )}

      {/* Pulsante per caricare più articoli */}
      {!state.loading && hasMore && !isSearching && state.articles.length > 0 && (
        <Row className="justify-content-center my-4">
          <Col className="text-center">
            <Button variant="primary" size="lg" onClick={loadMoreArticles}>
              Carica altri articoli
            </Button>
          </Col>
        </Row>
      )}

      {/* Messaggio quando non ci sono più articoli */}
      {!state.loading && !hasMore && state.articles.length > 0 && (
        <Row className="justify-content-center my-4">
          <Col className="text-center">
            <p className="text-muted">Non ci sono altri articoli da caricare.</p>
          </Col>
        </Row>
      )}

      {/* Messaggio quando non ci sono articoli */}
      {!state.loading && state.articles.length === 0 && !state.error && (
        <Row className="justify-content-center my-4">
          <Col className="text-center">
            <Alert variant="info">
              <h4>Nessun articolo trovato</h4>
              <p>Non sono stati trovati articoli corrispondenti alla tua ricerca.</p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ArticleList;