# Feature Specification: Veterinary Pet Management

**Feature Branch**: `001-pet-management`
**Created**: 2026-11-05
**Updated**: 2026-11-11 (W03: clinic website, user roles, PostgreSQL)
**Status**: Draft, pending team review
**Input**: Repository description ("A web application for managing pets, veterinary and appointments."), GitHub issues #1 to #7, and W03 team decisions.

## Project Overview

**Title**: Veterinary Pet Management

**Clinic**: The app is the website and management system of one veterinary clinic, **PawHaven Veterinary Clinic**. The clinic is fictional and was created for this project. The app serves only this one clinic; it is not a multi-clinic platform.

**Description**: A web application where pet owners register their pets and book appointments, and where the clinic's veterinarians and receptionists manage those appointments.

**Purpose**: Replace scattered records, phone-only booking, and paper agendas with one system that the owners and the clinic staff share.

**Target audience and roles**:

| Role           | Who                         | How the account is created                             |
| -------------- | --------------------------- | ------------------------------------------------------ |
| `owner`        | Pet owners (clinic clients) | Self-registration with the public Register button      |
| `vet`          | Clinic veterinarians        | Created by an admin                                    |
| `receptionist` | Front-desk staff            | Created by an admin                                    |
| `admin`        | Clinic manager              | The first admin is created by the database seed script |

**Assumptions**:

- Public registration always creates an `owner`. The server never accepts a role from the registration form.
- Each user has exactly one role.
- All roles sign in on the same `/login` page and are sent to their own start page after signing in.
- Sign-in uses email and password.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Clinic Website, Sign Up, and Sign In (Priority: P1)

A visitor learns about the clinic on the home page, creates an owner account, and signs in. Staff members sign in on the same page and land on their own start page.

**Why this priority**: Every other feature depends on knowing who the user is and what role they have.

**Independent Test**: Register a new owner, sign out, and sign back in. Sign in with a seeded vet, receptionist, and admin account, and confirm that each one lands on its own start page and can't open the other roles' pages.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** they open it, **Then** they see the clinic's name, services, veterinarians, opening hours, address, and contact information, plus links to book an appointment and sign in.
2. **Given** a visitor on the register page, **When** they submit a valid name, email, and password, **Then** an `owner` account is created and they are signed in.
3. **Given** a registration request that includes a `role` field, **When** the server receives it, **Then** it ignores the field and creates an `owner`.
4. **Given** an email that is already registered, **When** a visitor registers with it, **Then** registration is rejected with a clear message.
5. **Given** correct credentials, **When** a user signs in, **Then** they are sent to their role's start page: owner → `/pets`, vet → `/schedule`, receptionist → `/front-desk`, admin → `/admin/staff`.
6. **Given** incorrect credentials, or an account that an admin has deactivated, **When** they are submitted, **Then** sign-in fails with a message that does not reveal which field was wrong.
7. **Given** a signed-out visitor, **When** they open a private page, **Then** they are redirected to the sign-in page.
8. **Given** a signed-in user, **When** they open a page or API endpoint for another role, **Then** access is denied.

---

### User Story 2 - Owner: Manage Pets (Priority: P2)

A signed-in owner adds pets, views them, edits their details, and removes them.

**Why this priority**: Pets are the core record of the application, and appointments depend on them.

**Independent Test**: Sign in as an owner, then create, view, edit, and delete a pet. Confirm that a second owner cannot see or change it.

**Acceptance Scenarios**:

1. **Given** a signed-in owner, **When** they submit a pet's required details, **Then** the pet appears in their list.
2. **Given** an owner with pets, **When** they open their pets page, **Then** they see only their own pets.
3. **Given** an existing pet, **When** the owner edits and saves it, **Then** the changes are shown.
4. **Given** an existing pet, **When** the owner confirms deletion, **Then** the pet and its appointments are removed.
5. **Given** another owner's pet, **When** an owner tries to open or change it, **Then** access is denied.

---

### User Story 3 - Owner: Book and Manage Appointments (Priority: P3)

A signed-in owner books an appointment for one of their pets, reviews upcoming appointments, reschedules, and cancels.

**Why this priority**: This is the main value for owners, but it requires accounts and pets first.

**Independent Test**: With a pet already created, book an appointment, reschedule it, and cancel it, and confirm that the list is correct after each step.

**Acceptance Scenarios**:

