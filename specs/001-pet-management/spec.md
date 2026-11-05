# Feature Specification: Veterinary Pet Management

**Feature Branch**: `001-pet-management`
**Created**: 2026-11-05
**Status**: Draft, pending team review
**Input**: Repository description ("A web application for managing pets, veterinary and appointments.") and GitHub issues #1 to #7.

## Project Overview

**Title**: Veterinary Pet Management

**Description**: A web application where pet owners can register, keep their pets' information in one place, and manage veterinary appointments.

**Purpose**: Replace scattered records and manual appointment tracking with a single place to see each pet and its upcoming visits.

**Target audience**: Pet owners. [NEEDS CLARIFICATION: Should veterinarians or clinic staff also have their own accounts in the MVP? This draft assumes they do not.]

**Assumptions to confirm with the team**:

- The MVP has one account type, the pet owner.
- Veterinarians are a read-only list that owners choose from when booking.
- Sign-in uses email and password.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Sign Up and Sign In (Priority: P1)

A visitor lands on the home page, creates an account, signs in, and signs out.

**Why this priority**: Every other feature stores data that belongs to a specific user.

**Independent Test**: Register a new account, sign out, sign back in, and confirm that private pages are only reachable while signed in.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** they open it, **Then** they see what the application does and links to sign in and register.
2. **Given** a visitor on the register page, **When** they submit a valid name, email, and password, **Then** an account is created and they are signed in.
3. **Given** an email that is already registered, **When** a visitor registers with it, **Then** registration is rejected with a clear message.
4. **Given** a registered user, **When** they submit correct credentials, **Then** they are signed in and sent to their pets page.
5. **Given** incorrect credentials, **When** they are submitted, **Then** sign-in fails with a message that does not reveal which field was wrong.
6. **Given** a signed-out visitor, **When** they open a private page, **Then** they are redirected to the sign-in page.

---

### User Story 2 - Manage Pets (Priority: P2)

A signed-in owner adds pets, views them, edits their details, and removes them.

**Why this priority**: Pets are the core record of the application, and appointments depend on them.

**Independent Test**: Sign in, then create, view, edit, and delete a pet. Confirm that a second user cannot see or change it.

**Acceptance Scenarios**:

1. **Given** a signed-in owner, **When** they submit a pet's required details, **Then** the pet appears in their list.
2. **Given** an owner with pets, **When** they open their pets page, **Then** they see only their own pets.
3. **Given** an existing pet, **When** the owner edits and saves it, **Then** the changes are shown.
4. **Given** an existing pet, **When** the owner confirms deletion, **Then** the pet and its appointments are removed.
5. **Given** another user's pet, **When** an owner tries to open or change it, **Then** access is denied.

---

### User Story 3 - Manage Appointments (Priority: P3)

A signed-in owner books a veterinary appointment for a pet, reviews upcoming appointments, reschedules, and cancels.

**Why this priority**: This is the main value of the application, but it requires accounts and pets first.

**Independent Test**: With a pet already created, book an appointment, reschedule it, and cancel it, and confirm that the list is correct after each step.

**Acceptance Scenarios**:

1. **Given** an owner with a pet, **When** they choose a pet, veterinarian, future date and time, and reason, **Then** the appointment is created as scheduled.
2. **Given** a date and time in the past, **When** the owner submits it, **Then** it is rejected with a clear message.
3. **Given** a veterinarian already booked at a date and time, **When** an owner selects the same slot, **Then** it is rejected and they are asked to pick another.
4. **Given** scheduled appointments, **When** the owner opens their appointments page, **Then** they see them in date order with pet and veterinarian names.
5. **Given** a scheduled appointment, **When** the owner reschedules or cancels it, **Then** the list shows the new date or the canceled status.

---

### User Story 4 - Manage Profile (Priority: P4)

A signed-in owner views and updates their personal information.

**Why this priority**: It is useful, but the core workflows work without it.

**Independent Test**: Edit the profile, reload the page, and confirm that the changes persist.

**Acceptance Scenarios**:

1. **Given** a signed-in owner, **When** they open their profile, **Then** they see their name, email, and phone number.
2. **Given** valid changes, **When** the owner saves them, **Then** the updated values are shown after reloading.
3. **Given** invalid values, **When** the owner saves them, **Then** nothing changes and the invalid fields are identified.

### Edge Cases

