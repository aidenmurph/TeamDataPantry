import React from 'react';

function CompositionRow({ composition, onEdit, onDelete }) {
  return (
    <tr className="composition">
      <td>{composition.titleEnglish}</td>
      <td>{composition.opusNum ? `Op. ${composition.opusNum}` : ''}</td>
      <td>{composition.catalogueNum}</td>
      <td>{composition.composer}</td>
      <td>{composition.form}</td>
      <td>{composition.keySignature}</td>
      <td>{composition.instrumentation}</td>
      <td>{composition.compositionYear}</td>
      <td><button onClick={() => onEdit(composition)}>Edit</button></td>
      <td><button onClick={() => onDelete(composition.compositionID)}>Delete</button></td>
    </tr>
  );
}

export default CompositionRow;