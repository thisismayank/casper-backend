import express from "express";
import * as controller from "../../controllers/openai.controller.js";
const router = express.Router();

// router.route("/").post(controller.generateResponse);
router.route("/").post(controller.generateResponseForCasper);

router.route("/image").post(controller.upload.single('file'), controller.generateResponseForCasper);


export default router;