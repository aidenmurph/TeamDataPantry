import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { CatalogueForm } from '../components/forms/CatalogueForm.mjs';

export const EditCataloguePage = ({ catalogueToEdit }) => {
  // State variables
  const [catalogueTitle, setCatalogueTitle] = useState(catalogueToEdit.catalogueTitle);
  const [composerID, setComposerID] = useState(catalogueToEdit.composerID);
  const [catalogueSymbol, setCatalogueSymbol] = useState(catalogueToEdit.catalogueSymbol);
  const [authorFirst, setAuthorFirst] = useState(catalogueToEdit.authorFirst);
  const [authorLast, setAuthorLast] = useState(catalogueToEdit.authorLast);
  const [publicationYear, setPublicationYear] = useState(catalogueToEdit.publicationYear);

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // UPDATE the catalogue in the database with the modified data
  const editCatalogue = async () => { 
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
    redirect("/catalogues");
  };

  // Local Variables
  const catalogueToEditTitle = catalogueToEdit.catalogueTitle;

  return (
    <>
      <article>
        <h2>Edit "{catalogueToEditTitle}"</h2>
        <p>Here you can make changes to the catalogue "{catalogueToEditTitle}". Once you're done, click the "Submit" button to save your changes.</p>
        <CatalogueForm
          catalogueTitle={catalogueTitle} setCatalogueTitle={setCatalogueTitle}
          composerID={composerID} setComposerID={setComposerID}
          catalogueSymbol={catalogueSymbol} setCatalogueSymbol={setCatalogueSymbol}
          authorFirst={authorFirst} setAuthorFirst={setAuthorFirst}
          authorLast={authorLast} setAuthorLast={setAuthorLast}
          publicationYear={publicationYear} setPublicationYear={setPublicationYear}
          onSubmit={editCatalogue}
        />
      </article>
    </>
  )
}

export default EditCataloguePage;