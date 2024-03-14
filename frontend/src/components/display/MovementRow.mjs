import React from 'react';
import { numberToRoman } from '../../modules/utilities.mjs';

function MovementRow({ movement }) {

  return (
    <tr className="movement">
      <td>{numberToRoman(movement.num)}. {movement.title}</td> 
    </tr>
  );
}

export default MovementRow;