import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Compositions() {
  const initialCompositions = [
    {
      title: 'Scheherazade',
      opus: 'Op.35',
      cat: '',
      composer: 'Nikolai Rimsky-Korsakov',
      form: 'Suite',
      keySignature: '',
      instrumentation: 'Orchestra',
      year: '1888'
    },
    {
      title: 'Concerto for the Left Hand',
      opus: 'M.82',
      cat: '',
      composer: 'Maurice Ravel',
      form: 'Concerto',
      keySignature: 'D major',
      instrumentation: 'Piano, Orchestra',
      year: '1930'
    },
    {
      title: 'String Quartet in F Major',
      opus: 'M.35',
      cat: '',
      composer: 'Maurice Ravel',
      form: 'Quartet',
      keySignature: 'F major',
      instrumentation: 'String Quartet',
      year: '1903'
    },
    {
      title: 'String Quartet in E Minor',
      opus: 'Op.121',
      cat: '',
      composer: 'Gabriel Fauré',
      form: 'Quartet',
      keySignature: 'E minor',
      instrumentation: 'String Quartet',
      year: '1924'
    },
    {
      title: 'String Quartet in G Minor',
      opus: 'Op.10',
      cat: 'L.91',
      composer: 'Claude Debussy',
      form: 'Quartet',
      keySignature: 'G minor',
      instrumentation: 'String Quartet',
      year: '1893'
    },
    {
      title: 'Piano Concerto in G major',
      opus: 'M.83',
      cat: '',
      composer: 'Maurice Ravel',
      form: 'Concerto',
      keySignature: 'G major',
      instrumentation: 'Piano, Orchestra',
      year: '1931'
    },
    {
      title: 'Ballade in F-sharp Major',
      opus: 'Op.19',
      cat: '',
      composer: 'Gabriel Fauré',
      form: 'Ballade',
      keySignature: 'F-sharp major',
      instrumentation: 'Piano',
      year: '1879'
    }
  ];

  const [compositions, setCompositions] = useState(initialCompositions);
  const [filter, setFilter] = useState('');

  const filteredCompositions = compositions.filter(comp => 
    filter === '' || comp.composer.includes(filter)
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleEdit = (composition) => {
    // Logic to handle edit
  };

  const handleDelete = (composition) => {
    setCompositions(compositions.filter(c => c !== composition));
  };

  const handleAdd = () => {
    // Logic to handle add
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
      <div>
        <label htmlFor="composerFilter">Filter by Composer:</label>
        <select id="composerFilter" onChange={handleFilterChange}>
          <option value="">--Choose Composer--</option>
          {/* Map through composers for filter options */}
        </select>
        <button onClick={() => setFilter('')}>Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Opus</th>
            <th>Cat.</th>
            <th>Composer</th>
            <th>Form</th>
            <th>Key Signature</th>
            <th>Instrumentation</th>
            <th>Year</th>
            <th>Edit</th>
            <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {filteredCompositions.map((composition, index) => (
            <tr key={index}>
            <td>{composition.title}</td>
            <td>{composition.opus}</td>
            <td>{composition.cat}</td>
            <td>{composition.composer}</td>
            <td>{composition.form}</td>
            <td>{composition.keySignature}</td>
            <td>{composition.instrumentation}</td>
            <td>{composition.year}</td>
            <td><button onClick={() => handleEdit(composition)}>Edit</button></td>
            <td><button onClick={() => handleDelete(composition)}>Delete</button></td>
            </tr>
            ))}
            </tbody>
            </table>
            <button onClick={handleAdd}>Add Composition</button>
            </div>
            );
  }

export default Compositions;

