import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Composers() {
  const composers = [
    { name: 'Maurice Ravel', birthDate: 'March 7, 1875', deathDate: 'December 28, 1937' },
    { name: 'Nikolai Rimsky-Korsakov', birthDate: 'March 18, 1844', deathDate: 'June 21, 1908' },
    { name: 'Gabriel Fauré', birthDate: 'May 12, 1845', deathDate: 'November 4, 1924' },
    { name: 'Claude Debussy', birthDate: 'August 22, 1862', deathDate: 'March 25, 1918' },
    { name: 'Antonín Dvořák', birthDate: 'September 8, 1841', deathDate: 'May 1, 1904' }
  ];

  // Handlers for Edit and Delete actions - to be implemented
  const handleEdit = (composerName) => {
    // Implement edit functionality
  };

  const handleDelete = (composerName) => {
    // Implement delete functionality
  };

  return (
    <div>
      <h1>Classical Composition and Recording Exploration</h1>
      <nav>
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
            <th>Name</th>
            <th>Birth Date</th>
            <th>Death Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {composers.map((composer, index) => (
            <tr key={index}>
              <td>{composer.name}</td>
              <td>{composer.birthDate}</td>
              <td>{composer.deathDate}</td>
              <td><button onClick={() => handleEdit(composer.name)}>Edit</button></td>
              <td><button onClick={() => handleDelete(composer.name)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Add Composer</button>
    </div>
  );
}

export default Composers;

