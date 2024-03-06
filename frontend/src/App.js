// Import Depencies
import React from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

// Import Components, styles, mdiea
import Navigation from './components/Navigation';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import ComposersPage from './pages/ComposersPage';
import CompositionsPage from './pages/CompositionsPage';
import MovementsPage from './pages/MovementsPage';
import CataloguesPage from './pages/CataloguesPage';
import FormsPage from './pages/FormsPage';
import InstrumentsPage from './pages/InstrumentsPage';
import KeySignaturesPage from './pages/KeySignaturesPage';

function App() {
  return (
    <>
      <header>
        <h1 className="site-title">
          <img src="violinicon.png" alt="violin icon" width="64px" height="64px" style={{position: 'static'}} />
          <Link to="#">Classical Composition and Recording Exploration</Link>
        </h1>
        <h3> A project by Jacob Barber, Aiden Murphy, and Matthew Menold</h3>
      </header>

      <Navigation />

      <main>
        <section>
          <Routes>
            {/* Main Navigation Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/composers" element={<ComposersPage />} />
            <Route path="/compositions" element={<CompositionsPage />} />
            <Route path="/movements" element={<MovementsPage />} />
            <Route path="/catalogues" element={<CataloguesPage />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/instruments" element={<InstrumentsPage />} />
            <Route path="/key-signatures" element={<KeySignaturesPage />} />
          </Routes>
        </section>
      </main>

      <footer>
        <p>&copy; 2024, Team Data Pantry</p>
      </footer>
    </>
  );
}

export default App;