// Import dependencies
import express from 'express';
import cors from 'cors';
import * as composers from './controllers/composers-controller.mjs';
import * as catalogues from './controllers/catalogues-controller.mjs';
import * as compositions from './controllers/compositions-controller.mjs'
import * as instruments from './controllers/instruments-controller.mjs'
import * as forms from './controllers/forms-controller.mjs'
import 'dotenv/config';

// Apply BigInt serialization patch
BigInt.prototype.toJSON = function () {
  return parseInt(this);
};

// Configure Middleware
const app = express();
const port = process.env.PORT_BACKEND;
const frontend_url = `${process.env.FRONTEND_URL_ROOT}:${process.env.PORT_FRONTEND}`

app.use(cors({
  origin: frontend_url
}));
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Composers API' });
});

// ROUTE HANDLING **********************************************
// Composers
app.post('/api/composers', composers.createComposerController);
app.get('/api/composers', composers.retrieveComposersController);
app.put('/api/composers/:id', composers.updateComposerController);
app.delete('/api/composers/:id', composers.deleteComposerController);

// Catalogues
app.post('/api/catalogues', catalogues.createCatalogueController);
app.get('/api/catalogues', catalogues.retrieveCataloguesController);
app.get('/api/catalogues/for-composer-:id', catalogues.retrieveCataloguesForComposerController);
app.put('/api/catalogues/:id', catalogues.updateCatalogueController);
app.delete('/api/catalogues/:id', catalogues.deleteCatalogueController);

// Compositions
app.get('/api/key-signatures', compositions.retrieveKeySignaturesController);
app.post('/api/compositions', compositions.createCompositionController);
app.post('/api/opus-nums/for-composition-:id', compositions.createOpusNumsController);
app.post('/api/catalogue-nums/for-composition-:id', compositions.createCatalogueNumsController);
app.post('/api/featured-instruments/for-composition-:id', compositions.createFeaturedInstrumentationController);
app.get('/api/compositions', compositions.retrieveCompositionsController);
app.get('/api/composition/:id', compositions.retrieveCompositionByIDController);
app.get('/api/movements/:id', compositions.retrieveMovementsController);
app.put('/api/compositions/:id', compositions.updateCompositionController);
app.delete('/api/compositions/:id', compositions.deleteCompositionController);

// Instruments
app.post('/api/instruments/:familyid', instruments.createInstrumentController);
app.get('/api/instrument-families', instruments.retrieveInstrumentFamiliesController);
app.get('/api/instruments/by-family/:id', instruments.retrieveInstrumentsByFamilyController);
app.get('/api/instruments/featured/:id', instruments.retrieveFeaturedInstrumentsController);
app.get('/api/instruments/instrumentation/composition-:id/family-:familyid', instruments.retrieveInstrumentationByFamilyController);
app.put('/api/instruments/:id', instruments.updateInstrumentController);
app.delete('/api/instruments/:id', instruments.deleteInstrumentController);

// Forms
app.post('/api/forms', forms.createFormController);
app.get('/api/forms', forms.retrieveFormsController);
app.put('/api/forms/:id', forms.updateFormController);
app.delete('/api/forms/:id', forms.deleteFormController);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});