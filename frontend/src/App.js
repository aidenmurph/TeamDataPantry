import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Composers from './ComposersPage';
import Compositions from './CompositionsPage';
import Movements from './MovementsPage';
import Catalogues from './CataloguesPage';
import Forms from './FormsPage';
import Instruments from './InstrumentsPage';
import KeySignatures from './KeySignaturesPage';
// Import other page components here

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/composers" element={<Composers />} />
      <Route path="/compositions" element={<Compositions />} />
      <Route path="/movements" element={<Movements />} />
      <Route path="/catalogues" element={<Catalogues />} />
      <Route path="/forms" element={<Forms />} />
      <Route path="/instruments" element={<Instruments />} />
      <Route path="/key_signatures" element={<KeySignatures />} />
      {/* Add additional routes for other components here */}
    </Routes>
  );
}

export default App;