1. **Given** an owner with a pet, **When** they choose a pet, veterinarian, future date and time, and reason, **Then** the appointment is created as `scheduled`.
2. **Given** a date and time in the past, **When** the owner submits it, **Then** it is rejected with a clear message.
3. **Given** a veterinarian already booked at a date and time, **When** an owner selects the same slot, **Then** it is rejected and they are asked to pick another.
4. **Given** scheduled appointments, **When** the owner opens their appointments page, **Then** they see them in date order with pet and veterinarian names and their status.
5. **Given** a `scheduled` appointment, **When** the owner reschedules or cancels it, **Then** the list shows the new date or the `canceled` status.
6. **Given** an appointment that the clinic marked `completed` or `canceled`, **When** the owner views it, **Then** they see the new status and can no longer change it.

---

### User Story 4 - Veterinarian: Daily Schedule (Priority: P4)

A signed-in veterinarian sees the appointments assigned to them, reviews the pet's information, and marks each appointment as completed or canceled.

**Why this priority**: Without it, nobody can mark an appointment as completed, and vets still need a paper agenda.

**Independent Test**: Sign in as a vet with appointments today. Open the schedule, open one appointment, mark it completed with a note, cancel another, and confirm that the owner sees both new statuses.

**Acceptance Scenarios**:

1. **Given** a signed-in vet, **When** they open `/schedule`, **Then** they see only their own appointments for the selected day (today by default), in time order, with pet name, species, owner name, and reason.
2. **Given** an appointment in the schedule, **When** the vet opens it, **Then** they see the pet's details (species, breed, age, weight, notes) and the owner's contact information.
3. **Given** a `scheduled` appointment whose start time has passed, **When** the vet marks it completed, optionally with visit notes, **Then** its status becomes `completed`.
4. **Given** a `scheduled` appointment, **When** the vet cancels it, **Then** its status becomes `canceled` and the slot is free again.
5. **Given** an appointment assigned to another vet, **When** a vet tries to open or change it, **Then** access is denied.

---

### User Story 5 - Receptionist: Front Desk (Priority: P5)

A signed-in receptionist sees all of the clinic's appointments and books, reschedules, cancels, or completes appointments on behalf of owners (for example, when an owner calls by phone).

**Why this priority**: It covers clients who don't book online, but owners and vets can already use the system without it.

**Independent Test**: Sign in as a receptionist, find an existing owner, book an appointment for one of their pets, reschedule it, and confirm that the owner and the vet both see the change.

**Acceptance Scenarios**:

1. **Given** a signed-in receptionist, **When** they open `/front-desk`, **Then** they see all appointments for the selected day, which they can filter by veterinarian and status.
2. **Given** an owner's name or email, **When** the receptionist searches for it, **Then** they see matching owners and their pets.
3. **Given** an owner's pet, a veterinarian, and a free future slot, **When** the receptionist books it, **Then** the appointment is created as `scheduled`, and the owner sees it in their list.
4. **Given** any `scheduled` appointment, **When** the receptionist reschedules, cancels, or marks it completed, **Then** the same rules as for owners and vets apply (no past dates, no double booking, completed only after the start time).

---

### User Story 6 - Admin: Manage Staff (Priority: P6)

A signed-in admin creates and deactivates staff accounts and keeps the veterinarian list up to date.

**Why this priority**: Until this story is done, the seed script can create the staff accounts.

**Independent Test**: As an admin, create a vet account, sign in with it, then deactivate it and confirm that it can no longer sign in.

**Acceptance Scenarios**:

1. **Given** a signed-in admin, **When** they create a staff account with a name, email, temporary password, and role (`vet`, `receptionist`, or `admin`), **Then** the account can sign in.
2. **Given** a new `vet` account, **When** it is created, **Then** a veterinarian profile (specialty and short bio) is linked to it and shown on the home page and in the booking form.
3. **Given** an active staff account, **When** the admin deactivates it, **Then** it can no longer sign in.
4. **Given** a vet with future `scheduled` appointments, **When** the admin tries to deactivate them, **Then** the system blocks it until those appointments are reassigned or canceled.
5. **Given** the admin role, **When** an admin tries to create an `owner` account, **Then** it isn't offered (owners register themselves).

---

### User Story 7 - Manage Profile (Priority: P7)

Any signed-in user views and updates their personal information.

**Why this priority**: It is useful, but the core workflows work without it.

