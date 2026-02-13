import { Router } from 'express';
import { assignTrainer } from '../controllers/trainerController';

const router = Router();

router.post('/trainers/:trainerId/assignments', assignTrainer);

export default router;
