// Componente per visualizzare i dettagli di un singolo articolo
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Badge, Card } from 'react-bootstrap';
import { SpaceflightNewsAPI } from '../services/api';
// Interfacce per il componente ArticleDetail
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

// Interfaccia per lo stato del componente ArticleDetail
interface ArticleDetailState {
  article: Article | null;
  loading: boolean;
  error: string | null;
}

// Funzione per formattare la data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ArticleDetail: React.FC = () => {
  // Ottieni l'ID dell'articolo dai parametri URL
  const { id } = useParams<{ id: string }>();
  
  // State per gestire l'articolo, loading e errori
  const [state, setState] = useState<ArticleDetailState>({
    article: null,
    loading: true,
    error: null
  });

  // Funzione per caricare i dettagli dell'articolo
  const loadArticle = async (articleId: string) => {
    try {
      setState({ article: null, loading: true, error: null });
      
      const article = await SpaceflightNewsAPI.getArticleById(articleId);
      
      setState({
        article,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        article: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Errore nel caricamento dell\'articolo'
      });
    }
  };

  // Carica l'articolo quando il componente viene montato o l'ID cambia
  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  // Gestione del loading
  if (state.loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status" variant="primary" size="lg">
              <span className="visually-hidden">Caricamento...</span>
            </Spinner>
            <p className="mt-3 text-muted">Caricamento articolo...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  // Gestione degli errori
  if (state.error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger">
              <Alert.Heading>Errore!</Alert.Heading>
              <p>{state.error}</p>
              <div className="d-flex gap-2">
                <Button variant="outline-danger" onClick={() => id && loadArticle(id)}>
                  Riprova
                </Button>
                <Link to="/">
                  <Button variant="primary">Torna alla Home</Button>
                </Link>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  // Se non c'è articolo
  if (!state.article) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="warning">
              <h4>Articolo non trovato</h4>
              <p>L'articolo richiesto non è stato trovato.</p>
              <Link to="/">
                <Button variant="primary">Torna alla Home</Button>
              </Link>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const { article } = state;

  return (
    <Container className="py-4">
      {/* Pulsante per tornare indietro */}
      <Row className="mb-4">
        <Col>
          <Link to="/">
            <Button variant="outline-primary">
              ← Torna agli articoli
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Contenuto principale dell'articolo */}
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-lg border-0">
            {/* Immagine di copertina */}
            <Card.Img 
              variant="top" 
              src={article.image_url} 
              alt={article.title}
              style={{ height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x400?text=Immagine+non+disponibile';
              }}
            />
            
            <Card.Body className="p-4">
              {/* Badge per articolo in evidenza */}
              {article.featured && (
                <div className="mb-3">
                  <Badge bg="warning" className="fs-6">
                    ⭐ Articolo in Evidenza
                  </Badge>
                </div>
              )}
              
              {/* Titolo */}
              <h1 className="mb-4 text-primary">{article.title}</h1>
              
              {/* Metadati */}
              <Row className="mb-4">
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Fonte:</strong> <Badge bg="secondary">{article.news_site}</Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Pubblicato:</strong> {formatDate(article.published_at)}
                  </p>
                  <p className="mb-2">
                    <strong>Aggiornato:</strong> {formatDate(article.updated_at)}
                  </p>
                </Col>
                <Col md={6}>
                  {/* Autori */}
                  {article.authors.length > 0 && (
                    <p className="mb-2">
                      <strong>Autore/i:</strong>
                      <br />
                      {article.authors.map((author, index) => (
                        <Badge key={index} bg="info" className="me-1 mt-1">
                          {author.name}
                        </Badge>
                      ))}
                    </p>
                  )}
                  
                  {/* Lanci e Eventi */}
                  <div className="mt-3">
                    {article.launches.length > 0 && (
                      <p className="mb-2">
                        <Badge bg="primary" className="me-2">
                          🚀 {article.launches.length} Lancio/i Correlato/i
                        </Badge>
                      </p>
                    )}
                    {article.events.length > 0 && (
                      <p className="mb-2">
                        <Badge bg="success">
                          📅 {article.events.length} Evento/i Correlato/i
                        </Badge>
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
              
              {/* Riassunto */}
              <div className="mb-4">
                <h3 className="h4 mb-3">Riassunto</h3>
                <p className="lead text-muted" style={{ lineHeight: '1.6' }}>
                  {article.summary}
                </p>
              </div>
              
              {/* Link all'articolo originale */}
              <div className="mb-4">
                <h3 className="h4 mb-3">Leggi l'articolo completo</h3>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  Vai all'articolo originale 🔗
                </a>
              </div>
              
              {/* Dettagli aggiuntivi sui lanci */}
              {article.launches.length > 0 && (
                <div className="mb-4">
                  <h3 className="h4 mb-3">Lanci Correlati</h3>
                  <Row>
                    {article.launches.map((launch, index) => (
                      <Col key={index} md={6} className="mb-2">
                        <Card className="border-primary">
                          <Card.Body>
                            <p className="mb-1"><strong>ID Lancio:</strong> {launch.launch_id}</p>
                            <p className="mb-0"><strong>Provider:</strong> {launch.provider}</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              
              {/* Dettagli aggiuntivi sugli eventi */}
              {article.events.length > 0 && (
                <div className="mb-4">
                  <h3 className="h4 mb-3">Eventi Correlati</h3>
                  <Row>
                    {article.events.map((event, index) => (
                      <Col key={index} md={6} className="mb-2">
                        <Card className="border-success">
                          <Card.Body>
                            <p className="mb-1"><strong>ID Evento:</strong> {event.event_id}</p>
                            <p className="mb-0"><strong>Provider:</strong> {event.provider}</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Pulsante per tornare indietro (footer) */}
      <Row className="mt-4">
        <Col className="text-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              ← Torna agli articoli
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ArticleDetail;