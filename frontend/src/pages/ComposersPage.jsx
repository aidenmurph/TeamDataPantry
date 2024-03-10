import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ComposerList from '../components/ComposerList.mjs';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'

function ComposersPage({ setComposerToEdit }) {

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // Define state variable for displaying composers
  const [composers, setComposers] = useState([]);

  // RETRIEVE the entire list of composers
  const loadComposers = useCallback(() => {
    fetchers.fetchComposers(setComposers);
  }, []);

  // UPDATE a single composer
  const onEditComposer = async composer => {
    setComposerToEdit(composer);
    redirect('/edit-composer');
  }

  // DELETE a single composer
  const onDeleteComposer = async id => {
    const response = await fetch(`${server_url}/api/composers/${id}`, { method: 'DELETE'});
    if (response.ok) {
      loadComposers();
    } else {
        console.error(`Unable to delete Composer with ID ${id}, status code = ${response.status}`)
    }
  }

  // LOAD all the composers
  useEffect(() => {
    loadComposers();
  }, [loadComposers]);

  // DISPLAY the composers
  return (
    <>
      <h2>Composers</h2>
      <p>See a live list of the composers in our database. Click the add button below to add a new composer to the collection. Click the edit button to the right of a single composer to modify that entry. Click the delete button to remove that entry.</p>
      <ComposerList 
          composers={composers} 
          onEdit={onEditComposer} 
          onDelete={onDeleteComposer} 
      />
      <button
          className="buttonGeneral addButton"
          type="addComposer"
          onClick={() => redirect("/add-composer")}
          id="addComposer"
          >Add New Composer</button>
    </>
  );
}

export default ComposersPage;
