import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Composers() {
  const [composers, setComposers] = useState([]);
  const [newComposer, setNewComposer] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
  });

  useEffect(() => {
    fetchComposers();
  }, []);

 const fetchComposers = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/composers');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      setComposers(data.map(composer => ({
        ...composer,
        birthDate: formatDate(composer.birthDate),
        deathDate: composer.deathDate ? formatDate(composer.deathDate) : ''
      })));
    } catch (error) {
      console.error('Error fetching composers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComposer({ ...newComposer, [name]: value });
  };

  const handleAddComposer = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/composers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComposer),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNewComposer({ firstName: '', lastName: '', birthDate: '', deathDate: '' });
      fetchComposers();
    } catch (error) {
      console.error("Error adding composer: ", error);
    }
  };

  const handleEdit = (composerId) => {
    // Implement edit functionality
    console.log('Editing composer with ID:', composerId);
  };

  const handleDelete = async (composerId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/composers/${composerId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Optionally, filter out the deleted composer from the state without refetching from the server
        setComposers(composers.filter(composer => composer.composerID !== composerId));
      } else {
        console.error('Error deleting composer:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting composer:', error);
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <h1>Classical Composition and Recording Exploration</h1>
      <nav>
        <Link to="/">Home</Link> |
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
              <td>{composer.firstName} {composer.lastName}</td>
              <td>{composer.birthDate}</td>
              <td>{composer.deathDate}</td>
              {/* ... Edit and Delete buttons ... */}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <input type="text" name="firstName" value={newComposer.firstName} onChange={handleInputChange} placeholder="First Name" />
        <input type="text" name="lastName" value={newComposer.lastName} onChange={handleInputChange} placeholder="Last Name" />
        <input type="date" name="birthDate" value={newComposer.birthDate} onChange={handleInputChange} placeholder="Birth Date" />
        <input type="date" name="deathDate" value={newComposer.deathDate} onChange={handleInputChange} placeholder="Death Date (optional)" />
        <button onClick={handleAddComposer}>Add Composer</button>
      </div>
    </div>
  );
}

export default Composers;


