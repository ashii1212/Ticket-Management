# API Reference

Base URL: http://localhost:8080/api
All endpoints require Authorization: Bearer <token> except /auth/login.
Interactive docs: http://localhost:8080/swagger-ui.html

## Authentication

### POST /api/auth/login
Request: `{"email": "admin@demo.com", "password": "password123"}`
Response: `{"token": "...", "user": {"id": 1, "name": "Admin", "email": "admin@demo.com", "role": "ADMIN"}}`

## Tickets

### GET /api/tickets
Query params: page, size, status, priority, category, assignee, slaStatus, search, sort
Role access: STUDENT (own only), STAFF (assigned + unassigned), ADMIN (all)

### POST /api/tickets
Role: STUDENT
Body: `{"title": "", "categoryId": 1, "description": "", "requestedPriority": "MEDIUM"}`

### GET /api/tickets/{id}
Role: STUDENT (own only), STAFF, ADMIN

### POST /api/tickets/{id}/assign
Role: STAFF, ADMIN
Body: `{"staffId": 2}`

### POST /api/tickets/{id}/transition
Role: STAFF, ADMIN
Body: `{"targetStatus": "IN_PROGRESS", "reason": ""}`
Returns 409 for invalid transitions.

### POST /api/tickets/{id}/escalate
Role: STAFF, ADMIN
Body: `{"reason": ""}`

### POST /api/tickets/{id}/resolve
Role: STAFF, ADMIN
Body: `{"resolutionNote": ""}`

### POST /api/tickets/{id}/reopen
Role: STAFF, ADMIN

## Comments

### GET /api/tickets/{id}/comments
STUDENT receives PUBLIC only. STAFF/ADMIN receive all.

### POST /api/tickets/{id}/comments
Body: `{"content": "", "type": "PUBLIC"}` (STUDENT can only post PUBLIC)

## Dashboard

### GET /api/dashboard/student — Role: STUDENT
### GET /api/dashboard/staff — Role: STAFF
### GET /api/dashboard/admin — Role: ADMIN

## Categories

### GET /api/categories
### POST /api/categories — Role: ADMIN
### PUT /api/categories/{id} — Role: ADMIN

## SLA Policies

### GET /api/sla-policies
### PUT /api/sla-policies/{id} — Role: ADMIN

## Audit

### GET /api/audit — Role: ADMIN
Query params: page, size

## Admin

### POST /api/admin/escalations/run — Role: ADMIN
Triggers automatic escalation check.

## Error Format
```json
{
  "timestamp": "2026-09-25T10:00:00",
  "status": 409,
  "error": "CONFLICT",
  "message": "Ticket cannot transition from CLOSED to IN_PROGRESS",
  "path": "/api/tickets/42/transition"
}
```
