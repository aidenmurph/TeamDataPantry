import React from 'react';
import { convertFlatSharp } from '../../modules/utilities.mjs';

function MovementRow({ movement }) {

  return (
    <tr className="movement">
      <td>{movement.movementNum}. {movement.title}</td>
      <td>{convertFlatSharp(movement.keySignature)}</td> 
    </tr>
  );
}

export default MovementRow;