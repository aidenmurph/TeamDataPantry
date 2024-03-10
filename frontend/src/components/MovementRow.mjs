import React from 'react';

function MovementRow({ movement }) {

  return (
    <tr className="movement">
      <td>{movement.movementNum}. {movement.title}</td>
      <td></td>
      <td></td>    
    </tr>
  );
}

export default MovementRow;