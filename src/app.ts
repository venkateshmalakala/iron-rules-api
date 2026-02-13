import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import gymRoutes from './routes/gymRoutes';
import memberRoutes from './routes/memberRoutes';
import trainerRoutes from './routes/trainerRoutes';
import workoutRoutes from './routes/workoutRoutes';
// Fix: Use curly braces for named export
import { prisma } from './lib/prisma';

const app = express();
app.use(express.json());

// Register the routes
app.use('/api', gymRoutes);
app.use('/api', memberRoutes);
app.use('/api', trainerRoutes);
app.use('/api', workoutRoutes);

// Mandatory Error Handler (Must be LAST)
app.use(errorHandler);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Iron Rules API running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default app;