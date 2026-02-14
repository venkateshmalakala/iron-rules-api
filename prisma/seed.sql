-- 1. CLEANUP (Optional but recommended for fresh testing)
TRUNCATE TABLE gyms, members, health_metrics, trainers, trainer_assignments, enrollments, workouts CASCADE;

-- 2. SEED GYMS (Required for Rule 1: Capacity and Rule 3: Error Contract)
-- Address is stored as a JSON object as per your schema.
INSERT INTO gyms (id, name, capacity, address) VALUES 
('gym_elite_01', 'Elite Fitness', 2, '{"street": "Main St", "city": "Kakinada", "country": "India"}'),
('gym_power_02', 'Power House', 10, '{"street": "Rd 1", "city": "Vizag", "country": "India"}'),
('gym_flex_03', 'Flex Gym', 15, '{"street": "Rd 2", "city": "Vizag", "country": "India"}'),
('gym_iron_04', 'Iron Gym', 20, '{"street": "Rd 3", "city": "Vizag", "country": "India"}');

-- 3. SEED TRAINERS (Required for Rule 2: Assignment Limits)
-- Uses 'certification' instead of 'level' based on your provided schema.
INSERT INTO trainers (id, name, certification, "expiryDate") VALUES 
('trainer_vikram_01', 'Vikram Singh', 'advanced', '2027-12-31'::timestamp),
('trainer_anjali_02', 'Anjali Rao', 'basic', '2026-06-30'::timestamp),
('trainer_rajesh_03', 'Rajesh Kumar', 'advanced', '2028-01-01'::timestamp);

-- 4. SEED MEMBERS (Required for Enrollment Testing)
INSERT INTO members (id, name) VALUES 
('member_venkatesh_01', 'MALAKALA VENKATESWARARAO'),
('member_malakala_02', 'Malakala');

-- 5. SEED INITIAL ASSIGNMENTS (Optional)
-- This puts trainer_vikram_01 at 2 assignments already (limit is 3 for 'advanced')
INSERT INTO trainer_assignments (id, "trainerId", "gymId") VALUES
('assign_01', 'trainer_vikram_01', 'gym_elite_01'),
('assign_02', 'trainer_vikram_01', 'gym_power_02');