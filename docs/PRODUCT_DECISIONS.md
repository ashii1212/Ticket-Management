# Product Decisions

This document explains the product decisions made during implementation. These are candidate assumptions unless stated otherwise.

## Why Three Roles?
Student, Staff, Admin maps directly to the business problem. Students raise tickets, staff resolve them, admins oversee operations. A Manager role was considered but omitted to keep the MVP focused — admin covers management visibility.

## Why These Statuses?
NEW, ASSIGNED, IN_PROGRESS, PENDING_STUDENT, ESCALATED, RESOLVED, CLOSED. Each represents a distinct ownership state. PENDING_STUDENT is a core product feature — it clearly communicates that the ball is in the student's court. ESCALATED is separate from IN_PROGRESS to give management immediate visibility.

## Why These SLA Durations?
LOW=72h, MEDIUM=24h, HIGH=8h, CRITICAL=4h. These are product assumptions based on common support SLA practices for educational institutions. They are admin-configurable, so the institution can adjust them.

## SLA and PENDING_STUDENT Time
Time spent in PENDING_STUDENT status does NOT count toward the active SLA clock. Rationale: the delay is waiting for the student, not the staff. The system tracks activeMinutesElapsed to accumulate only non-pending time. Status history is retained in TicketActivity, so elapsed active time can be audited and explained.

## Why Internal Notes?
Staff need to collaborate and annotate without the student seeing sensitive or intermediate thoughts. Enforced at the backend query level — internal notes never appear in student-facing API responses.

## Why Cannot Close Unresolved Tickets?
Closing without resolving would hide tickets from dashboards without actually helping the student. A ticket must be RESOLVED (with a resolution note) before it can be CLOSED. This ensures resolution quality.

## Why Soft-Delete for Categories?
Categories referenced by historical tickets cannot be hard-deleted without orphaning data. Categories are deactivated instead. Inactive categories are not shown in the create-ticket form but remain on historical tickets.

## Why Audit Logs?
Sensitive changes (priority changes, escalations, staff assignments) need a tamper-resistant audit trail for accountability. AuditLog is separate from TicketActivity — activity is user-facing history, audit is administrator accountability.

## Why Closed Tickets Are Restricted?
RESOLVED → CLOSED is the final archival step. Closed tickets should not be routinely re-opened. The system allows RESOLVED → IN_PROGRESS (reopen) but CLOSED is terminal in this MVP.

## What Was Deliberately NOT Built?
- Email/SMS notifications
- File attachments
- Multi-tenancy
- Automated scheduled escalation (API-triggered instead)
- Mobile app
- Bulk operations
- Reporting export (CSV/PDF)
- Knowledge base / FAQ
- Chatbot integration

Reason: Focus on a strong, complete core workflow rather than a wide but shallow feature set.
