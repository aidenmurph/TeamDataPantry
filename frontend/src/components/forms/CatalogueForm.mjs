// Import dependencies
import React from 'react';
import { SelectComposer } from './inputs/SelectComposer.mjs';
import { InputYear } from './inputs/InputYear.mjs';

function CatalogueForm({ 
  catalogueTitle, setCatalogueTitle,
  composerID, setComposerID,
  catalogueSymbol, setCatalogueSymbol,
  authorFirst, setAuthorFirst,
  authorLast, setAuthorLast,
  publicationYear, setPublicationYear,
  onSubmit }) 
{
  // Validate the input before calling the submission handler
  const handleSubmit = () => {
    // Validate required fields have been completed
    if (!catalogueTitle || 
        !composerID || composerID === 'SELECT' ||
        !catalogueSymbol ||
        !authorFirst || 
        !authorLast || 
        !publicationYear) {
      alert("All fields must be completed before submission.");
      return;
    }

    // Submit the data to the handler
    onSubmit()
  }

  return (
    <>
      <table className="catalogueForm">
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
              <SelectComposer 
                id={"composer"}
                value={composerID}
                setValue={setComposerID}
              />
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
                className="add-input" 
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
              className="add-input" 
              placeholder="Last Name" 
              value={authorLast}
              onChange={e => setAuthorLast(e.target.value)} />
            </td>

            {/* Publication Year */}
            <td><label htmlFor="publicationYear">Publication Year: </label>
              <InputYear 
                id={"publicationYear"}
                value={publicationYear}
                setValue={setPublicationYear}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
              <button 
                name="submit-button" 
                type="button"
                onClick={handleSubmit}
                id="submit"
              >Submit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export { CatalogueForm }