import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'
import CompositionList from '../components/display/CompositionList.mjs';
import { sortList } from '../modules/utilities.mjs';
import FilterCompositionSelector from '../components/display/FilterCompositionsSelector.mjs';

function CompositionsPage({ setCompositionToEdit }) {
  
  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // Define state variables for displaying compositions
  const [compositions, setCompositions] = useState([]);
  const [activeSort, setActiveSort] = useState({});
  const [filterList, setFilterList] = useState([]); 
  
  // RETRIEVE the entire list of compositions
  const loadCompositions = useCallback(() => {
    fetchers.fetchCompositions(setCompositions);
  }, []);

  // RETRIEVE list of compositions based on the current filter criteria
  useEffect(() => {
    if (Object.keys(filterList).length === 0) {
      loadCompositions();
      return;
    }
    fetchers.fetchFilteredCompositions(setCompositions, filterList);
  }, [loadCompositions, filterList]);

  // UPDATE a single composition
  const handleEditComposition = async (composition) => {;
    setCompositionToEdit(composition);
    redirect(`/edit-composition/`);
  }

  // DELETE a single composition
  const handleDeleteComposition = async (id) => {
    const response = await fetch(`${server_url}/api/compositions/${id}`, { method: 'DELETE'});
    if (response.ok) {
      loadCompositions();
    } else {
        console.error(`Unable to delete Composition with ID ${id}, status code = ${response.status}`)
    }
  }

  // Update the active sort and sort the compositions
  const handleSortCompositions = (attribute, ascending) => {
    if (compositions.length > 0) {
      setActiveSort({
        attribute: attribute,
        ascending: ascending
      })
      setCompositions(sortList(compositions, attribute, ascending))
    }
  }

  // Maintain the active sort when the composition list is modified (i.e. through deletion)
  useEffect(() => {
    if (activeSort.attribute && compositions.length > 0) {
      setCompositions(sortList(compositions, activeSort.attribute, activeSort.ascending));
    }
  }, [compositions.length]);

  return (
    <>
      <h2>Compositions</h2>
      <p>See below a live list of the compositions in our database. To sort compositions, click the sort button to the right of a field to sort by that category. Composer names are sorted by last name.</p>
      <p>To filter the list of compositions, use the interface below. Select one or more items and click filter to see a narrowed list of compositions:</p>
      <FilterCompositionSelector
        setFilterList={setFilterList}
      />
      <p>Click the add button to add a new composition to the collection. Click the edit button to the right of a single composition to modify that entry. Click the delete button to remove that entry.</p>
      <CompositionList 
        compositions={compositions} 
        showNums={false}
        activeSortAttribute={activeSort.attribute}
        onSort={handleSortCompositions}
        onEdit={handleEditComposition} 
        onDelete={handleDeleteComposition} 
      />
    </>
  );
}

export default CompositionsPage;