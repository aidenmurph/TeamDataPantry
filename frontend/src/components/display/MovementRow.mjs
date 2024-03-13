import React from 'react';

function MovementRow({ movement }) {

  return (
    <tr className="movement">
      <td>{movement.movementNum}. {movement.title}</td> 
    </tr>
  );
}

export default MovementRow;