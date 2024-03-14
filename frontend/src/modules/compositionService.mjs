/* This module holds functions for maintaining auxillary composition
 * attributes that are shared between composition add/edit forms
 */

// Import dependencies
import { server_url } from '../config.js';

// Prepare the opus numbers as query compatible objects and send to database
const addOpusNums = async (compositionID, opusNums) => {
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
    console.log(`Unable to add opus number(s). Request returned status code ${response.status}`);
  }
}

// Prepare the catalogue numbers as query compatible objects and send to database
const addCatalogueNums = async (compositionID, catalogueNums) => {
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
    console.log(`Unable to add catalogue number(s). Request returned status code ${response.status}`);
  }
}

// Prepare the featured instrumentation as query compatible objects and send to database
const addFeaturedInstrumentation = async (compositionID, featuredInstrumentation) => {
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
    console.log(`Unable to add featured instrument(s). Request returned status code ${response.status}`);
  }
}

// Prepare the movements as query compatible objects and send to database
const addMovements = async (compositionID, movements) => {
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
    console.log(`Unable to movement(s). Request returned status code ${response.status}`);
  }
}

export {
  addOpusNums,
  addCatalogueNums,
  addFeaturedInstrumentation,
  addMovements
}