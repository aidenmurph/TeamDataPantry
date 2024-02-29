import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Composers() {
  const [composers, setComposers] = useState([]);

  // Fetch composers from the database on component mount
  useEffect(() => {
    fetchComposers();
  }, []);

  const fetchComposers = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/composers');
      if (!response.ok) throw new Error(`Data could not be fetched! Status: ${response.status}`);
      const data = await response.json();
      setComposers(data);
    } catch (error) {
      console.error('Error fetching composers:', error);
    }
  };


  const handleEdit = async (composerId) => {
    // Implement edit functionality
    // This might involve showing a form to edit a composer and then sending a PUT request to your API
  };

  const handleDelete = async (composerId) => {
    try {
      const response = await fetch(`/api/composers/${composerId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete composer');
      fetchComposers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting composer:', error);
    }
  };

  // Placeholder for adding a composer
  const handleAdd = () => {
    // Show a form to add a new composer and then POST it to your API
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
            <th>Name</th>
            <th>Birth Date</th>
            <th>Death Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {composers.map((composer) => (
            <tr key={composer.composerID}>
              <td>{composer.name}</td>
              <td>{composer.birthDate}</td>
              <td>{composer.deathDate}</td>
              <td><button onClick={() => handleEdit(composer.composerID)}>Edit</button></td>
              <td><button onClick={() => handleDelete(composer.composerID)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAdd}>Add Composer</button>
    </div>
  );
}

export default Composers;

