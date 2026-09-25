
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    student_id VARCHAR(100),
    department VARCHAR(100),
    semester VARCHAR(50),
    contact_number VARCHAR(50)
);

CREATE TABLE staff_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    department VARCHAR(100),
    designation VARCHAR(100),
    contact_number VARCHAR(50),
    active BOOLEAN DEFAULT TRUE
);
