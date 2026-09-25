
CREATE TABLE ticket_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE sla_policies (
    id BIGSERIAL PRIMARY KEY,
    priority VARCHAR(50),
    resolution_hours INT,
    active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP
);
