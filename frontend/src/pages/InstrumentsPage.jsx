import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Instruments() {
  const [instruments, setInstruments] = useState([
    'Accordion', 'Alto', 'Alto Flute', 'Alto Saxophone', 'Alto Trombone', 
    'Baritone Saxophone', 'Bass', 'Bass Clarinet', 'Bass Flute', 'Bass Saxophone', 
    'Bass Trombone', 'Bass Trumpet', 'Bassoon', 'Celesta', 'Chorus', 'Cimbasso', 
    'Clarinet', 'Concert Flute', 'Contrabass Clarinet', 'Contrabass Saxophone', 
    'Contrabass Trombone', 'Contrabassoon', 'Double Bass', 'English Horn', 'Flugelhorn', 
    'French Horn', 'Guitar', 'Harp', 'Harpsichord', 'Oboe', 'Orchestra', 'Piano', 
    'Piano Trio', 'Piccolo', 'Piccolo Trumpet', 'Soprano', 'Soprano Saxophone', 
    'String Quartet', 'Tenor', 'Tenor Saxophone', 'Tenor Trombone', 'Timpani', 
    'Trumpet', 'Tuba', 'Viola', 'Violin', 'Violoncello', 'Wagner Tuba', 'Wind Band'
  ]);

  // Handler functions for edit and delete operations
  const handleEdit = (instrumentName) => {
    // Implement edit functionality
  };

  const handleDelete = (instrumentName) => {
    setInstruments(instruments.filter(instrument => instrument !== instrumentName));
  };

  const handleAdd = (newInstrumentName) => {
    if (newInstrumentName && !instruments.includes(newInstrumentName)) {
      setInstruments([...instruments, newInstrumentName]);
    }
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
            <th>Instrument Names</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((instrument, index) => (
            <tr key={index}>
              <td>{instrument}</td>
              <td><button onClick={() => handleEdit(instrument)}>Edit</button></td>
              <td><button onClick={() => handleDelete(instrument)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input type="text" placeholder="Instrument Name" />
        <button onClick={() => handleAdd()}>Add</button>
        <button>Reset</button>
      </div>
    </div>
  );
}

export default Instruments;

