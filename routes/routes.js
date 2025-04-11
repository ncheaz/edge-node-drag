const express = require('express');
const { validateRequestParams } = require('../middleware/validate.js');
const exampleController = require('../controllers/exampleSparqlController.js');
const exampleVectorController = require('../controllers/exampleVectorController.js');

const router = express.Router();

//if you create a new controller add it here

router.post(
    '/server/api/example',
    validateRequestParams,
    exampleController.ask
);

router.post(
    '/server/api/example-vector',
    validateRequestParams,
    exampleVectorController.ask
);

module.exports = router;
