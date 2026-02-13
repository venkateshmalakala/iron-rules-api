import { Router } from 'express';
import { enrollMember, logHealthMetric } from '../controllers/memberController';

const router = Router();

router.post('/members/:memberId/enrollments', enrollMember);
router.post('/members/:memberId/metrics', logHealthMetric);

export default router;
