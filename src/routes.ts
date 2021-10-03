import { Router } from "express";
import * as dataArchiveController from "./controller/dataArchiveController";
import multer from "multer";

const router = Router();
const multerConfig = multer();
const multerData = multerConfig.single("file");

router.post("/data", multerData, dataArchiveController.uploadData);

export { router };
