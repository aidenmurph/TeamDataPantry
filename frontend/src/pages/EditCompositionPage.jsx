// Import dependencies
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { CompositionForm } from '../components/forms/CompositionForm.mjs';

export const EditCompositionPage = ({ compositionToEdit }) => {
  // State variables for database entities
  const [englishTitle, setEnglishTitle] = useState(compositionToEdit.titleEnglish);
  const [nativeTitle, setNativeTitle] = useState(compositionToEdit.titleNative);
  const [subtitle, setSubtitle] = useState(compositionToEdit.subtitle);
  const [composerID, setComposerID] = useState(compositionToEdit.composerID);
  const [dedication, setDedication] = useState(compositionToEdit.dedication);
  const [compositionYear, setCompositionYear] = useState(compositionToEdit.compositionYear);
  const [formID, setFormID] = useState(compositionToEdit.form.id);
  const [keySignature, setKeySignature] = useState(compositionToEdit.keySignature.name ? compositionToEdit.keySignature.name : 'SELECT');
  const [opusNums, setOpusNums] = useState(compositionToEdit.opusNums);
  const [catalogueNums, setCatalogueNums] = useState(compositionToEdit.catalogueNums);
  const [featuredInstrumentation, setFeaturedInstrumentation] = useState(compositionToEdit.featuredInstrumentation);
  const [movements, setMovements] = useState(compositionToEdit.movements.length > 1 ? compositionToEdit.movements : []);

  // Flag for success of all database inserts
  const [editSuccess, setEditSuccess] = useState(true);

  // Assign redirect function
  const redirect = useNavigate();

  // Form Functions ********************************************

  // UPDATE the composition in the database with the modified data
  const editComposition = async () => {
    const compositionResponse = await fetch(`${server_url}/api/compositions/${compositionToEdit.compositionID}`, {
      method: 'PUT',
      body: JSON.stringify({
        englishTitle: englishTitle,
        nativeTitle: nativeTitle,
        subtitle: subtitle,
        composerID: composerID,
        dedication: dedication,
        compositionYear: compositionYear,
        formID: formID,
        keySignature: keySignature
      }),
      headers: {'Content-Type': 'application/json',},
    });
    if(compositionResponse.ok){
      console.log(`"${englishTitle ? englishTitle : nativeTitle}" has been successfully updated!`);
    } 
    else {
      setEditSuccess(false);
      console.log(`Unable to add composition. Request returned status code ${compositionResponse.status}`);
    }

    // INSERT Opus Number(s), if any
    if (opusNums.length > 0) {
      const response = await fetch(`${server_url}/api/opus-nums/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        addOpusNums(compositionToEdit.compositionID);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete opus num(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Catalogue Number(s), if any
    if (catalogueNums.length > 0) {
      const response = await fetch(`${server_url}/api/catalogue-nums/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        addCatalogueNums(compositionToEdit.compositionID);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete catalogue num(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Featured Instrumentation
    if (featuredInstrumentation.length > 0) {
      const response = await fetch(`${server_url}/api/featured-instruments/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        await addFeaturedInstrumentation(compositionToEdit.compositionID);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete featured instrument(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Movement(s)
    if (featuredInstrumentation.length > 0) {
      const response = await fetch(`${server_url}/api/movements/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        await addMovements(compositionToEdit.compositionID);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete movement(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }
    
    if (editSuccess === true) {
      redirect(`/composition/${compositionToEdit.compositionID}`);
    }
  };

  // Prepare the opus numbers as query compatible objects and send to database
  const addOpusNums = async (compositionID) => {
    const data = opusNums.map(opusNum => ({ 
      compositionID: compositionID, 
      opNum: opusNum 
    }));
    const response = await fetch(`${server_url}/api/opus-nums/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Opus number(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setEditSuccess(false);
      console.log(`Unable to add opus number(s). Request returned status code ${response.status}`);
    }
  }

  // Prepare the catalogue numbers as query compatible objects and send to database
  const addCatalogueNums = async (compositionID) => {
    const data = catalogueNums.map(catNum => ({ 
      catalogueID: catNum.catalogueID, 
      compositionID: compositionID, 
      catNum: catNum.catNum 
    }));
    const response = await fetch(`${server_url}/api/catalogue-nums/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Catalogue number(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setEditSuccess(false);
      console.log(`Unable to add catalogue number(s). Request returned status code ${response.status}`);
    }
  }

  // Prepare the featured instrumentation as query compatible objects and send to database
  const addFeaturedInstrumentation = async (compositionID) => {
    const data = featuredInstrumentation.map(instrument => ({ 
      compositionID: compositionID,
      instrumentID: instrument.id
    }));
    const response = await fetch(`${server_url}/api/featured-instruments/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Featured instrument(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setEditSuccess(false);
      console.log(`Unable to add featured instrument(s). Request returned status code ${response.status}`);
    }
  }

  // Prepare the movements as query compatible objects and send to database
  const addMovements = async (compositionID) => {
    const data = movements.length > 0 ?        
      // Multi-movement works
      movements.map(movement => ({ 
        compositionID: compositionID, 
        movementNum: movement.num,
        title:  movement.title === '' ? null : movement.title
      }))
    :
      // Single-movement works
      [{
        compositionID: compositionID,
        movementNum: 1,
        title: null
      }]
    const response = await fetch(`${server_url}/api/movements/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Movement(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setEditSuccess(false);
      console.log(`Unable to movement(s). Request returned status code ${response.status}`);
    }
  }

  return (
    <>
      <article>
        <h2>Editing {compositionToEdit.titleEnglish ? compositionToEdit.titleEnglish : compositionToEdit.titleEnglish}</h2>
        <p>Make your edits to {compositionToEdit.titleEnglish ? compositionToEdit.titleEnglish : compositionToEdit.titleEnglish} and click "Submit" to update the entry in the database.</p>
        <CompositionForm 
          englishTitle={englishTitle} setEnglishTitle={setEnglishTitle}
          nativeTitle={nativeTitle} setNativeTitle={setNativeTitle}
          subtitle={subtitle} setSubtitle={setSubtitle}
          composerID={composerID} setComposerID={setComposerID}
          dedication={dedication} setDedication={setDedication}
          compositionYear={compositionYear} setCompositionYear={setCompositionYear}
          formID={formID} setFormID={setFormID}
          keySignature={keySignature} setKeySignature={setKeySignature}
          opusNums={opusNums} setOpusNums={setOpusNums}
          catalogueNums={catalogueNums} setCatalogueNums={setCatalogueNums}
          featuredInstrumentation={featuredInstrumentation} setFeaturedInstrumentation={setFeaturedInstrumentation}
          movements={movements} setMovements={setMovements}
          onSubmit={editComposition}
        />
      </article>
    </>
  )
}

export default EditCompositionPage;