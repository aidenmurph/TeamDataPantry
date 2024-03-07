import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { formatDate } from "../modules/utilities.mjs"
import { server_url } from '../config';

export const AddComposerPage = () => {
  // State variables
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');

  const redirect = useNavigate();

  const addComposer = async () => {
    const newComposer = {
      firstName,
      lastName,
      birthDate,
      deathDate
    }
    const response = await fetch(`${server_url}/api/composers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComposer),
    });
    if(response.status === 201){
      console.log(`${firstName} ${lastName} was successfully added!`);
  } else {
      console.log(`Unable to add composer. Request returned status code ${response.status}`);
  }
  redirect("/Composers");
  };

  const currentDate = new Date();

  return (
    <>
      <article>
        <h2>Add a Composer</h2>
          <table class="table">
                <legend>Fill out the fields below to add a composer to the database.</legend>
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
                    onClick={addComposer}
                    id="submit"
                  >Submit</button>
                </td>
              </tr>
          </table>
      </article>
    </>
  )
}

export default AddComposerPage;