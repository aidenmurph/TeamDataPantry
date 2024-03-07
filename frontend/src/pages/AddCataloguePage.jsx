import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';

export const AddCataloguePage = () => {
  // State variables
  const [catalogueTitle, setCatalogueTitle] = useState('');
  const [composerID, setComposerID] = useState('');
  const [catalogueSymbol, setCatalogueSymbol] = useState('');
  const [authorFirst, setAuthorFirst] = useState('');
  const [authorLast, setAuthorLast] = useState('');
  const [publicationYear, setPublicationYear] = useState('');

  // Options for selecting the composer
  const [composerOptions, setComposerOptions] = useState([]);

  const redirect = useNavigate();

  const addCatalogue = async () => {
    // Validate inputs
    if (!catalogueTitle || 
      !composerID || composerID === '0' ||
      !catalogueSymbol || 
      !authorFirst || 
      !authorLast || 
      !publicationYear) {
      alert("All fields must be completed before submission.");
      return;
    }

    const newCatalogue = {
      catalogueTitle,
      composerID,
      catalogueSymbol,
      authorFirst,
      authorLast,
      publicationYear
    }
    const response = await fetch(`${server_url}/api/catalogues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCatalogue),
    });
    if(response.ok){
      console.log(`"${catalogueTitle}" was successfully added!`);
  } else {
      console.log(`Unable to add catalogue. Request returned status code ${response.status}`);
  }
  redirect("/Catalogues");
  };

  useEffect(() => {
    fetch(`${server_url}/api/composers`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setComposerOptions(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Get current date for input limits
  const currentDate = new Date();

  return (
    <>
      <article>
        <h2>Add a Catalogue</h2>
        <p>Fill out the fields below to add a catalogue to the database.</p>
          <table className="table">
            <tbody>
              <tr>      
                {/* Title */}
                <td><label htmlFor="title">Title: </label>
                <input 
                  type="text" 
                  name="title" 
                  id="title" 
                  className="add-input" 
                  size="50" 
                  placeholder="Title" 
                  onChange={e => setCatalogueTitle(e.target.value)} />
                </td>
                
                {/* Composer */}
                <td><label htmlFor="composer">Composer: </label>
                  <select 
                    name="composer" 
                    id="composer" 
                    className="add-input"
                    onChange={e => setComposerID(e.target.value)} >
                      {/* Query the composers in the database in order to populate the list */}
                      <option value="0" selected>--Select Composer--</option>
                      {composerOptions.map((option, i) => (
                        <option key={i} value={option.composerID}>{option.firstName} {option.lastName}</option>
                      ))}
                  </select>
                </td>

                {/* Symbol */}
                <td><label htmlFor="symbol">Symbol: </label>
                <input 
                  type="text" 
                  name="symbol" 
                  id="symbol" 
                  className="add-input" 
                  size="5" 
                  placeholder="Symbol" 
                  onChange={e => setCatalogueSymbol(e.target.value)} />
                </td>

                {/* Author First Name */}
                <td><label htmlFor="author-first">Author First Name: </label>
                  <input 
                    type="text" 
                    name="author-first" 
                    id="author-first" 
                    class="add-input" 
                    placeholder="First Name" 
                    onChange={e => setAuthorFirst(e.target.value)} />
                </td>

                {/* Author Last Name */}
                <td><label htmlFor="author-last">Author Last Name: </label>
                <input 
                  type="text" 
                  name="author-last" 
                  id="author-last" 
                  class="add-input" 
                  placeholder="Last Name" 
                  onChange={e => setAuthorLast(e.target.value)} />
                </td>

                {/* Publication Year */}
                <td><label htmlFor="publication-year">Publication Year: </label>
                  <input
                    type="number"
                    size="7"
                    min="0"
                    max={currentDate.getFullYear()}
                    placeholder="i.e. 1999"
                    onChange={e => setPublicationYear(e.target.value)} 
                    id="publication-year" /></td>
              </tr>
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                <button 
                  name="submit-button" 
                  type="submit"
                  onClick={addCatalogue}
                  id="submit"
                >Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </>
  )
}

export default AddCataloguePage;