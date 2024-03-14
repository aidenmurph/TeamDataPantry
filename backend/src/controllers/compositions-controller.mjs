// Import dependencies
import * as compositions from '../models/compositions-model.mjs';

// CREATE Controller *******************************************
function createCompositionController(req, res) {
  compositions.createComposition(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Composition created successfully', compositionID: `${result.insertId}` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating composition' });
    });
}

function createOpusNumsController(req, res) {
  compositions.createOpusNums(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Opus number(s) created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating opus number(s)' });
    });
}

function createCatalogueNumsController(req, res) {
  compositions.createCatalogueNums(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Catalogue number(s) created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating catalogue number(s)' });
    });
}

function createFeaturedInstrumentationController(req, res) {
  compositions.createFeaturedInstrumentation(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Featured instrument(s) created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating featured instrument(s)' });
    });
}

function createMovementsController(req, res) {
  compositions.createMovements(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Movement(s) created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating movement(s)' });
    });
}

// RETRIEVE Controllers ****************************************
function retrieveCompositionsController(req, res) {
  compositions.retrieveCompositions()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching compositions');
    });
}

function retrieveCompositionByIDController(req, res) {
  compositions.retrieveCompositionByID(req.params.id)
    .then(entity => {
      res.json(entity);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(`Error fetching composition with ID ${req.params.id}`);
    });
}

function retrieveKeySignaturesController(req, res) {
  compositions.retrieveKeySignatures()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(`Error fetching key signatures`);
    });
}

// UPDATE Controller *******************************************
function updateCompositionController(req, res) {
  compositions.updateComposition(req.params.id, req.body)
    .then(result => {
      console.log('Update result:', result);
      res.json({ success: true, message: 'Composition updated successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error updating composition' });
    });
}

// DELETE Controllers ******************************************
function deleteCompositionController(req, res) {
  console.log(`Attempting to delete composition with ID: ${req.params.id}`);
  
  compositions.deleteComposition(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Composition deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteCompositionController:', err);
      res.status(500).json({ error: 'Error deleting composition' });
    });
}

function deleteOpusNumsController(req, res) {
  console.log(`Attempting to delete opus numbers from composition with ID: ${req.params.id}`);
  
  compositions.deleteOpusNums(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Opus number(s) deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteOpusNumsController:', err);
      res.status(500).json({ error: 'Error deleting Opus number(s)' });
    });
}

function deleteCatalogueNumsController(req, res) {
  console.log(`Attempting to delete catalogue number(s) from composition with ID: ${req.params.id}`);
  
  compositions.deleteCatalogueNums(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Catalogue number(s) deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteCatalogueNumsController:', err);
      res.status(500).json({ error: 'Error deleting catalogue number(s)' });
    });
}

function deleteFeaturedInstrumentationController(req, res) {
  console.log(`Attempting to delete featured instrumentation from composition with ID: ${req.params.id}`);
  
  compositions.deleteFeaturedInstrumentation(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Featured instrument(s) deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteFeaturedInstrumentationController:', err);
      res.status(500).json({ error: 'Error deleting featured instrumentation' });
    });
}

function deleteMovementsController(req, res) {
  console.log(`Attempting to delete movement(s) from composition with ID: ${req.params.id}`);
  
  compositions.deleteMovements(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Movement(s) deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteMovementsController:', err);
      res.status(500).json({ error: 'Error deleting movements' });
    });
}

export {
  createCompositionController,
  createOpusNumsController,
  createCatalogueNumsController,
  createFeaturedInstrumentationController,
  createMovementsController,
  retrieveCompositionsController,
  retrieveCompositionByIDController,
  retrieveKeySignaturesController,
  updateCompositionController,
  deleteCompositionController,
  deleteOpusNumsController,
  deleteCatalogueNumsController,
  deleteFeaturedInstrumentationController,
  deleteMovementsController
};