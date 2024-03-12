// Import Depencies
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

// Import Components, styles, mdiea
import Navigation from './components/Navigation.mjs';
import './App.css';

// Import main navigation pages
import HomePage from './pages/HomePage';
import ComposersPage from './pages/ComposersPage';
import CompositionsPage from './pages/CompositionsPage';
import MovementsPage from './pages/MovementsPage';
import CataloguesPage from './pages/CataloguesPage';
import FormsPage from './pages/FormsPage';
import InstrumentsPage from './pages/InstrumentsPage';

// Import collection editing pages
import AddComposerPage from './pages/AddComposerPage';
import EditComposerPage from './pages/EditComposerPage';
import AddCataloguePage from './pages/AddCataloguePage';
import EditCataloguePage from './pages/EditCataloguePage';

function App() {

  // Define state variables for collections
  const [composerToEdit, setComposerToEdit]   = useState([])
  const [catalogueToEdit, setCatalogueToEdit] = useState([])

  return (
    <>
      <header>
        <div className="header-contents">
          <h1 className="site-title">
            <img src="violinicon.png" alt="violin icon" width="64px" height="64px" style={{position: 'static'}} />
            <Link to="#">Classical Compositions Database</Link>
          </h1>
          <p>A project by Jacob Barber, Aiden Murphy, and Matthew Menold</p>
        </div>
        <Navigation />
      </header>
      <main>
        <section>
          <Routes>
            {/* Main Navigation Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/composers" element={<ComposersPage setComposerToEdit={setComposerToEdit} />} />
            <Route path="/compositions" element={<CompositionsPage />} />
            <Route path="/movements" element={<MovementsPage />} />
            <Route path="/catalogues" element={<CataloguesPage setCatalogueToEdit={setCatalogueToEdit} />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/instruments" element={<InstrumentsPage />} />

            {/* Collection Editing Routes */}
            <Route path="/add-composer" element={<AddComposerPage />} />
            <Route path="/edit-composer" element={<EditComposerPage composerToEdit={composerToEdit} />} />
            <Route path="/add-catalogue" element={<AddCataloguePage />} />
            <Route path="/edit-catalogue" element={<EditCataloguePage catalogueToEdit={catalogueToEdit} />} />
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

