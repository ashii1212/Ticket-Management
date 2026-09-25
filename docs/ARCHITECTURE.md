# Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React SPA)                     │
│  Vite + TypeScript + Tailwind + TanStack Query + Recharts   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS / REST (JSON)
                       │ JWT in Authorization header
┌──────────────────────▼──────────────────────────────────────┐
│                   Spring Boot 3.2 (Java 21)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Controllers (REST endpoints, thin, no logic)        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Services (business rules, SLA, state machine)      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Repositories (Spring Data JPA + Specifications)    │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│  Spring Security + JWT Filter                               │
│  MapStruct Mappers                                          │
│  Bean Validation                                            │
│  Global Exception Handler                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ JDBC
┌──────────────────────▼──────────────────────────────────────┐
│                    PostgreSQL 15                             │
│   Flyway migrations, indexes, FK constraints enforced       │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture
React SPA with file-based routing using React Router v6. State management via TanStack Query (server state) and React Context (auth state). All API calls through a centralized axios client with JWT interceptor. Forms use React Hook Form with Zod schemas. Charts backed by real API data from dashboard endpoints.

## Backend Architecture
Layered architecture: Controller → Service → Repository → PostgreSQL. Controllers are thin — they parse requests, call services, return responses. Services contain all business logic: ticket state machine, SLA calculation, SLA pause during pending, escalation logic, audit logging. Repository layer uses Spring Data JPA with Specifications for dynamic server-side filtering. DTOs map through MapStruct — entities are never exposed directly.

## Authentication
JWT-based stateless authentication. BCrypt password hashing. Token includes user ID, email, and role. JWT validated on every request by a filter in the Spring Security filter chain. Roles enforced at service layer — not just frontend.

## SLA Calculation
When a ticket is created, slaDeadline = createdAt + SlaPolicy.resolutionHours for the ticket's priority. As time passes, the system calculates active elapsed minutes (excluding PENDING_STUDENT time). SLA status: BREACHED if past deadline, AT_RISK if remaining time <= 25% of total SLA window, ON_TRACK otherwise.

## Ticket State Machine
```
NEW ──→ ASSIGNED ──→ IN_PROGRESS ──→ PENDING_STUDENT
                            ↑                │
                            └────────────────┘
                            │
                            ├──→ ESCALATED ──→ IN_PROGRESS
                            │
                            └──→ RESOLVED ──→ CLOSED
                                    │
                                    └──→ IN_PROGRESS (reopen)
```
Invalid transitions return HTTP 409 CONFLICT.

## Escalation
Manual escalation: POST /api/tickets/{id}/escalate (Staff/Admin).
Automatic escalation: POST /api/admin/escalations/run checks for SLA-breached tickets and auto-escalates them.
In production, this endpoint would be called by a scheduler (e.g., Spring @Scheduled, Kubernetes CronJob, or a message queue consumer). The API-trigger design makes it testable and observable without a running scheduler.

## Database
PostgreSQL with Flyway migrations. Foreign keys enforced. Indexes on status, priority, assigned_staff_id, category_id, created_at, sla_deadline for query performance. UUIDs were considered for IDs but Long was chosen for simplicity and join performance in this single-institution context.

## Testing Strategy
- Unit tests: JUnit 5 + Mockito for service layer business logic
- Integration tests: Spring Boot Test + H2 for controller and security tests
- Frontend: Vitest + React Testing Library for component and interaction tests
