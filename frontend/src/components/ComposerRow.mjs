import React from 'react';

function ComposerRow({ composer, onEdit, onDelete }) {

  const toLongDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const birthDate = toLongDate(composer.birthDate);
  const deathDate = composer.deathDate ? toLongDate(composer.deathDate) : '';

  return (
    <tr class="composer">
      <td>{composer.firstName} {composer.lastName}</td>
      <td>{birthDate}</td>
      <td>{deathDate}</td>    
      <td><button onClick={() => onEdit(composer)}>Edit</button></td>
      <td><button onClick={() => onDelete(composer.composerID)}>Delete</button></td>
    </tr>
  );
}

export default ComposerRow;