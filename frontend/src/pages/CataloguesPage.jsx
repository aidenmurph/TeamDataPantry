import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CatalogueList from '../components/display/CatalogueList.mjs';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'
import { sortList } from '../modules/utilities.mjs';

function CataloguesPage({ setCatalogueToEdit }) {

  // Define state variables for displaying catalogues
  const [catalogues, setCatalogues] = useState([]);
  const [activeSort, setActiveSort] = useState({});
  
  // Track the length of the catalogues array to maintain sort after updates
  const cataloguesLengthRef = useRef(catalogues.length)

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // RETRIEVE the entire list of catalogues
  const loadCatalogues = useCallback(() => {
    fetchers.fetchCatalogues(setCatalogues);
  }, []);

  // LOAD all the catalogues upon first render
  useEffect(() => {
    loadCatalogues();
  }, [loadCatalogues]);

  // UPDATE a single catalogue
  const handleEditCatalogue = async (catalogue) => {
    setCatalogueToEdit(catalogue);
    redirect('/edit-catalogue');
  }

  // DELETE a single catalogue
  const handleDeleteCatalogue = async (id) => {
    const response = await fetch(`${server_url}/api/catalogues/${id}`, { method: 'DELETE'});
    if (response.ok) {
      loadCatalogues();
    } else {
        console.error(`Unable to delete Catalogue with ID ${id}, status code = ${response.status}`)
    }
  }

  // Update the active sort and sort the catalogues
  const handleSortCatalogue = (attribute, ascending) => {
    if (catalogues.length > 0) {
      setActiveSort({
        attribute: attribute,
        ascending: ascending
      })
      setCatalogues(sortList(catalogues, attribute, ascending))
    }
  }

  // Maintain the active sort when the catalogue list is modified (i.e. through deletion)
  useEffect(() => {
    if(cataloguesLengthRef.current !== catalogues.length) {
      if (activeSort.attribute && catalogues.length > 0) {
        setCatalogues(sortList(catalogues, activeSort.attribute, activeSort.ascending));
      }
      cataloguesLengthRef.current = catalogues.length;
    }
  }, [catalogues, activeSort]);

  return (
    <>
      <h2>Catalogues</h2>
      <p>See a live list of the catalogues in our database. Click the add button below to add a new catalogue to the collection. Click the edit button to the right of a single catalogue to modify that entry. Click the delete button to remove that entry.</p>
      <CatalogueList 
          catalogues={catalogues}
          activeSortAttribute={activeSort.attribute}
          onSort={handleSortCatalogue} 
          onEdit={handleEditCatalogue} 
          onDelete={handleDeleteCatalogue} 
      />
    </>
  );
}

export default CataloguesPage;