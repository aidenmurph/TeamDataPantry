import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { formatDate } from "../modules/utilities.mjs"
import { server_url } from '../config';

export const EditComposerPage = ({ composerToEdit }) => {
  // State variables
  const [firstName, setFirstname] = useState(composerToEdit.firstName);
  const [lastName, setLastName]   = useState(composerToEdit.lastName);
  const [birthDate, setBirthDate] = useState(composerToEdit.birthDate);
  const [deathDate, setDeathDate] = useState(composerToEdit.deathDate);

  const redirect = useNavigate();

  const editComposer = async () => {
    const response = await fetch(`${server_url}/api/composers/${composerToEdit.composerID}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        deathDate: deathDate 
      }),
      headers: {'Content-Type': 'application/json',},
  });
    if(response.status === 201){
      console.log(`${firstName} ${lastName} has been successfully updated!`);
  } else {
      console.error(`Unable to complete edit. Request returned status code ${response.status}`);
  }
  redirect("/Composers");
  };

  // Local variables
  const currentDate = new Date();
  const composerToEditName = `${composerToEdit.firstName} ${composerToEdit.lastName}`

  return (
    <>
      <article>
        <h2>Editing {composerToEditName}</h2>
        <p>Here you can make changes to the composer "{composerToEditName}". Once you're done, click the "Commit" button to save your changes!</p>
          <table className="table">
            <tbody>
              <tr>
                <td><label htmlFor="first-name">First Name: </label>
                  <input 
                    type="text" 
                    name="first-name" 
                    id="first-name" 
                    className="add-input" 
                    onChange={e => setFirstname(e.target.value)}
                    placeholder="First Name" 
                    value={firstName} />
                </td>
                <td><label htmlFor="last-name">Last Name: </label>
                  <input 
                    type="text" 
                    name="last-name" 
                    id="last-name" 
                    className="add-input" 
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last Name" 
                    value={lastName} />
                </td>
                <td><label htmlFor="birth-date">Birth Date: </label>
                  <input
                    type="date"
                    max={formatDate(currentDate)}
                    onChange={e => setBirthDate(e.target.value)} 
                    value={formatDate(birthDate)}
                    id="birth-date" />
                </td>
                <td><label htmlFor="death-date">Death Date: </label>
                  <input
                    type="date"
                    max={formatDate(currentDate)}
                    onChange={e => setDeathDate(e.target.value)}
                    value={deathDate ? formatDate(deathDate) : ''} 
                    id="death-date" />
                </td>
                <td><input type="reset" value="Reset" /></td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  <button 
                    name="submit-button" 
                    type="submit"
                    onClick={editComposer}
                    id="submit"
                  >Commit</button>
                </td>
              </tr>
            </tbody>
          </table>
      </article>
    </>
  )
}

export default EditComposerPage;