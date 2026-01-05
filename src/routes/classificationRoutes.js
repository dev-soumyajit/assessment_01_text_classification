// this is router /classify , and handle the endpoint through controller
import express from 'express';
import { classifyText } from '../controllers/classificationController.js';

const router = express.Router();

router.post('/classify', classifyText);

export default router;
