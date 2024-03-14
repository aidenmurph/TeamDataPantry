import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { ComposerForm } from '../components/forms/ComposerForm.mjs';

export const EditComposerPage = ({ composerToEdit }) => {
  // State variables
  const [firstName, setFirstname] = useState(composerToEdit.firstName);
  const [lastName, setLastName]   = useState(composerToEdit.lastName);
  const [birthDate, setBirthDate] = useState(composerToEdit.birthDate);
  const [deathDate, setDeathDate] = useState(composerToEdit.deathDate);

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // UPDATE the composer with the modified data
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
    if(response.ok){
      console.log(`${firstName} ${lastName} has been successfully updated!`);
  } else {
      console.error(`Unable to complete edit. Request returned status code ${response.status}`);
  }
  redirect("/composers");
  };

  // Local variables
  const composerToEditName = `${composerToEdit.firstName} ${composerToEdit.lastName}`

  return (
    <>
      <article>
        <h2>Editing {composerToEditName}</h2>
        <p>Here you can make changes to the composer "{composerToEditName}". Once you're done, click the "Commit" button to save your changes!</p>
        <ComposerForm 
          firstName={firstName} setFirstname={setFirstname}
          lastName={lastName} setLastName={setLastName}
          birthDate={birthDate} setBirthDate={setBirthDate}
          deathDate={deathDate} setDeathDate={setDeathDate}
          onSubmit={editComposer}
        />  
      </article>
    </>
  )
}

export default EditComposerPage;