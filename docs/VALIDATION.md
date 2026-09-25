# Validation Scenarios

| Scenario | Input | Expected | Notes |
|----------|-------|----------|-------|
| Empty ticket title | title: "" | 400 - title is required | Backend Bean Validation |
| Title too long | title: 201 chars | 400 - max 200 characters | Backend |
| Missing description | description: "" | 400 - description is required | |
| Description too short | description: 5 chars | 400 - min 20 characters | |
| Invalid category | categoryId: 99999 | 400 - category not found | |
| Invalid status transition | NEW → RESOLVED | 409 - CONFLICT | InvalidTransitionException |
| Student accesses another's ticket | GET /tickets/{otherId} | 403 | Service-level check |
| Staff assigns to inactive staff | staffId of inactive staff | 400 | |
| Close unresolved ticket | transition to CLOSED from IN_PROGRESS | 409 | CLOSED only from RESOLVED |
| Resolve without note | resolutionNote: "" | 400 | Required field |
| Reopen CLOSED ticket | transition CLOSED → IN_PROGRESS | 409 | CLOSED is terminal |
| Duplicate escalation | escalate already-ESCALATED ticket | 409 | |
| Double submit | rapid duplicate POST | Idempotent — second rejected | Button disabled on submit |
| SLA breach detected | ticket past slaDeadline | slaStatus: BREACHED | |
| SLA at risk | remaining ≤ 25% of SLA window | slaStatus: AT_RISK | |
| Pending student response | student comments on PENDING_STUDENT ticket | auto-transition to IN_PROGRESS | |
| Internal note visibility | student GET /tickets/{id}/comments | INTERNAL notes excluded | Backend query filter |
| Inactive category on historical ticket | GET ticket with inactive category | Returns ticket with category info | Soft delete |
| Unauthenticated request | no token | 401 | |
| Student accesses admin API | student → GET /api/audit | 403 | |
| Staff manages SLA policy | staff → PUT /api/sla-policies/{id} | 403 | ADMIN only |
