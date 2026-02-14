-- CreateTable
CREATE TABLE "gyms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "address" JSONB NOT NULL,

    CONSTRAINT "gyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "membershipTier" TEXT NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_metrics" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_assignments" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,

    CONSTRAINT "trainer_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gyms_name_key" ON "gyms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_memberId_gymId_key" ON "enrollments"("memberId", "gymId");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_assignments_trainerId_gymId_key" ON "trainer_assignments"("trainerId", "gymId");

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_assignments" ADD CONSTRAINT "trainer_assignments_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_assignments" ADD CONSTRAINT "trainer_assignments_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Iron Rules: Native Database Constraints

-- 1. Ensure Gym capacity is always a positive number
ALTER TABLE "gyms" ADD CONSTRAINT "capacity_positive" CHECK (capacity > 0);

-- 2. Enforce physiological bounds for health metrics (e.g., heart rate 30-220 bpm)
ALTER TABLE "health_metrics" ADD CONSTRAINT "heart_rate_bounds" 
CHECK (type <> 'heart_rate' OR (value BETWEEN 30 AND 220));

-- 3. Enforce structure for polymorphic exercise data in JSONB column
-- Strength must have reps/sets, Cardio must have duration
ALTER TABLE "workouts" ADD CONSTRAINT "workout_data_check" 
CHECK (
  (type = 'strength' AND data->'reps' IS NOT NULL AND data->'sets' IS NOT NULL) OR
  (type = 'cardio' AND data->'duration' IS NOT NULL)
);