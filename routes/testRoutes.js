import express from 'express';
import { testContoller } from '../controllers/testController.js';

const router = express.Router();

router.get("/test", testContoller)

export default router