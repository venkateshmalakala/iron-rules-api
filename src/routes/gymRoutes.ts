import { Router } from 'express';
import { createGym } from '../controllers/gymController';

const router = Router();

router.post('/gyms', createGym);

export default router;
