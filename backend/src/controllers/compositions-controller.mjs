// Import dependencies
import * as compositions from '../models/compositions-model.mjs';

// CREATE Controller *******************************************
function createCompositionController(req, res) {
  compositions.createComposition(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Composition created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating composition' });
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

function retrieveMovementsController(req, res) {
  compositions.retrieveMovements(req.params.id)
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(`Error fetching movements for composition with ID ${req.params.id}`);
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

// DELETE Controller *******************************************
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

export {
  createCompositionController,
  retrieveCompositionsController,
  retrieveCompositionByIDController,
  retrieveMovementsController,
  updateCompositionController,
  deleteCompositionController
};