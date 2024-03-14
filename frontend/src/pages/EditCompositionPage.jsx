// Import dependencies
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { CompositionForm } from '../components/forms/CompositionForm.mjs';
import * as service from '../modules/compositionService.mjs';

export const EditCompositionPage = ({ compositionToEdit }) => {
  // State variables for database entities
  const [englishTitle, setEnglishTitle] = useState(compositionToEdit.titleEnglish ? compositionToEdit.titleEnglish : '');
  const [nativeTitle, setNativeTitle] = useState(compositionToEdit.titleNative ? compositionToEdit.titleNative : '');
  const [subtitle, setSubtitle] = useState(compositionToEdit.subtitle ? compositionToEdit.subtitle : '');
  const [composerID, setComposerID] = useState(compositionToEdit.composerID);
  const [dedication, setDedication] = useState(compositionToEdit.dedication ? compositionToEdit.dedication : '');
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
        service.addOpusNums(compositionToEdit.compositionID, opusNums);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete opus num(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Catalogue Number(s), if any
    if (catalogueNums.length > 0) {
      const response = await fetch(`${server_url}/api/catalogue-nums/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        service.addCatalogueNums(compositionToEdit.compositionID, catalogueNums);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete catalogue num(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Featured Instrumentation
    if (featuredInstrumentation.length > 0) {
      const response = await fetch(`${server_url}/api/featured-instruments/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        await service.addFeaturedInstrumentation(compositionToEdit.compositionID, featuredInstrumentation);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete featured instrument(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Movement(s)
    if (movements.length > 0) {
      const response = await fetch(`${server_url}/api/movements/for-composition-${compositionToEdit.compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        await service.addMovements(compositionToEdit.compositionID, movements);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete movement(s) from composition with ID ${compositionToEdit.compositionID}, status code = ${response.status}`)
      }
    }
    
    if (editSuccess === true) {
      redirect(`/composition/${compositionToEdit.compositionID}`);
    }
  };

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