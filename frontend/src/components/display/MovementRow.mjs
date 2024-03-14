import React from 'react';

function MovementRow({ movement }) {

  return (
    <tr className="movement">
      <td>{movement.num}. {movement.title}</td> 
    </tr>
  );
}

export default MovementRow;