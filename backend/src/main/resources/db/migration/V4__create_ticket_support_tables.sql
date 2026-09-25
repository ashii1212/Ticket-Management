
CREATE TABLE ticket_comments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id),
    author_id BIGINT REFERENCES users(id),
    content TEXT,
    type VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE ticket_activities (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id),
    actor_id BIGINT REFERENCES users(id),
    activity_type VARCHAR(50),
    description VARCHAR(255),
    metadata TEXT,
    created_at TIMESTAMP
);

CREATE TABLE escalations (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id),
    escalated_by_id BIGINT REFERENCES users(id),
    reason VARCHAR(255),
    automatic BOOLEAN,
    escalated_at TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT REFERENCES users(id),
    action VARCHAR(255),
    entity_type VARCHAR(255),
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(255),
    created_at TIMESTAMP
);
