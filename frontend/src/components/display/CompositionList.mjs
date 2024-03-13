import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompositionRow from './CompositionRow.mjs';

function CompositionList({ compositions, onDelete, onEdit }) {
  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  return (
    <table id="compositions" className="compositions">
      <thead>
        <tr>
          <th>Title</th>
          <th>Opus</th>
          <th>Cat.</th>
          <th>Composer</th>
          <th>Form</th>
          <th>Key Signature</th>
          <th>Instrumentation</th>
          <th>Year</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {compositions.map((composition, i) => 
          <CompositionRow 
              composition={composition} 
              key={i}
              onDelete={onDelete}
              onEdit={onEdit} 
          />)}
        <tr>
          <td colSpan="10" style={{ textAlign: "center" }}>
            <button
              className="buttonGeneral addButton"
              type="addComposition"
              onClick={() => redirect("/add-composition")}
              id="addComposition"
            >Add New Composition</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CompositionList;