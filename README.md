# Edumerge Student Support & Ticket Management

A complete ticket management system for educational institutions.

## Problem
Students raise support requests for fees, attendance, ID cards, certificates, documents, examinations, and administrative matters. Staff need to own, track, and resolve these in a structured workflow.

## Solution
A full-stack web application with role-based access (Student / Staff / Admin), a defined ticket lifecycle state machine, SLA tracking, activity history, escalation management, and reporting dashboards.

## Features
- Role-based access: Student, Staff, Admin
- Ticket lifecycle state machine (NEW → CLOSED)
- SLA policies configurable per priority
- SLA pause during PENDING_STUDENT status
- Activity timeline per ticket
- Internal notes (hidden from students)
- Escalation (manual and automated)
- Admin dashboards with real charts
- Ageing buckets and SLA status indicators
- Audit log for sensitive changes
- Human-readable ticket numbers (EDU-2026-000001)

## Tech Stack
- **Backend**: Java 21, Spring Boot 3.2, Spring Security + JWT, Spring Data JPA, PostgreSQL, Flyway, MapStruct
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod, Recharts
- **Testing**: JUnit 5, Mockito, Spring Boot Test, Vitest, React Testing Library
- **Infrastructure**: Docker, Docker Compose

## Architecture
See docs/ARCHITECTURE.md

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Java 21 (for local dev)
- Node.js 20+ (for local dev)

### Using Docker Compose (Recommended)
```bash
git clone <repo>
cd Ticket-Management
docker-compose up --build
```
Frontend: http://localhost:5173
Backend/API: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

### Local Development

**Backend:**
```bash
cd backend
# Set environment variables or use defaults
export DATABASE_URL=jdbc:postgresql://localhost:5432/edumerge_support
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=postgres
export JWT_SECRET=your-secret-key
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Demo Credentials (Development Only)

⚠️ These are development-only credentials. Never use in production.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Staff | staff1@demo.com | password123 |
| Staff | staff2@demo.com | password123 |
| Student | student01@demo.com | password123 |
| Student | student02@demo.com | password123 |

## Environment Variables

| Variable | Description | Default (Dev) |
|----------|-------------|---------------|
| DATABASE_URL | PostgreSQL JDBC URL | jdbc:postgresql://localhost:5432/edumerge_support |
| DATABASE_USERNAME | DB username | postgres |
| DATABASE_PASSWORD | DB password | postgres |
| JWT_SECRET | JWT signing secret | dev-only-default |

## Database
PostgreSQL. Migrations managed by Flyway in `backend/src/main/resources/db/migration/`.

## Seed Data
Flyway V5 migration seeds realistic data:
- 1 admin, 5 staff, 20 students
- 10 ticket categories
- SLA policies (LOW=72h, MEDIUM=24h, HIGH=8h, CRITICAL=4h)
- 50 tickets in various states including SLA-breached and at-risk

## Tests

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
npm test
```

## API
See docs/API.md or visit http://localhost:8080/swagger-ui.html

## Assumptions
See docs/PRODUCT_DECISIONS.md

## Limitations
- Email notifications not implemented (noted as future work)
- Scheduled escalation job is triggered via API endpoint POST /api/admin/escalations/run instead of a cron scheduler (documented in ARCHITECTURE.md)
- File attachments not implemented
- No multi-tenancy (single institution)
