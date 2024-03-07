// Import dependencies
import {
  createComposer,
  retrieveComposers,
  updateComposer,
  deleteComposer
} from '../models/composers-model.mjs';

// CREATE Controller *******************************************
async function createComposerController(req, res) {
  try {
    const result = await createComposer(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating composer');
  }
}

// RETRIEVE Controllers ****************************************
async function retrieveComposersController(req, res) {
    try {
      const rows = await retrieveComposers();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching composers');
    }
  }

// UPDATE Controller *******************************************
async function updateComposerController(req, res) {
  try {
    const result = await updateComposer(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating composer');
  }
}

// DELETE Controller *******************************************
async function deleteComposerController(req, res) {
  try {
    const result = await deleteComposer(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting composer');
  }
}

export {
  createComposerController,
  retrieveComposersController,
  updateComposerController,
  deleteComposerController
};