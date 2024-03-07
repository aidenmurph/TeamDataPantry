// Import dependencies
import * as instruments from '../models/instruments-model.mjs';

// CREATE Controller *******************************************
function createInstrumentController(req, res) {
  instruments.createInstrument(req.body)
    .then(result => {
      if (result.error) {
        res.status(400).json({ error: result.message });
      } else {
        res.json(result);
      }
    })
    .catch(error => {
      console.error(`Unexpected error in createInstrumentController: ${error}`);
      res.status(500).json({ error: 'An unexpected error occurred.' });
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
      if (result.error) {
        res.status(400).json({ error: result.message });
      } else {
        res.json(result);
      }
    })
    .catch(error => {
      console.error(`Unexpected error in updateInstrumentController: ${error}`);
      res.status(500).json({ error: 'An unexpected error occurred.' });
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