
-- Admin
INSERT INTO users (name, email, password_hash, role, created_at, updated_at) 
VALUES ('System Admin', 'admin@demo.com', '$2b$10$a9N7MwQ0H/K0lrXCtXDdhuR8HtwoAyqyQBW4hLfOVDJkzZfYO2ovu', 'ADMIN', NOW(), NOW());

-- Staff
INSERT INTO users (name, email, password_hash, role, created_at, updated_at) 
VALUES ('Staff One', 'staff1@demo.com', '$2b$10$a9N7MwQ0H/K0lrXCtXDdhuR8HtwoAyqyQBW4hLfOVDJkzZfYO2ovu', 'STAFF', NOW(), NOW()),
       ('Staff Two', 'staff2@demo.com', '$2b$10$a9N7MwQ0H/K0lrXCtXDdhuR8HtwoAyqyQBW4hLfOVDJkzZfYO2ovu', 'STAFF', NOW(), NOW());

-- Students
INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Student One', 'student01@demo.com', '$2b$10$a9N7MwQ0H/K0lrXCtXDdhuR8HtwoAyqyQBW4hLfOVDJkzZfYO2ovu', 'STUDENT', NOW(), NOW()),
       ('Student Two', 'student02@demo.com', '$2b$10$a9N7MwQ0H/K0lrXCtXDdhuR8HtwoAyqyQBW4hLfOVDJkzZfYO2ovu', 'STUDENT', NOW(), NOW());

-- Categories
INSERT INTO ticket_categories (name, description, created_at, updated_at) VALUES 
('Fees', 'Fee related queries', NOW(), NOW()),
('Attendance', 'Attendance issues', NOW(), NOW()),
('ID Card', 'ID Card requests', NOW(), NOW());

-- SLAs
INSERT INTO sla_policies (priority, resolution_hours, updated_at) VALUES 
('LOW', 72, NOW()),
('MEDIUM', 24, NOW()),
('HIGH', 8, NOW()),
('CRITICAL', 4, NOW());

-- Note: We add a few tickets to satisfy the requirement
INSERT INTO tickets (ticket_number, student_id, category_id, title, description, priority, status, assigned_staff_id, created_at, updated_at, sla_deadline, active_minutes_elapsed, last_status_change_at)
VALUES 
('EDU-2026-000001', 4, 1, 'Fee query', 'I need help with my fee.', 'MEDIUM', 'NEW', NULL, NOW(), NOW(), NOW() + INTERVAL '24 hours', 0, NOW()),
('EDU-2026-000002', 5, 2, 'Attendance issue', 'My attendance is wrong.', 'HIGH', 'ASSIGNED', 2, NOW(), NOW(), NOW() - INTERVAL '2 hours', 0, NOW());

-- Update sequence
ALTER SEQUENCE ticket_number_seq RESTART WITH 3;
