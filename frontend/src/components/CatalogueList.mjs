import React from 'react';
import CatalogueRow from './CatalogueRow.mjs';

function CatalogueList({ catalogues, onDelete, onEdit }) {
  return (
    <table id="catalogues" className="catalogues">
      <thead>
        <tr>
          <th>Catalogue Title</th>
          <th>Composer</th>
          <th>Symbol</th>
          <th>Author</th>
          <th>Publication Year</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {catalogues.map((catalogue, i) => 
          <CatalogueRow 
              catalogue={catalogue} 
              key={i}
              onDelete={onDelete}
              onEdit={onEdit} 
          />)}
      </tbody>
    </table>
  );
}

export default CatalogueList;