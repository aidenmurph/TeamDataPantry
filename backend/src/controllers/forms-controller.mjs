// Import dependencies
import * as forms from '../models/forms-model.mjs';

// CREATE Controller *******************************************
function createFormController(req, res) {
  forms.createForm(req.body)
    .then(result => {
      if (result.error) {
        res.status(400).json({ error: result.message });
      } else {
        res.json(result);
      }
    })
    .catch(error => {
      console.error(`Unexpected error in createFormController: ${error}`);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    });
}

// RETRIEVE Controllers ****************************************
function retrieveFormsController(req, res) {
  forms.retrieveForms()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching forms');
    });
}

// UPDATE Controller *******************************************
function updateFormController(req, res) {
  forms.updateForm(req.params.id, req.body)
    .then(result => {
      if (result.error) {
        res.status(400).json({ error: result.message });
      } else {
        res.json(result);
      }
    })
    .catch(error => {
      console.error(`Unexpected error in updateFormController: ${error}`);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    });
}

// DELETE Controller *******************************************
function deleteFormController(req, res) {
  console.log(`Attempting to delete form with ID: ${req.params.id}`);
  
  forms.deleteForm(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Form deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteFormController:', err);
      res.status(500).json({ error: 'Error deleting form' });
    });
}

export {
  createFormController,
  retrieveFormsController,
  updateFormController,
  deleteFormController
};