import React, { useEffect, useState, useCallback } from 'react';
import FormList from '../components/display/FormList.mjs';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'
import { sortList } from '../modules/utilities.mjs';

function FormsPage() {

  // Define state variable for displaying forms
  const [forms, setForms] = useState([]);
  const [activeSort, setActiveSort] = useState({
    attribute: "formName",
    ascending: true});

  // RETRIEVE the entire list of forms
  const loadForms = useCallback(() => {
    fetchers.fetchForms(setForms);
  }, []);

  // LOAD all the forms
  useEffect(() => {
    loadForms();
  }, [loadForms]);

  
  // DELETE a single form
  const handleDeleteForm = async (id) => {
    const response = await fetch(`${server_url}/api/forms/${id}`, { method: 'DELETE'});
    if (response.ok) {
      loadForms();
    } else {
        console.error(`Unable to delete Form with ID ${id}, status code = ${response.status}`)
    }
  }

  // Update the active sort and sort the forms
  const handleSortForms = (attribute, ascending) => {
    if (forms.length > 0) {
      setActiveSort({
        attribute: attribute,
        ascending: ascending
      })
      setForms(sortList(forms, attribute, ascending))
    }
  }
 
  // Maintain the active sort when the form list is modified (i.e. through deletion)
  useEffect(() => {
    if (activeSort.attribute && forms.length > 0) {
      setForms(sortList(forms, activeSort.attribute, activeSort.ascending));
    }
  }, [forms.length]);

  return (
    <>
    <h2>Forms</h2>
    <p>See below a live list of the forms in our database. Click the add button below to add a new form to the collection. Click the edit button to the right of a single form to modify that entry. Click the delete button to remove that entry.</p>
    <FormList 
        forms={forms}
        onSort={handleSortForms} 
        activeSortAttribute={activeSort.attribute}
        onEdit={loadForms} 
        onDelete={handleDeleteForm}
        onAdd={loadForms} 
    />
    </>
  );
}

export default FormsPage;

