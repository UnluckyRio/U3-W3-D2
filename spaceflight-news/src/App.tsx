// Componente principale dell'applicazione Spaceflight News
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import './App.css';

// Componente App principale
function App() {
  return (
    <Router>
      <div className="App">
        {/* Definizione delle rotte */}
        <Routes>
          {/* Rotta principale - Lista degli articoli */}
          <Route path="/" element={<ArticleList />} />
          
          {/* Rotta per i dettagli dell'articolo */}
          <Route path="/article/:id" element={<ArticleDetail />} />
          
          {/* Rotta di fallback - reindirizza alla home */}
          <Route path="*" element={<ArticleList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
