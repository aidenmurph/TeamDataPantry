import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ComposerList from '../components/display/ComposerList.mjs';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'
import { sortList } from '../modules/utilities.mjs';

function ComposersPage({ setComposerToEdit }) {

  // Define state variables for displaying composers
  const [composers, setComposers] = useState([]);
  const [activeSort, setActiveSort] = useState({});

  // Track the length of the composers array to maintain sort after updates
  const composersLengthRef = useRef(composers.length)

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // RETRIEVE the entire list of composers
  const loadComposers = useCallback(() => {
    fetchers.fetchComposers(setComposers);
  }, []);

  // LOAD all the composers on page startup
  useEffect(() => {
    loadComposers();
  }, [loadComposers]);

  // UPDATE a single composer
  const handleEditComposer = async (composer) => {
    setComposerToEdit(composer);
    redirect('/edit-composer');
  }

  // DELETE a single composer
  const handleDeleteComposer = async (id) => {
    const response = await fetch(`${server_url}/api/composers/${id}`, { method: 'DELETE'});
    if (response.ok) {
      loadComposers();
    } else {
        console.error(`Unable to delete Composer with ID ${id}, status code = ${response.status}`)
    }
  }

  // Update the active sort and sort the composers
  const handleSortComposers = (attribute, ascending) => {
    if (composers.length > 0) {
      setActiveSort({
        attribute: attribute,
        ascending: ascending
      })
      setComposers(sortList(composers, attribute, ascending))
    }
  }
  
  // Maintain the active sort when the composer list is modified (i.e. through deletion)
  useEffect(() => {
      if (composersLengthRef.current !== composers.length) {
        if (activeSort.attribute && composers.length > 0) {
          setComposers(sortList(composers, activeSort.attribute, activeSort.ascending));
      }
      composersLengthRef.current = composers.length;
    }
  }, [composers, activeSort]);

  // DISPLAY the composers
  return (
    <>
      <h2>Composers</h2>
      <p>See a live list of the composers in our database. Click the add button below to add a new composer to the collection. Click the edit button to the right of a single composer to modify that entry. Click the delete button to remove that entry.</p>
      <ComposerList 
          composers={composers}
          onSort={handleSortComposers}
          activeSortAttribute={activeSort.attribute} 
          onEdit={handleEditComposer} 
          onDelete={handleDeleteComposer} 
      />
    </>
  );
}

export default ComposersPage;
