import { Router } from 'express';
// Change 'createWorkout' to 'logWorkout' to match your controller export
import { logWorkout } from '../controllers/workoutController';

const router = Router();

// Ensure the handler here is also updated
router.post('/members/:memberId/workouts', logWorkout);

export default router;