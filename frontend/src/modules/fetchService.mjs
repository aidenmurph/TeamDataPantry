/* This module holds functions which carry out API calls 
 * to query the database for the purpose of loading data 
 * for different pages */

// Import dependencies;
import { server_url } from '../config.js';

// Composer Fetchers ***************************************

// Fetch all composers for display as a list
const fetchComposers = async (setComposers) => {
  try {
    const response = await fetch(`${server_url}/api/composers`);
    if (!response.ok) {
      throw new Error('Network response returned: ' + response.statusText);
    }
    const composers = await response.json();
    setComposers(composers);
  } catch (error) {
    console.error('Error fetching composers:', error);
  }
};

// Catalogue Fetchers ***************************************

// Fetch all catalogues for display as a list
const fetchCatalogues = (setCatalogues) => {
  fetch(`${server_url}/api/catalogues`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response returned status: ' + response.statusText);
      }
      return response.json();
    })
    .then(catalogues => {
      setCatalogues(catalogues);
    })
    .catch(error => {
      console.error('Error fetching catalogues:', error);
    });
};

// Form Fetchers

// Fetch all forms for display as a list
const fetchForms = async (setForms) => {
  try {
    const response = await fetch(`${server_url}/api/forms`);
    if (!response.ok) {
      throw new Error('Network response returned status: ' + response.statusText);
    }
    const forms = await response.json();
    setForms(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
  }
};

// Instrument Fetchers ***************************************

// Fetch all instrument families for use in formatting and filtering
const fetchFamilyList = (setFamilyList) => {
  fetch(`${server_url}/api/instrument-families`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response returned status: ' + response.statusText);
      }
      return response.json();
    })
    .then(families => {
      setFamilyList(families);
    })
    .catch(error => {
      console.error('Error fetching list of instrument families:', error);
    });
};

// Fetch all instruments for display as a list
const fetchAllInstruments = async (familyList, setInstruments) => {
  try {
    const fetchPromises = familyList.map(family =>
      fetch(`${server_url}/api/instruments/by-family/${family.familyID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response returned status: ' + response.statusText);
          }
          return response.json();
        })
    );
    const allInstruments = await Promise.all(fetchPromises);
    setInstruments(allInstruments);
  } catch (error) {
    console.error('Error fetching instruments:', error);
  }
};

// Fetch a single instrument family to update the list of instruments
const fetchInstrumentFamily = async (familyID, instruments, setInstruments) => {
  try {
    const response = await fetch(`${server_url}/api/instruments/by-family/${familyID}`);
    if (!response.ok) {
      throw new Error('Network response returned status: ' + response.statusText);
    }
    const instrumentFamily = await response.json();
    let allInstruments = [...instruments];
    allInstruments[familyID - 1] = instrumentFamily;
    setInstruments(allInstruments);
  } 
  catch (error) {
    console.error('Error fetching instruments for family:', error);
  }
};

// Compositions Fetchers ***************************************

// Fetch all compositions for display as a list
const fetchCompositions = (setCompositions) => {
  fetch(`${server_url}/api/compositions`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response returned status: ' + response.statusText);
      }
      return response.json();
    })
    .then(compositions => {
      setCompositions(compositions);
    })
    .catch(error => {
      console.error('Error fetching compositions:', error);
    });
};

// Fetch a single composition's data from the database
const fetchComposition = (compositionID, setComposition) => {
  fetch(`${server_url}/api/composition/${compositionID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response returned status: ' + response.statusText);
      }
      return response.json();
    })
    .then(composition => {
      setComposition(composition);
    })
    .catch(error => {
      console.error(`Error fetching composition with ID ${compositionID}:`, error);
    });
};

// Fetch the instrumentation for a single composition from the database
const fetchInstrumentation = (compositionID, setInstrumentation) => {
  fetch(`${server_url}/api/instruments/instrumentation/${compositionID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response returned status: ' + response.statusText);
      }
      return response.json();
    })
    .then(instrumentation => {
      setInstrumentation(instrumentation);
    })
    .catch(error => {
      console.error(`Error fetching instrumentation for composition with ID ${compositionID}:`, error);
    });
};

// Fetch the movements for a single composition from the database
const fetchMovements = (compositionID, setMovements) => {
  fetch(`${server_url}/api/movements/${compositionID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response returned status: ' + response.statusText);
      }
      return response.json();
    })
    .then(movements => {
      setMovements(movements);
    })
    .catch(error => {
      console.error(`Error fetching movements for composition with ID ${compositionID}:`, error);
    });
};

export {
  fetchComposers,
  fetchCatalogues,
  fetchForms,
  fetchFamilyList,
  fetchAllInstruments,
  fetchInstrumentFamily,
  fetchCompositions, 
  fetchComposition,
  fetchInstrumentation,
  fetchMovements
};