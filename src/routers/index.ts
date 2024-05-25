import express from 'express';
import attempts from './attempts';

const router = express.Router();

router.use('/attempt', attempts);

export default router;
