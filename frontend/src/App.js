// Import Depencies
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

// Import Components, styles, mdiea
import Navigation from './components/Navigation.mjs';
import './App.css';
import './output.css';

// Import main navigation pages
import HomePage from './pages/HomePage';
import ComposersPage from './pages/ComposersPage';
import CompositionsPage from './pages/CompositionsPage';
import CataloguesPage from './pages/CataloguesPage';
import FormsPage from './pages/FormsPage';
import InstrumentsPage from './pages/InstrumentsPage';

// Import detailed display pages
import DisplayCompositionPage from './pages/DisplayCompositionPage';

// Import collection editing pages
import AddComposerPage from './pages/AddComposerPage';
import EditComposerPage from './pages/EditComposerPage';
import AddCataloguePage from './pages/AddCataloguePage';
import EditCataloguePage from './pages/EditCataloguePage';
import AddCompositionPage from './pages/AddCompositionPage';
import EditCompositionPage from './pages/EditCompositionPage';

function App() {

  // Define state variables for modifying collections
  const [composerToEdit, setComposerToEdit]   = useState([])
  const [catalogueToEdit, setCatalogueToEdit] = useState([])
  const [compositionToEdit, setCompositionToEdit] = useState([])

  return (
    <>
      <html data-theme="coffee">
        {/* <header>
          <h1 className="site-title">
            <img src="violinicon.png" alt="violin icon" width="64px" height="64px" style={{position: 'static'}} />
            <Link to="#">Classical Compositions Database</Link>
          </h1>
          <h3> A project by Jacob Barber, Aiden Murphy, and Matthew Menold</h3>
        </header> */}

        <Navigation />

        <main>
          <section>
            <Routes>
              {/* Main Navigation Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/composers" element={<ComposersPage setComposerToEdit={setComposerToEdit} />} />
              <Route path="/catalogues" element={<CataloguesPage setCatalogueToEdit={setCatalogueToEdit} />} />
              <Route path="/compositions" element={<CompositionsPage setCompositionToEdit={setCompositionToEdit} />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/instruments" element={<InstrumentsPage />} />

              {/* Detailed Display Routes */}
              <Route path="/composition/:compositionID" element={<DisplayCompositionPage setCompositionToEdit={setCompositionToEdit} />} />

              {/* Collection Editing Routes */}
              <Route path="/add-composer" element={<AddComposerPage />} />
              <Route path="/edit-composer" element={<EditComposerPage composerToEdit={composerToEdit} />} />
              <Route path="/add-catalogue" element={<AddCataloguePage />} />
              <Route path="/edit-catalogue" element={<EditCataloguePage catalogueToEdit={catalogueToEdit} />} />
              <Route path="/add-composition" element={<AddCompositionPage />} />
              <Route path="/edit-composition" element={<EditCompositionPage compositionToEdit={compositionToEdit} />} />
            </Routes>
          </section>
        </main>
        <footer>
          <p>&copy; 2024, Team Data Pantry</p>
        </footer>
      </html>
    </>
  );
}

export default App;