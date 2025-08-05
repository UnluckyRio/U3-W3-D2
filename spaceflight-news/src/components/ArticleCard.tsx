// Componente per visualizzare una card di articolo
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArticleCardProps } from '../types/api';

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

// Componente ArticleCard
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card className="h-100 shadow-sm hover-shadow" style={{ transition: 'all 0.3s ease' }}>
      {/* Immagine di copertina */}
      <Card.Img 
        variant="top" 
        src={article.image_url} 
        alt={article.title}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          // Fallback per immagini non caricate
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/400x200?text=Immagine+non+disponibile';
        }}
      />
      
      <Card.Body className="d-flex flex-column">
        {/* Titolo dell'articolo */}
        <Card.Title className="mb-3">
          <Link 
            to={`/article/${article.id}`} 
            className="text-decoration-none text-dark"
            style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            {article.title}
          </Link>
        </Card.Title>
        
        {/* Riassunto dell'articolo */}
        <Card.Text className="flex-grow-1 text-muted">
          {article.summary.length > 150 
            ? `${article.summary.substring(0, 150)}...` 
            : article.summary
          }
        </Card.Text>
        
        {/* Informazioni aggiuntive */}
        <div className="mt-auto">
          {/* Badge per articolo in evidenza */}
          {article.featured && (
            <Badge bg="warning" className="mb-2">
              In Evidenza
            </Badge>
          )}
          
          {/* Fonte e data */}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <strong>{article.news_site}</strong>
            </small>
            <small className="text-muted">
              {formatDate(article.published_at)}
            </small>
          </div>
          
          {/* Autori */}
          {article.authors.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">
                <strong>Autore/i:</strong> {article.authors.map(author => author.name).join(', ')}
              </small>
            </div>
          )}
          
          {/* Badge per lanci e eventi */}
          <div className="mt-2">
            {article.launches.length > 0 && (
              <Badge bg="primary" className="me-1">
                {article.launches.length} Lancio/i
              </Badge>
            )}
            {article.events.length > 0 && (
              <Badge bg="success">
                {article.events.length} Evento/i
              </Badge>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;