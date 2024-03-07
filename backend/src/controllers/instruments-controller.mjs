// Import dependencies
import * as instruments from '../models/instruments-model.mjs';

// CREATE Controller *******************************************
function createInstrumentController(req, res) {
  instruments.createInstrument(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Instrument created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating instrument' });
    });
}

// RETRIEVE Controllers ****************************************
function retrieveInstrumentsController(req, res) {
  instruments.retrieveInstruments()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching instruments');
    });
}

// UPDATE Controller *******************************************
function updateInstrumentController(req, res) {
  instruments.updateInstrument(req.params.id, req.body)
    .then(result => {
      console.log('Update result:', result);
      res.json({ success: true, message: 'Instrument updated successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error updating instrument' });
    });
}

// DELETE Controller *******************************************
function deleteInstrumentController(req, res) {
  console.log(`Attempting to delete instrument with ID: ${req.params.id}`);
  
  instruments.deleteInstrument(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Instrument deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteInstrumentController:', err);
      res.status(500).json({ error: 'Error deleting instrument' });
    });
}

export {
  createInstrumentController,
  retrieveInstrumentsController,
  updateInstrumentController,
  deleteInstrumentController
};