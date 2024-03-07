// Import dependencies
import * as composers from '../models/composers-model.mjs';

// CREATE Controller *******************************************
function createComposerController(req, res) {
  composers.createComposer(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Composer created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating composer' });
    });
}


// RETRIEVE Controllers ****************************************
function retrieveComposersController(req, res) {
  composers.retrieveComposers()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching composers');
    });
}

// UPDATE Controller *******************************************
function updateComposerController(req, res) {
  composers.updateComposer(req.params.id, req.body)
    .then(result => {
      console.log('Update result:', result);
      res.json({ success: true, message: 'Composer updated successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error updating composer' });
    });
}

// DELETE Controller *******************************************
function deleteComposerController(req, res) {
  console.log(`Attempting to delete composer with ID: ${req.params.id}`);
  
  composers.deleteComposer(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Composer deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteComposerController:', err);
      res.status(500).json({ error: 'Error deleting composer' });
    });
}

export {
  createComposerController,
  retrieveComposersController,
  updateComposerController,
  deleteComposerController
};