**Independent Test**: Edit the profile, reload the page, and confirm that the changes persist.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they open their profile, **Then** they see their name, email, and phone number.
2. **Given** valid changes, **When** the user saves them, **Then** the updated values are shown after reloading.
3. **Given** invalid values, **When** the user saves them, **Then** nothing changes and the invalid fields are identified.
4. **Given** any user, **When** they edit their profile, **Then** they cannot change their own role.

### Edge Cases

- A pet with appointments is deleted: its appointments are removed too, and the confirmation message says so.
- An owner has no pets: the appointment form prompts them to add a pet first.
- A session expires while a form is open: the user is sent to sign in, and nothing is saved.
- A request references a record that does not exist, belongs to someone else, or belongs to another role: the API returns an error and no data about that record.
- Two people (owners or a receptionist) book the same vet slot at nearly the same time: only one booking succeeds.
- A staff account is deactivated while signed in: their next request is rejected and they are signed out.
- A vet tries to mark a future appointment as completed: it is rejected.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a public home page for PawHaven Veterinary Clinic with its services, veterinarians, opening hours, address, and contact information.
- **FR-002**: System MUST allow visitors to register as owners with a name, email, and password.
- **FR-003**: System MUST require unique email addresses and MUST store passwords only as secure hashes.
- **FR-004**: Users of every role MUST be able to sign in and sign out on the same pages.
- **FR-005**: System MUST restrict private pages and API endpoints to signed-in users **with the right role** (see the permission matrix).
- **FR-006**: Public registration MUST always create an `owner`. Only an admin can create `vet`, `receptionist`, and `admin` accounts.
- **FR-007**: Owners MUST be able to create, view, update, and delete their own pets.
- **FR-008**: Owners MUST be able to create, view, reschedule, and cancel appointments for their own pets.
- **FR-009**: System MUST reject appointments in the past and double bookings of a veterinarian, for every role.
- **FR-010**: Vets MUST be able to view their own schedule and mark their appointments as completed (with optional notes) or canceled.
- **FR-011**: Receptionists MUST be able to view all appointments and book, reschedule, cancel, or complete appointments for any owner's pet.
- **FR-012**: Admins MUST be able to create and deactivate staff accounts and manage veterinarian profiles. Deactivated accounts MUST NOT be able to sign in.
- **FR-013**: Users MUST be able to view and update their profile but not their role.
- **FR-014**: System MUST validate all input on the server and MUST prevent access to data outside the user's role and ownership.
- **FR-015**: All views MUST work on mobile and desktop widths.
- **FR-016**: System MUST persist data in a PostgreSQL relational database (hosted on Neon), decided by the team in the W03 meeting.
- **FR-017**: System MUST manage sessions securely with signed, HTTP-only cookies that include the user's id and role (`jose`, following the Next.js authentication guide). The role MUST be checked again on the server for every request, not only in `proxy.ts`.

### Permission Matrix

| Action                                     | owner            | vet                                | receptionist     | admin |
| ------------------------------------------ | ---------------- | ---------------------------------- | ---------------- | ----- |
| View clinic home, vets list                | ✅               | ✅                                 | ✅               | ✅    |
| Create, edit, delete pets                  | Own pets         | ❌                                 | ❌               | ❌    |
| View pet details                           | Own pets         | Pets with an appointment with them | All              | ❌    |
| Book appointment                           | Own pets         | ❌                                 | Any owner's pet  | ❌    |
| Reschedule appointment                     | Own, `scheduled` | ❌                                 | Any, `scheduled` | ❌    |
| Cancel appointment                         | Own, `scheduled` | Own assigned                       | Any              | ❌    |
| Mark appointment completed (+ notes)       | ❌               | Own assigned                       | Any              | ❌    |
| View appointments                          | Own pets         | Assigned to them                   | All              | ❌    |
| Create/deactivate staff, edit vet profiles | ❌               | ❌                                 | ❌               | ✅    |
| Edit own profile                           | ✅               | ✅                                 | ✅               | ✅    |

### Key Entities

- **User**: Anyone who signs in. Name, email, password hash, phone number, role (`owner`, `vet`, `receptionist`, `admin`), active flag. An owner has many pets.
- **Pet**: Name, species, breed, sex, date of birth, weight, notes. Belongs to one owner and has many appointments.
- **Veterinarian**: Professional profile shown to the public: name, specialty, short bio, active flag. Linked to one `vet` user account. Has many appointments.
- **Appointment**: Date and time, reason, status (`scheduled`, `completed`, `canceled`), visit notes written by the vet, and the user who booked it. Belongs to one pet and one veterinarian.

