import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SortButton } from '../SortButton.mjs';
import CatalogueRow from './CatalogueRow.mjs';

function CatalogueList({ catalogues, activeSortAttribute, onSort, onDelete, onEdit }) {
  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  return (
    <table id="catalogues" className="catalogues">
      <thead>
        <tr>
          <th>Catalogue Title <SortButton attribute={"catalogueTitle"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Composer <SortButton attribute={"composerLast"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Symbol <SortButton attribute={"catalogueSymbol"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Author <SortButton attribute={"authorLast"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Publication Year <SortButton attribute={"publicationYear"} activeSort={activeSortAttribute} onSort={onSort}/></th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {catalogues.map((catalogue, i) => 
          <CatalogueRow 
              key={i}
              catalogue={catalogue} 
              onDelete={onDelete}
              onEdit={onEdit} 
          />)}
        <tr>
        <td colSpan="7" style={{ textAlign: "center" }}>
            <button
                className="buttonGeneral addButton"
                type="addCatalogue"
                onClick={() => redirect("/add-catalogue")}
                id="addCatalogue"
              >Add New Catalogue
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CatalogueList;