import React, { useEffect, useState, useCallback } from 'react';
import FormList from '../components/FormList.mjs';
import { server_url } from '../config';

function FormsPage() {

  // Define state variable for displaying forms
  const [forms, setForms] = useState([]);

  // RETRIEVE the entire list of forms
  const loadForms = useCallback(async () => {
    try {
      const response = await fetch(`${server_url}/api/forms`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const forms = await response.json();
      setForms(forms);
    } 
    catch (error) {
      console.error('Error fetching forms:', error);
    }
  }, [] );
  
    // DELETE a single form
    const onDeleteForm = async id => {
      const response = await fetch(`${server_url}/api/forms/${id}`, { method: 'DELETE'});
      if (response.ok) {
        loadForms();
      } else {
          console.error(`Unable to delete Form with ID ${id}, status code = ${response.status}`)
      }
    }
  
    // LOAD all the forms
    useEffect(() => {
      loadForms();
    }, [loadForms]);

  return (
    <>
    <h2>Forms</h2>
    <p>See below a live list of the forms in our database. Click the add button below to add a new form to the collection. Click the edit button to the right of a single form to modify that entry. Click the delete button to remove that entry.</p>
    <FormList 
        forms={forms} 
        onEdit={loadForms} 
        onDelete={onDeleteForm}
        onAdd={loadForms} 
    />
    </>
  );
}

export default FormsPage;

