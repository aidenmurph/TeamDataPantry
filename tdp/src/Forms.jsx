import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Forms() {
  const [forms, setForms] = useState([
    'Ballade', 'Ballet', 'Cantata', 'Concerto', 'Dance', 'Elegy', 'Fantasia',
    'Fugue', 'Intermezzo', 'Minuet', 'Moderato', 'Nocturne', 'Opera', 'Overture',
    'Pavane', 'Prelude', 'Quartet', 'Requiem', 'Rhapsody', 'Sonata', 'Suite',
    'Symphonic Poem', 'Symphony', 'Trio', 'Variations'
  ]);

  const [newFormName, setNewFormName] = useState('');

  const handleEdit = (formName) => {
    // Implement edit functionality
  };

  const handleDelete = (formName) => {
    setForms(forms.filter(form => form !== formName));
  };

  const handleAdd = () => {
    if (newFormName && !forms.includes(newFormName)) {
      setForms([...forms, newFormName]);
      setNewFormName('');
    }
  };

  const handleReset = () => {
    setNewFormName('');
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
            <th>Form Names</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form, index) => (
            <tr key={index}>
              <td>{form}</td>
              <td><button onClick={() => handleEdit(form)}>Edit</button></td>
              <td><button onClick={() => handleDelete(form)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input 
          type="text" 
          value={newFormName} 
          onChange={(e) => setNewFormName(e.target.value)} 
          placeholder="Form Name" 
        />
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default Forms;

