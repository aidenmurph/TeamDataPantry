import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortButton } from '../SortButton.mjs';
import ComposerRow from './ComposerRow.mjs';

function ComposerList({ composers, activeSortAttribute, onSort, onDelete, onEdit }) {
  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  return (
    <table id="composers" className="composers">
      <thead>
        <tr>
          <th>Name <SortButton attribute={"lastName"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Birth Date <SortButton attribute={"birthDate"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Death Date <SortButton attribute={"deathDate"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {composers.map((composer, i) => 
          <ComposerRow 
            key={i}
            composer={composer} 
            onDelete={onDelete}
            onEdit={onEdit} 
          />)}
        <tr>
          <td colSpan={5} style={{ textAlign: "center" }}>
          <button
              className="buttonGeneral addButton"
              type="button"
              onClick={() => redirect("/add-composer")}
              id="addComposer"
            >Add New Composer
          </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ComposerList;