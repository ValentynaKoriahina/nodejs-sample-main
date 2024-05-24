import express from 'express';
import {
  addAttempt,
  getAttempts,
  getAttemptsCounts,
} from 'src/controllers/attempts';

const router = express.Router();

router.post('', addAttempt);
router.get('', getAttempts);
router.post('/_counts', getAttemptsCounts);


export default router;

