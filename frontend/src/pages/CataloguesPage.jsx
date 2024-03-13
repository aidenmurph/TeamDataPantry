import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CatalogueList from '../components/display/CatalogueList.mjs';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'

function CataloguesPage({ setCatalogueToEdit }) {
  
  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // Define state variable for displaying catalogues
  const [catalogues, setCatalogues] = useState([]);

  // RETRIEVE the entire list of catalogues
  const loadCatalogues = useCallback(() => {
    fetchers.fetchCatalogues(setCatalogues);
  }, []);

  // UPDATE a single catalogue
  const onEditCatalogue = async (catalogue) => {
    setCatalogueToEdit(catalogue);
    redirect('/edit-catalogue');
  }

  // DELETE a single catalogue
  const onDeleteCatalogue = async (id) => {
    const response = await fetch(`${server_url}/api/catalogues/${id}`, { method: 'DELETE'});
    if (response.ok) {
      loadCatalogues();
    } else {
        console.error(`Unable to delete Catalogue with ID ${id}, status code = ${response.status}`)
    }
  }

  // LOAD all the catalogues
  useEffect(() => {
    loadCatalogues();
  }, [loadCatalogues]);

  return (
    <>
      <h2>Catalogues</h2>
      <p>See a live list of the catalogues in our database. Click the add button below to add a new catalogue to the collection. Click the edit button to the right of a single catalogue to modify that entry. Click the delete button to remove that entry.</p>
      <CatalogueList 
          catalogues={catalogues} 
          onEdit={onEditCatalogue} 
          onDelete={onDeleteCatalogue} 
      />
      <button
          className="buttonGeneral addButton"
          type="addCatalogue"
          onClick={() => redirect("/add-catalogue")}
          id="addCatalogue"
          >Add New Catalogue</button>
    </>
  );
}

export default CataloguesPage;