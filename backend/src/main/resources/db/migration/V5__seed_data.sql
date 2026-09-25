-- Seed data - safe to re-run (ON CONFLICT DO NOTHING)

-- Admin
INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('System Admin', 'admin@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'ADMIN', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Staff
INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Staff One', 'staff1@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STAFF', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Staff Two', 'staff2@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STAFF', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Staff Three', 'staff3@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STAFF', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Staff Four', 'staff4@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STAFF', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Staff Five', 'staff5@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STAFF', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Students
INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Student One', 'student01@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STUDENT', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Student Two', 'student02@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STUDENT', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('Student Three', 'student03@demo.com', '$2a$12$4GTLaauG6Bf2/cz18QgzROzhHEo3avwjxti0IR/eVyt8W6vSr0Agy', 'STUDENT', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Categories
INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Fees', 'Fee related queries', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Attendance', 'Attendance issues', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('ID Card', 'ID Card requests', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Certificates', 'Certificate requests', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Examinations', 'Exam related queries', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Technical Support', 'Technical issues', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Hostel', 'Hostel related queries', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Transport', 'Transport related queries', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Documents', 'Document requests', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name, description, created_at, updated_at)
VALUES ('Other', 'Other queries', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- SLA Policies
INSERT INTO sla_policies (priority, resolution_hours, updated_at)
VALUES ('LOW', 72, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO sla_policies (priority, resolution_hours, updated_at)
VALUES ('MEDIUM', 24, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO sla_policies (priority, resolution_hours, updated_at)
VALUES ('HIGH', 8, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO sla_policies (priority, resolution_hours, updated_at)
VALUES ('CRITICAL', 4, NOW())
ON CONFLICT DO NOTHING;