### API Endpoints

Implemented as Route Handlers under `app/api/`. All endpoints except register, sign-in, and the public vets list require a signed-in user. Each endpoint checks the role and scopes the data according to the permission matrix.

| Method | Endpoint                 | Roles                    | Purpose                                                                | Story    |
| ------ | ------------------------ | ------------------------ | ---------------------------------------------------------------------- | -------- |
| POST   | `/api/auth/register`     | Public                   | Create an owner account                                                | US1      |
| POST   | `/api/auth/login`        | Public                   | Sign in (any role)                                                     | US1      |
| POST   | `/api/auth/logout`       | All                      | Sign out                                                               | US1      |
| GET    | `/api/veterinarians`     | Public                   | List active veterinarians (home page, booking form)                    | US1, US3 |
| GET    | `/api/pets`              | owner                    | List the owner's pets                                                  | US2      |
| POST   | `/api/pets`              | owner                    | Create a pet                                                           | US2      |
| GET    | `/api/pets/[id]`         | owner, vet, receptionist | Get one pet (scoped by role)                                           | US2, US4 |
| PATCH  | `/api/pets/[id]`         | owner                    | Update a pet                                                           | US2      |
| DELETE | `/api/pets/[id]`         | owner                    | Delete a pet and its appointments                                      | US2      |
| GET    | `/api/appointments`      | owner, vet, receptionist | List appointments (own, assigned, or all; filter by date, vet, status) | US3–US5  |
| POST   | `/api/appointments`      | owner, receptionist      | Book an appointment                                                    | US3, US5 |
| PATCH  | `/api/appointments/[id]` | owner, vet, receptionist | Reschedule, cancel, or complete (allowed changes depend on the role)   | US3–US5  |
| GET    | `/api/owners?query=`     | receptionist             | Search owners by name or email, with their pets                        | US5      |
| GET    | `/api/admin/staff`       | admin                    | List staff accounts                                                    | US6      |
| POST   | `/api/admin/staff`       | admin                    | Create a staff account (and vet profile for vets)                      | US6      |
| PATCH  | `/api/admin/staff/[id]`  | admin                    | Edit or deactivate a staff account                                     | US6      |
| GET    | `/api/profile`           | All                      | Get the user's profile                                                 | US7      |
| PATCH  | `/api/profile`           | All                      | Update the user's profile                                              | US7      |

### Implementation Priority

| Order | Work                                                               | Existing issue | Story |
| ----- | ------------------------------------------------------------------ | -------------- | ----- |
| 1     | Design the database tables, including roles                        | #2             | All   |
| 2     | Design the API and agree on request and response shapes            | #7             | All   |
| 3     | Create the page and API routes                                     | #3             | All   |
| 4     | Build the clinic home view                                         | #1             | US1   |
| 5     | Build the register view and endpoint                               | #5             | US1   |
| 6     | Build the login view and endpoints, with role redirects            | #4             | US1   |
| 7     | Pets create, read, update, and delete                              | Not created    | US2   |
| 8     | Owner appointment booking and management                           | Not created    | US3   |
| 9     | Vet schedule                                                       | Not created    | US4   |
| 10    | Receptionist front desk                                            | Not created    | US5   |
| 11    | Admin staff management (until then, the seed script creates staff) | Not created    | US6   |
| 12    | Build the profile view and endpoints                               | #6             | US7   |

### Future Scope (not in the MVP)

- Receptionists create owner accounts and pets for walk-in clients.
- Veterinarian working hours and fixed appointment slots.
- Full medical records (vaccinations, prescriptions, history).
- Email or SMS reminders.
- Several clinics on the same platform.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new owner can create an account and add their first pet in under 3 minutes.
- **SC-002**: An owner can book an appointment in under 1 minute once a pet exists.
- **SC-003**: A vet can open today's schedule and mark an appointment completed in under 30 seconds.
- **SC-004**: A receptionist can book an appointment for a caller in under 2 minutes.
- **SC-005**: In testing, no user can read or change data outside their role and ownership (permission matrix).
- **SC-006**: All views are usable without horizontal scrolling from 360 px wide up to desktop widths.
- **SC-007**: Every acceptance scenario in the P1 to P5 stories passes in a manual test before release.
