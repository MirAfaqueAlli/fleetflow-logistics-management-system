# FleetFlow - Logistics Management System

FleetFlow is a premium, high-fidelity Logistics Management System designed to streamline fleet operations, fleet maintenance, trip dispatching, and financial tracking for modern logistics companies.

## 🚀 Key Features

- **Fleet Registry**: Complete management of vehicles including model, license plates, and max load capacities.
- **Trip Dispatcher**: Real-time trip creation and tracking from origin to destination.
- **Maintenance Logs**: Automate service schedules and track repair costs for every vehicle.
- **Driver Performance**: Track safety scores, compliance rates, and duty status of your human resources.
- **Financial Analytics**: Deep insights into revenue, fuel costs, and net profit with one-click CSV/PDF exports.
- **Profile Settings**: Personalized user profiles with notification preferences and biography management.
- **Modern UI/UX**: Premium glassmorphism design with fluid animations (Framer Motion & GSAP).
- **Authentication**: Secure access via credentials or Google OAuth (Auth.js v5).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

## 📂 Project Structure

```text
├── prisma/               # Database schema and migration files
├── src/
│   ├── app/              # Next.js App Router (Routes & Pages)
│   │   ├── (dashboard)/  # Protected dashboard routes (Analytics, Expenses, etc.)
│   │   ├── api/          # Internal API routes (Auth)
│   │   ├── login/        # Sign-in page
│   │   ├── signup/       # Registration page
│   │   └── onboarding/   # Post-registration setup
│   ├── components/       # Reusable React components (UI & Layout)
│   ├── lib/              # Utility functions and shared logic
│   │   ├── actions/      # Next.js Server Actions (DB operations)
│   │   └── prisma.ts     # Prisma client singleton
│   ├── auth.ts           # NextAuth configuration
│   └── auth.config.ts    # NextAuth route protection rules
├── .env                  # Environment variables
└── package.json          # Project dependencies and scripts
```

## 🛣️ Navigation & Routes

### User Routes
- `/` - Dynamic Landing Page
- `/login` - Authentication Login
- `/signup` - New User Registration
- `/onboarding` - Role & Organization Setup (for new users)

### Dashboard Routes (Protected)
- `/dashboard` - Overview of fleet KPIs and live status
- `/vehicles` - Vehicle Registry management
- `/trips` - Trip Dispatcher & Live tracking
- `/maintenance` - Vehicle Service logs & Maintenance history
- `/expenses` - Fuel & Operational expense tracking
- `/performance` - Driver Safety Profiles & Performance metrics
- `/analytics` - Automated Financial Reports & ROI calculations
- `/profile` - Personal Settings & Notification preferences

## ⚡ Server Actions (API)

The project uses Next.js Server Actions for secure and fast data handling:

- `src/lib/actions/logistics.ts`: General trip and operational logic.
- `src/lib/actions/drivers.ts`: CRUD operations for driver profiles and status updates.
- `src/lib/actions/vehicles.ts`: Management of fleet vehicles and registry details.
- `src/lib/actions/auth.ts`: Authentication-related logic.

## ⚙️ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="your_postgresql_url"
AUTH_SECRET="your_nextauth_secret"
AUTH_GOOGLE_ID="your_google_id"
AUTH_GOOGLE_SECRET="your_google_secret"
```

### 3. Setup Database & Prisma
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Locally
```bash
npm run dev
```

## 📜 License
This project is for internal logistics management use. All rights reserved.