- A pet with appointments is deleted: its appointments are removed too, and the confirmation message says so.
- An owner has no pets: the appointment form prompts them to add a pet first.
- A session expires while a form is open: the user is sent to sign in, and nothing is saved.
- A request references a record that does not exist or belongs to someone else: the API returns an error and no data about that record.
- Two owners book the same slot at nearly the same time: only one booking succeeds.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a public home page that describes the application.
- **FR-002**: System MUST allow visitors to register with a name, email, and password.
- **FR-003**: System MUST require unique email addresses and MUST store passwords only as secure hashes.
- **FR-004**: Users MUST be able to sign in and sign out.
- **FR-005**: System MUST restrict private pages and API endpoints to signed-in users.
- **FR-006**: Owners MUST be able to create, view, update, and delete their own pets.
- **FR-007**: Owners MUST be able to create, view, reschedule, and cancel appointments for their own pets.
- **FR-008**: System MUST reject appointments in the past and double bookings of a veterinarian.
- **FR-009**: Users MUST be able to view and update their profile.
- **FR-010**: System MUST validate all input on the server and MUST prevent access to other users' data.
- **FR-011**: All views MUST work on mobile and desktop widths.
- **FR-012**: System MUST persist data in a relational database. [NEEDS CLARIFICATION: database and hosting provider not selected]
- **FR-013**: System MUST manage sessions securely. [NEEDS CLARIFICATION: authentication library or approach not selected]

### Key Entities

- **User**: A pet owner. Name, email, password hash, phone number. Has many pets.
- **Pet**: Name, species, breed, date of birth, notes. Belongs to one user and has many appointments.
- **Veterinarian**: Name, specialty, contact information. Has many appointments.
- **Appointment**: Date and time, reason, status (scheduled, completed, canceled). Belongs to one pet and one veterinarian.

### API Endpoints

Implemented as Route Handlers under `app/api/`. All endpoints except register and sign-in require a signed-in user, and all data is scoped to that user.

| Method | Endpoint                 | Purpose                             | Story |
| ------ | ------------------------ | ----------------------------------- | ----- |
| POST   | `/api/auth/register`     | Create an account                   | US1   |
| POST   | `/api/auth/login`        | Sign in                             | US1   |
| POST   | `/api/auth/logout`       | Sign out                            | US1   |
| GET    | `/api/pets`              | List the user's pets                | US2   |
| POST   | `/api/pets`              | Create a pet                        | US2   |
| GET    | `/api/pets/[id]`         | Get one pet                         | US2   |
| PATCH  | `/api/pets/[id]`         | Update a pet                        | US2   |
| DELETE | `/api/pets/[id]`         | Delete a pet and its appointments   | US2   |
| GET    | `/api/veterinarians`     | List veterinarians                  | US3   |
| GET    | `/api/appointments`      | List the user's appointments        | US3   |
| POST   | `/api/appointments`      | Book an appointment                 | US3   |
| PATCH  | `/api/appointments/[id]` | Reschedule or cancel an appointment | US3   |
| GET    | `/api/profile`           | Get the user's profile              | US4   |
| PATCH  | `/api/profile`           | Update the user's profile           | US4   |

### Implementation Priority

| Order | Work                                                    | Existing issue | Story |
| ----- | ------------------------------------------------------- | -------------- | ----- |
| 1     | Design the database tables for the key entities         | #2             | All   |
| 2     | Design the API and agree on request and response shapes | #7             | All   |
| 3     | Create the page and API routes                          | #3             | All   |
| 4     | Build the home view                                     | #1             | US1   |
| 5     | Build the register view and endpoint                    | #5             | US1   |
| 6     | Build the login view and endpoints                      | #4             | US1   |
| 7     | Pets create, read, update, and delete                   | Not created    | US2   |
| 8     | Appointment booking and management                      | Not created    | US3   |
| 9     | Build the profile view and endpoints                    | #6             | US4   |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new user can create an account and add their first pet in under 3 minutes.
- **SC-002**: An owner can book an appointment in under 1 minute once a pet exists.
- **SC-003**: In testing, no user can read or change another user's pets, appointments, or profile.
- **SC-004**: All views are usable without horizontal scrolling from 360 px wide up to desktop widths.
- **SC-005**: Every acceptance scenario in the P1 to P3 stories passes in a manual test before release.
