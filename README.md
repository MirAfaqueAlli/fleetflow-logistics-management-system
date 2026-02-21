# FleetFlow — Modular Fleet & Logistics Management System

> A premium, rule-based digital hub that replaces manual logbooks by optimizing fleet lifecycle, driver safety compliance, and financial performance for modern logistics operations.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Target Users & RBAC](#-target-users--role-based-access-control)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Data Model](#-data-model)
- [Core Business Logic](#-core-business-logic)
- [Development Setup](#-development-setup)

---

## 🚀 Overview

FleetFlow is a full-stack logistics management platform built with **Next.js 15 App Router** and **Server Actions**. It provides a centralized, role-aware dashboard for managing the complete lifecycle of a delivery fleet — from vehicle intake to trip dispatch, maintenance scheduling, and financial analytics.

The UI is built with a **premium glassmorphism design system** featuring fluid animations powered by **Lenis smooth scroll**, **Framer Motion**, and **GSAP**, delivering a state-of-the-art user experience.

---

## 👥 Target Users & Role-Based Access Control

FleetFlow implements a full **two-layer RBAC** system — enforced at both the UI (sidebar visibility) and the server (page-level route guards via `requireRole()`).

| Page | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|------|:---:|:---:|:---:|:---:|
| Dashboard (KPI Overview) | ✅ | ✅ | ✅ | ✅ |
| Vehicle Registry | ✅ | ✅ | ✅ | ❌ |
| Trip Dispatcher | ✅ | ✅ | ❌ | ❌ |
| Maintenance Logs | ✅ | ❌ | ❌ | ✅ |
| Trip & Expense Tracking | ✅ | ❌ | ❌ | ✅ |
| Drivers & Performance | ✅ | ❌ | ✅ | ❌ |
| Analytics & Reports | ✅ | ❌ | ❌ | ✅ |

### Role Descriptions
- **Fleet Manager** — Full access. Oversees vehicle health, assets, scheduling, and all reports.
- **Dispatcher** — Creates trips, assigns drivers, and manages vehicle availability.
- **Safety Officer** — Monitors driver compliance, license expirations, and safety scores.
- **Financial Analyst** — Audits fuel spend, maintenance ROI, and operational costs.

> Unauthorized page access is redirected to `/dashboard?denied=1` with a visible "Access Denied" banner. The sidebar automatically hides links the user cannot access.

---

## ✨ Key Features

### 🏛️ Command Center (Dashboard)
- Live fleet KPIs: Active Fleet, Maintenance Alerts, Utilization Rate, Pending Cargo
- Searchable and filterable fleet status table (by Type, Status, Region)
- Animated access-denied banner for unauthorized redirect attempts

### 🚛 Vehicle Registry
- Full CRUD operations for fleet assets
- Fields: Name/Make, License Plate (unique), Max Load Capacity, Odometer, Vehicle Type
- Manual toggle for Out-of-Service (Retired) status

### 🗺️ Trip Dispatcher
- Trip creation with **capacity validation** (`CargoWeight ≤ MaxCapacity`)
- Driver and vehicle availability selection (filters out assigned/expired/suspended resources)
- Full trip lifecycle: `DRAFT → DISPATCHED → COMPLETED → CANCELLED`
- Real-time status tracking per trip

### 🔧 Maintenance & Service Logs
- Log repair services per vehicle with cost and date
- **Auto-Hide Rule**: Logging a repair automatically sets vehicle status to `IN_SHOP`, removing it from the dispatcher's available pool

### 💰 Trip & Expense Tracking
- Record fuel logs: Liters, Cost/Ltr, Date, Vehicle
- Track maintenance costs per vehicle
- Automated **Total Operational Cost** = Fuel + Maintenance per Vehicle ID

### 👤 Driver Performance & Safety Profiles
- License expiry tracking with visual expired warnings
- **Block Assignment Rule**: Drivers with expired licenses cannot be assigned to trips
- Safety Score display and complaint counter
- Status toggle: `ON_DUTY → OFF_DUTY → SUSPENDED`

### 📊 Operational Analytics
- 12-month revenue vs. cost trend chart (Recharts)
- Fleet ROI calculation: `(Revenue − (Maintenance + Fuel)) / Asset Value`
- Fleet utilization rate and costliest vehicles breakdown
- One-click CSV/PDF export

### 🔐 Authentication & Onboarding
- Email/password credentials + Google OAuth (Auth.js v5)
- Visual role selection onboarding with live access preview per role
- JWT session with role propagation

### 🎨 UI/UX
- Premium glassmorphism design system (`glass-panel`, liquid background blobs)
- **Lenis Smooth Scroll** — physics-based, buttery page scrolling
- GSAP ScrollTrigger animations on the landing page
- Framer Motion modal and page transitions
- Sticky sidebar with color-coded role badge
- `data-lenis-prevent` on all internal scroll containers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) — App Router, Server Actions, Server Components |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [PostgreSQL](https://www.postgresql.org/) (Neon serverless) |
| ORM | [Prisma](https://www.prisma.io/) with retry logic for cold-start tolerance |
| Auth | [Auth.js v5 (NextAuth)](https://authjs.dev/) — JWT strategy |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| Smooth Scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📂 Project Structure

```text
fleetflow-platform/
├── prisma/
│   ├── schema.prisma         # Data models, enums, relations
│   └── seed.ts               # Database seeder (optional)
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/      # Protected route group
│   │   │   ├── dashboard/    # Command Center (KPI overview)
│   │   │   ├── vehicles/     # Vehicle Registry
│   │   │   ├── trips/        # Trip Dispatcher
│   │   │   ├── maintenance/  # Service Logs
│   │   │   ├── expenses/     # Fuel & Cost Tracking
│   │   │   ├── performance/  # Driver Profiles
│   │   │   ├── analytics/    # Financial Reports
│   │   │   └── profile/      # User Settings
│   │   ├── onboarding/       # Role selection (post-signup)
│   │   ├── login/            # Sign-in page
│   │   ├── signup/           # Registration page
│   │   ├── layout.tsx        # Root layout (Providers, Toaster)
│   │   └── page.tsx          # Landing page (GSAP-animated)
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx   # RBAC-aware nav with role badge
│   │   │   ├── Header.tsx    # Top bar with theme toggle
│   │   │   └── KPICard.tsx   # Animated metric card
│   │   ├── ui/
│   │   │   └── CustomSelect.tsx  # Glassmorphic select dropdown
│   │   └── SmoothScrollProvider.tsx  # Lenis root wrapper
│   │
│   ├── lib/
│   │   ├── actions/
│   │   │   ├── logistics.ts  # Trips, vehicles (shared), expenses
│   │   │   ├── drivers.ts    # Driver CRUD + retry logic
│   │   │   ├── vehicles.ts   # Vehicle CRUD
│   │   │   └── auth.ts       # Role update action
│   │   ├── rbac.ts           # requireRole() server-side guard
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── mock-data.ts      # Status styling helpers
│   │
│   ├── providers.tsx         # Session + Theme + SmoothScroll providers
│   ├── auth.ts               # NextAuth config + Credentials + Google
│   └── auth.config.ts        # Middleware route protection + JWT callbacks
│
├── .env                      # Environment variables
└── package.json
```

---

## 🛣️ Pages & Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Animated landing page with GSAP hero, feature grid, how-it-works, and CTA |
| `/login` | Email/password + Google OAuth sign-in |
| `/signup` | New user registration |
| `/onboarding` | Interactive role selection with live access preview |

### Protected Dashboard Routes
| Route | Page | Accessible By |
|-------|------|--------------|
| `/dashboard` | Command Center | All roles |
| `/vehicles` | Vehicle Registry | Manager, Dispatcher, Safety Officer |
| `/trips` | Trip Dispatcher | Manager, Dispatcher |
| `/maintenance` | Service Logs | Manager, Financial Analyst |
| `/expenses` | Fuel & Expense | Manager, Financial Analyst |
| `/performance` | Driver Profiles | Manager, Safety Officer |
| `/analytics` | Financial Reports | Manager, Financial Analyst |
| `/profile` | User Settings | All roles |

---

## 🗄️ Data Model

```prisma
model User    { id, name, email, password, role: Role, ... }
model Vehicle { id, name, licensePlate, model, maxLoadCapacity, odometer, status: VehicleStatus, trips[], expenses[], maintenanceLogs[] }
model Driver  { id, name, licenseNumber, licenseExpiry, category, status: DriverStatus, safetyScore, complaints, trips[] }
model Trip    { id, vehicle, driver, origin, destination, cargoWeight, status: TripStatus, ... }
model MaintenanceLog { id, vehicle, serviceType, cost, date }
model Expense { id, vehicle, type: FUEL|MAINTENANCE, cost, liters?, date }

enum Role           { NONE, MANAGER, DISPATCHER, SAFETY_OFFICER, FINANCIAL_ANALYST }
enum VehicleStatus  { AVAILABLE, ON_TRIP, IN_SHOP, RETIRED }
enum DriverStatus   { ON_DUTY, OFF_DUTY, SUSPENDED, RETIRED }
enum TripStatus     { DRAFT, DISPATCHED, COMPLETED, CANCELLED }
```

---

## ⚙️ Core Business Logic

| Rule | Description |
|------|-------------|
| **Capacity Guard** | Trip creation blocked if `cargoWeight > vehicle.maxLoadCapacity` |
| **License Compliance** | Drivers with expired licenses are blocked from dispatch and flagged in the UI |
| **Auto-Hide Rule** | Logging a maintenance service sets vehicle status to `IN_SHOP`, hiding it from the trip dispatcher |
| **RBAC Guard** | `requireRole()` on every server page; sidebar hides unauthorized links client-side |
| **DB Retry Logic** | All Prisma operations wrapped in `withRetry()` (3 attempts, 3s delay) to handle Neon cold-starts |
| **Status Cascade** | On trip dispatch: Vehicle → `ON_TRIP`; On completion: Vehicle → `AVAILABLE` |

---

## ⚡ Server Actions

| File | Actions |
|------|---------|
| `lib/actions/logistics.ts` | `getTrips`, `createTrip`, `updateTripStatus`, `getExpenses`, `createExpense`, `getVehicles`, `getAvailableVehicles`, `getAvailableDrivers`, `logMaintenance` |
| `lib/actions/drivers.ts` | `getDrivers`, `createDriver`, `updateDriverStatus`, `deleteDriver`, `seedDrivers` |
| `lib/actions/vehicles.ts` | `getVehicles`, `createVehicle`, `deleteVehicle`, `toggleVehicleRetired`, `seedVehicles` |
| `lib/actions/auth.ts` | `updateUserRole` |
| `lib/rbac.ts` | `requireRole(allowedRoles[])` |

---

## ⚙️ Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/MirAfaqueAlli/fleetflow-logistics-management-system.git
cd fleetflow-logistics-management-system
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require&connect_timeout=60&pool_timeout=60"
AUTH_SECRET="your-nextauth-secret-min-32-chars"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
```

### 3. Set Up Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. (Optional) Seed with Mock Data
Navigate to `/vehicles` or `/performance` in the app and click **"Add Mock Data"** — the UI provides a one-click seeder button when the database is empty.

---

## 📜 License

This project is built for academic/portfolio demonstration of a rule-based fleet logistics management system. All rights reserved © 2026 FleetFlow.
