import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortButton } from '../SortButton.mjs';
import CompositionRow from './CompositionRow.mjs';

function CompositionList({ compositions, showNums, activeSortAttribute, onSort, onDelete, onEdit }) {
  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  return (
    <table id="compositions" className="compositions">
      <thead>
        <tr>
          <th>Title <SortButton attribute={"title"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          {showNums === true ?
            <>
              <th>Opus</th>
              <th>Cat.</th> 
            </>: ''}
          <th>Composer <SortButton attribute={"composerLast"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Form <SortButton attribute={"form"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Key Signature  <SortButton attribute={"keySignature"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Instrumentation  <SortButton attribute={"instrumentation"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Year <SortButton attribute={"compositionYear"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {compositions.map((composition, i) => 
          <CompositionRow
            key={i} 
            composition={composition} 
            showNums={showNums}
            onDelete={onDelete}
            onEdit={onEdit} 
          />)}
        <tr>
          <td colSpan="10" style={{ textAlign: "center" }}>
            <button
              className="buttonGeneral addButton"
              type="button"
              onClick={() => redirect("/add-composition")}
              id="addComposition"
            >Add New Composition</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CompositionList;