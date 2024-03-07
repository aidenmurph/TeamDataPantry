import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';

export const EditCataloguePage = ({ catalogueToEdit }) => {
  // State variables
  const [catalogueTitle, setCatalogueTitle] = useState(catalogueToEdit.catalogueTitle);
  const [composerID, setComposerID] = useState(catalogueToEdit.composerID);
  const [catalogueSymbol, setCatalogueSymbol] = useState(catalogueToEdit.catalogueSymbol);
  const [authorFirst, setAuthorFirst] = useState(catalogueToEdit.authorFirst);
  const [authorLast, setAuthorLast] = useState(catalogueToEdit.authorLast);
  const [publicationYear, setPublicationYear] = useState(catalogueToEdit.publicationYear);

  // Options for selecting the composer
  const [composerOptions, setComposerOptions] = useState([]);

  const redirect = useNavigate();

  const editCatalogue = async () => {
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

  const response = await fetch(`${server_url}/api/catalogues/${catalogueToEdit.catalogueID}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      catalogueTitle: catalogueTitle,
      composerID: composerID,
      catalogueSymbol: catalogueSymbol,
      authorFirst: authorFirst,
      authorLast: authorLast,
      publicationYear: publicationYear
    }),
    headers: {'Content-Type': 'application/json',},
  });
    if(response.ok) {
      console.log(`${catalogueTitle} has been successfully updated!`);
    } else {
      console.error(`Unable to complete edit. Request returned status code ${response.status}`);
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

  // Local variables
  const currentDate = new Date();
  const catalogueToEditTitle = catalogueToEdit.catalogueTitle;

  return (
    <>
      <article>
        <h2>Edit {catalogueToEditTitle}</h2>
        <p>Here you can make changes to the catalogue "{catalogueToEditTitle}". Once you're done, click the "Commit" button to save your changes!</p>
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
                  value={catalogueTitle}
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
                      <option value="0">--Select Composer--</option>
                      {composerOptions.map((option, i) => (
                        <option key={i} 
                                value={option.composerID}
                                selected={option.composerID === composerID ? "selected" : undefined}
                          >{option.firstName} {option.lastName}</option>
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
                  value={catalogueSymbol} 
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
                    value={authorFirst}
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
                  value={authorLast}
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
                    value={publicationYear}
                    onChange={e => setPublicationYear(e.target.value)} 
                    id="publication-year" /></td>
              </tr>
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                <button 
                  name="submit-button" 
                  type="submit"
                  onClick={editCatalogue}
                  id="submit"
                >Commit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </>
  )
}

export default EditCataloguePage;