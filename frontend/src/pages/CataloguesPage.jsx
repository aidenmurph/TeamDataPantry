import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Catalogues() {
  const catalogues = [
    {
      title: 'Catalogue de l\'oeuvre de Claude Debussy',
      composer: 'Maurice Ravel',
      symbol: 'M.',
      author: 'Marcel Marnat',
      publicationYear: '1986'
    },
    {
      title: 'Antonín Dvořák, Complete Catalogue of Works',
      composer: 'Antonín Dvořák',
      symbol: 'H.',
      author: 'Peter J. F. Herbert',
      publicationYear: '1988'
    },
    {
      title: 'Antonín Dvořák: thematický katalog',
      composer: 'Antonín Dvořák',
      symbol: 'B.',
      author: 'Jarmil Burghauser',
      publicationYear: '1996'
    },
    {
      title: 'Dvořák\'s Werke ... ein vollständiges Verzeichnis in chronologischer thematischer und systematischer Anordnung',
      composer: 'Antonín Dvořák',
      symbol: 'S.',
      author: 'Otakar Šourek',
      publicationYear: '1917'
    },
    {
      title: 'Antonín Dvořák, Complete Catalogue of Works',
      composer: 'Antonín Dvořák',
      symbol: 'T.',
      author: 'Ian T. Trufitt',
      publicationYear: '1974'
    }
  ];

  // Handlers for Edit and Delete actions - to be implemented
  const handleEdit = (catalogueTitle) => {
    // Implement edit functionality
  };

  const handleDelete = (catalogueTitle) => {
    // Implement delete functionality
  };

  return (
    <div>
      <h1>Classical Composition and Recording Exploration</h1>
      <nav>
	<Link to="/">Home</Link> |
        <Link to="/composers">Composers</Link> |
        <Link to="/compositions">Compositions</Link> |
        <Link to="/movements">Movements</Link> |
        <Link to="/catalogues">Catalogues</Link> |
        <Link to="/forms">Forms</Link> |
        <Link to="/instruments">Instruments</Link> |
        <Link to="/key_signatures">Key Signatures</Link>
      </nav>

      <table>
        <thead>
          <tr>
            <th>Catalogue Title</th>
            <th>Composer</th>
            <th>Symbol</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {catalogues.map((catalogue, index) => (
            <tr key={index}>
              <td>{catalogue.title}</td>
              <td>{catalogue.composer}</td>
              <td>{catalogue.symbol}</td>
              <td>{catalogue.author}</td>
              <td>{catalogue.publicationYear}</td>
              <td><button onClick={() => handleEdit(catalogue.title)}>Edit</button></td>
              <td><button onClick={() => handleDelete(catalogue.title)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => { /* Implement add catalogue functionality */ }}>Add Catalogue</button>
    </div>
  );
}

export default Catalogues;

