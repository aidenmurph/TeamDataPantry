import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { formatDate } from "../modules/utilities.mjs"
import { server_url } from '../config';

export const EditComposerPage = ({ composerToEdit }) => {
  // State variables
  const [firstName, setFirstname] = useState(composerToEdit.firstName);
  const [lastName, setLastName] = useState(composerToEdit.lastName);
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

  const currentDate = new Date();

  return (
    <>
      <article>
        <h2>Add a Composer</h2>
          <table class="table">
                <legend>Here you can make changes to the composer "{firstName} {lastName}". Once you're done, click the "Commit" button to save your changes!</legend>
                <tr>
                  <td><label for="first-name">First Name: </label>
                    <input 
                      type="text" 
                      name="first-name" 
                      id="first-name" 
                      class="add-input" 
                      onChange={e => setFirstname(e.target.value)} 
                      placeholder="First Name" />
                  </td>
                  <td><label for="last-name">Last Name: </label>
                    <input 
                      type="text" 
                      name="last-name" 
                      id="last-name" 
                      class="add-input" 
                      onChange={e => setLastName(e.target.value)} 
                      placeholder="Last Name" />
                  </td>
                  <td><label for="birth-date">Birth Date: </label>
                    <input
                      type="date"
                      max={formatDate(currentDate)}
                      onChange={e => setBirthDate(e.target.value)} 
                      id="birth-date" />
                  </td>
                  <td><label for="death-date">Death Date: </label>
                    <input
                      type="date"
                      max={formatDate(currentDate)}
                      onChange={e => setDeathDate(e.target.value)} 
                      id="death-date" />
                  </td>
                  <td><input type="reset" value="Reset" /></td>
                </tr>
              <tr>
                <td colspan="5" style={{ textAlign: "center" }}>
                  <button 
                    name="submit-button" 
                    type="submit"
                    onClick={editComposer}
                    id="submit"
                  >Commit</button>
                </td>
              </tr>
          </table>
      </article>
    </>
  )
}

export default EditComposerPage;