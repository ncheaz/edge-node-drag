import express from "express";

import { validateRequestParams } from "../middleware/validate.js";

import exampleController from "../controllers/exampleController.js";

const router = express.Router();

//if you create a new controller add it here

router.post(
  "/server/api/example",
  validateRequestParams,
  exampleController.ask
);

export default router;
