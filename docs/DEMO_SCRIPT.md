# Demo Script (10 Minutes)

## Step 1: Student Login (45 sec)
**WHAT TO SHOW**: Navigate to http://localhost:5173, login as student01@demo.com / password123.
**WHAT TO SAY**: The system supports three roles. We are logging in as a student who needs to raise a support request.
**WHY THIS WAY**: JWT-based authentication. After login, the token is stored and sent on every subsequent request. The React router redirects to the student dashboard based on the role returned in the login response.

## Step 2: Create Ticket (1 min)
**WHAT TO SHOW**: Go to Create Ticket. Fill in Title: "Certificate required for job application", Category: Certificates, Description, Requested Priority: HIGH.
**WHAT TO SAY**: The student provides context and requests a priority. Staff have the final say on actual priority. The requested priority gives staff an indication of urgency from the student's perspective.
**WHY THIS WAY**: Students should not set priority directly — they may over-escalate everything to CRITICAL. Requested priority is advisory.

## Step 3: Show Ticket Number (30 sec)
**WHAT TO SHOW**: After submission, the ticket detail page shows EDU-2026-000051 (or similar).
**WHAT TO SAY**: Human-readable ticket numbers are generated as EDU-YYYY-NNNNNN. The number is separate from the database primary key, uses a database sequence for uniqueness, and is easy to reference in conversations.

## Step 4: Login as Staff (30 sec)
**WHAT TO SHOW**: Logout, login as staff1@demo.com / password123. Staff dashboard shows unassigned tickets including the new ticket.
**WHAT TO SAY**: Staff see all unassigned tickets plus their own assigned tickets. The dashboard immediately shows workload.

## Step 5: Assign Ticket (30 sec)
**WHAT TO SHOW**: Open the ticket. Click "Assign to Me". Ticket moves to ASSIGNED.
**WHAT TO SAY**: Assignment creates an activity record and an audit log entry. The status transitions through the defined state machine.

## Step 6: Move to IN_PROGRESS (30 sec)
**WHAT TO SHOW**: Click "Start Work". Status changes to IN_PROGRESS.
**WHAT TO SAY**: Each status represents a real ownership state. IN_PROGRESS means staff is actively working on it.

## Step 7: Add Internal Note (30 sec)
**WHAT TO SHOW**: Add comment "Verified student record — ID number matches" with type INTERNAL.
**WHAT TO SAY**: Internal notes are visible only to staff and admin. This is enforced at the API level — the student API endpoint filters them out at the database query level, not with CSS.

## Step 8: PENDING_STUDENT (45 sec)
**WHAT TO SHOW**: Click "Request Information". Enter reason: "Please upload your identity proof document". Ticket moves to PENDING_STUDENT.
**WHAT TO SAY**: This pauses the SLA clock. Time in PENDING_STUDENT does not count toward the SLA because the student is responsible for the delay. The SLA deadline and active elapsed time are tracked separately.

## Step 9: Student Responds (45 sec)
**WHAT TO SHOW**: Login as student01. The dashboard shows "1 Pending Action". The ticket detail has a prominent amber banner: Action Required. Student types a reply and submits.
**WHAT TO SAY**: When the student adds a comment while the ticket is PENDING_STUDENT, the system automatically transitions the ticket back to IN_PROGRESS. This is a business rule in the service layer — not a frontend trick.

## Step 10: Staff Resolves (45 sec)
**WHAT TO SHOW**: Login as staff1. Ticket is IN_PROGRESS again. Click "Resolve". Enter resolution note: "Certificate issued and dispatched. Collection number: CERT-2026-4521".
**WHAT TO SAY**: Resolving requires a resolution note — this ensures quality and provides the student with a useful closure.

## Step 11: Admin Dashboard (1 min)
**WHAT TO SHOW**: Login as admin@demo.com. Admin dashboard with total counts, bar chart of tickets by category, pie chart by status.
**WHAT TO SAY**: All chart data comes from real database queries. No hardcoded numbers. The GET /api/dashboard/admin endpoint aggregates data server-side.

## Step 12: Activity and Audit (30 sec)
**WHAT TO SHOW**: Open the ticket we just resolved. Show the full activity timeline. Navigate to Audit Log page.
**WHAT TO SAY**: Every status change, comment, assignment, and priority change creates an immutable activity record. The audit log records actor, old value, and new value for sensitive changes.

## Step 13: Demonstrate Invalid Action (45 sec)
**WHAT TO SHOW**: In the API console or Swagger UI, try to POST /api/tickets/{id}/transition with targetStatus: "NEW" on a RESOLVED ticket.
**WHAT TO SAY**: The backend returns HTTP 409 CONFLICT with a clear message. Invalid transitions are rejected by the state machine in the service layer. This prevents data corruption.

## Step 14: Architecture Explanation (1 min)
**WHAT TO SHOW**: docs/ARCHITECTURE.md — the diagram.
**WHAT TO SAY**: Clean layered architecture. React SPA talks to Spring Boot REST API via JWT. Business logic lives in services, not controllers. PostgreSQL with Flyway migrations. Stateless backend — horizontally scalable.
