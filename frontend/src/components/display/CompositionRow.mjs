import React from 'react';
import { Link } from 'react-router-dom';
import { convertFlatSharp } from '../../modules/utilities.mjs';

function CompositionRow({ composition, showNums, onEdit, onDelete }) {
  return (
    <tr className="composition">
      <td><Link to={`/composition/${composition.compositionID}`}>{convertFlatSharp(composition.title)}</Link></td>
      {showNums === true ?
        <>
          <td>{composition.opusNums ? `Op. ${composition.opusNums.join(', ')}` : ''}</td>
          <td>{composition.catalogueNums.map(catalogueNum => {
            return `${catalogueNum.symbol} ${catalogueNum.num}`;
          }).join(', ')}</td>
        </>: ''}
      <td>{composition.composerFirst} {composition.composerLast}</td>
      <td>{composition.form}</td>
      <td>{convertFlatSharp(composition.keySignature)}</td>
      <td>{composition.featuredInstrumentation ? 
        composition.featuredInstrumentation.map(instrument => instrument.name).join(', ')
        : ''}</td>
      <td>{composition.compositionYear}</td>
      <td><button onClick={() => onEdit(composition.compositionID)}>Edit</button></td>
      <td><button onClick={() => onDelete(composition.compositionID)}>Delete</button></td>
    </tr>
  );
}

export default CompositionRow;