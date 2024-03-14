// Import dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { CatalogueForm } from '../components/forms/CatalogueForm.mjs';

export const AddCataloguePage = () => {
  // State variables
  const [catalogueTitle, setCatalogueTitle] = useState('');
  const [composerID, setComposerID] = useState('SELECT');
  const [catalogueSymbol, setCatalogueSymbol] = useState('');
  const [authorFirst, setAuthorFirst] = useState('');
  const [authorLast, setAuthorLast] = useState('');
  const [publicationYear, setPublicationYear] = useState('');

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // INSERT the catalogue into the database
  const addCatalogue = async () => {
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
    redirect("/catalogues");
  };

  return (
    <>
      <article>
        <h2>Add a Catalogue</h2>
        <p>Fill out the fields below to add a catalogue to the database.</p>
        <CatalogueForm
          catalogueTitle={catalogueTitle} setCatalogueTitle={setCatalogueTitle}
          composerID={composerID} setComposerID={setComposerID}
          catalogueSymbol={catalogueSymbol} setCatalogueSymbol={setCatalogueSymbol}
          authorFirst={authorFirst} setAuthorFirst={setAuthorFirst}
          authorLast={authorLast} setAuthorLast={setAuthorLast}
          publicationYear={publicationYear} setPublicationYear={setPublicationYear}
          onSubmit={addCatalogue}
        />
      </article>
    </>
  )
}

export default AddCataloguePage;