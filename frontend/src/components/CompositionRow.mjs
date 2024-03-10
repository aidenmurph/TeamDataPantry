import React from 'react';
import { Link } from 'react-router-dom';

function CompositionRow({ composition, onEdit, onDelete }) {
  return (
    <tr className="composition">
      <td><Link to={`/composition/${composition.compositionID}`}>{composition.titleEnglish}</Link></td>
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