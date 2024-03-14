import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { ComposerForm } from '../components/forms/ComposerForm.mjs';

export const AddComposerPage = () => {
  // State variables
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // INSERT the composer into the database
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
    if(response.ok){
      console.log(`${firstName} ${lastName} was successfully added!`);
    } else {
        console.log(`Unable to add composer. Request returned status code ${response.status}`);
    }

    redirect("/composers");
  };

  return (
    <>
      <article>
        <h2>Add a Composer</h2>
        <p>Fill out the fields below to add a composer to the database.</p>
        <ComposerForm 
          firstName={firstName} setFirstname={setFirstname}
          lastName={lastName} setLastName={setLastName}
          birthDate={birthDate} setBirthDate={setBirthDate}
          deathDate={deathDate} setDeathDate={setDeathDate}
          onSubmit={addComposer}
        />  
      </article>
    </>
  )
}

export default AddComposerPage;