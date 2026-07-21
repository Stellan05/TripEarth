# Travel Atlas — Development Workflow

> Version: v1.0
> Status: Development Guide
> Purpose:
> This document defines the execution order of the project.
> Claude Code must always follow this workflow.
> Never skip phases unless explicitly instructed.

---

# Global Rules

Before starting any phase:

- Read DEVELOPMENT_SPEC.md
- Read DEVELOPMENT_PLAN.md
- Understand existing project structure
- Never rewrite completed modules without reason
- Finish one phase before entering the next
- Each phase must pass self-review before continuing

---

# Phase 0 — Project Initialization

Goal

Prepare the project for development.

Tasks

- Verify project structure
- Verify dependencies
- Verify routing
- Verify TypeScript configuration
- Verify Vite configuration
- Verify backend configuration
- Verify environment variables
- Verify build passes

Deliverables

✅ Project runs successfully

---

# Phase 1 — Foundation

Goal

Build the design foundation.

Tasks

- Theme System
- Color Tokens
- Typography
- Spacing
- Radius
- Shadow
- Animation Tokens
- Global CSS
- Icon Library

Deliverables

✅ Complete design token system

---

# Phase 2 — Base Components

Goal

Build reusable UI components.

Components

- BaseButton
- BaseCard
- BaseInput
- BaseTextarea
- BaseModal
- BaseChip
- BaseBadge
- Loading
- EmptyState
- ConfirmDialog
- Toast

Requirements

- Fully typed
- Reusable
- Responsive-ready
- Theme support

Deliverables

✅ Base Component Library

---

# Phase 3 — Business Components

Goal

Build domain-specific reusable components.

Components

Globe

- Globe3D
- CountryPolygon
- GlobeTooltip

Trip

- TripCard
- TripMiniCard
- FlightCard
- TimelineStrip

Photo

- PhotoGrid
- PhotoCard
- PhotoUploader

Map

- CountryMap
- RouteMap
- CityMarker
- RouteLine

Deliverables

✅ Business Component Library

---

# Phase 4 — Layout

Tasks

- Navigation
- Page Layout
- Global Header
- Global Transition
- Theme Switch

Deliverables

✅ Complete Layout System

---

# Phase 5 — API Layer

Tasks

Create

- Axios Client
- API Modules
- Error Handler
- Upload Service
- Type Definitions

Do NOT implement business pages.

Deliverables

✅ API Layer

---

# Phase 6 — State Management

Tasks

- appStore
- tripStore
- countryStore
- wishlistStore

Deliverables

✅ Pinia completed

---

# Phase 7 — Trip Editor

Goal

Develop the data entry page first.

Tasks

- Trip Form
- Route Editor
- Flight Editor
- Photo Upload
- Markdown Notes

Deliverables

✅ Can create trips

---

# Phase 8 — Globe Home

Tasks

- Globe
- Statistics
- Recent Trips
- Navigation

Deliverables

✅ Homepage completed

---

# Phase 9 — Country Detail

Tasks

- Country Information
- Map
- Photos
- Trips

Deliverables

✅ Country page completed

---

# Phase 10 — Trip Detail

Tasks

- Route Map
- Flight
- Gallery
- Notes

Deliverables

✅ Trip detail completed

---

# Phase 11 — Wishlist

Tasks

- Destination Cards
- Category
- Search

Deliverables

✅ Wishlist completed

---

# Phase 12 — Backend

Tasks

Implement

- Controllers
- Services
- Mapper
- Database
- Upload

Deliverables

✅ REST API completed

---

# Phase 13 — Integration

Tasks

Replace all Mock APIs

Connect Frontend and Backend

Deliverables

✅ Full-stack integration completed

---

# Phase 14 — Testing

Tasks

- Functional Testing
- UI Review
- Performance Review
- Error Handling
- Edge Cases

Deliverables

✅ Stable MVP

---

# Phase 15 — Optimization

Tasks

- Animation
- Performance
- Accessibility
- SEO
- Code Cleanup
- Refactoring

Deliverables

✅ Production Ready

---

# Completion Rule

Claude Code must:

- Finish only ONE phase at a time.
- Never implement future phases early.
- Review current phase before moving on.
- Keep all code consistent with DEVELOPMENT_SPEC.md.
- Follow DEVELOPMENT_PLAN.md for priorities.