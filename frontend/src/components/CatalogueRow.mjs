import React from 'react';

function CatalogueRow({ catalogue, onEdit, onDelete }) {
  return (
    <tr className="catalogue">
      <td>{catalogue.catalogueTitle}</td>
      <td>{catalogue.composer}</td>
      <td>{catalogue.catalogueSymbol}</td>
      <td>{catalogue.authorFirst} {catalogue.authorLast}</td>
      <td>{catalogue.publicationYear}</td>
      <td><button onClick={() => onEdit(catalogue)}>Edit</button></td>
      <td><button onClick={() => onDelete(catalogue.catalogueID)}>Delete</button></td>
    </tr>
  );
}

export default CatalogueRow;