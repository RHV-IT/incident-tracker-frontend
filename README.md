# Incident Tracker

A production-ready incident management system built with Next.js, designed for workplace safety and technical incident reporting and tracking.

## Features

- **Incident Reporting**: View, manage, and track workplace safety incidents
- **User Authentication**: Secure login/logout with JWT token management
- **User Management**: Admin panel for registering and managing user accounts
- **Role-Based Access**: Multi-tier role system (Reporter, Supervisor, Admin, Super Admin)
- **Severity Classification**: Incident levels (Near Miss, Minor, Major, Critical) with color-coded badges
- **User Status Management**: Enable/disable user accounts (Super Admin only)
- **Password Override**: Administrative password reset capability (Super Admin only)
- **Pagination**: Efficient incident list browsing with pagination controls
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Collapsible Sidebar**: Smooth transition sidebar with role-based navigation

## Project Structure

```
incidenttracker/
├── app/
│   ├── (auth)/login/page.tsx       # Authentication page
│   ├── (dashboard)/                # Protected routes
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Incident listing & management
│   │   │   ├── register/page.tsx   # User registration
│   │   │   ├── users/page.tsx      # User access management (Super Admin)
│   │   │   └── resetpassword/page.tsx # Password override (Super Admin)
│   │   └── layout.tsx              # Dashboard layout with sidebar navigation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Public incident reporting landing page
├── components/ui/                  # shadcn/ui component library
├── lib/utils.ts                    # Utility functions (cn helper)
├── app/(dashboard)/types/navTypes.ts # Navigation type definitions
├── package.json
├── tsconfig.json
├── postcss.config.mjs              # PostCSS/Tailwind configuration
├── next.config.ts                  # Next.js configuration
├── eslint.config.mjs               # ESLint configuration
├── components.json                 # shadcn/ui configuration
└── favicon.ico                     # Application icon
```

## Navigation

The application has two main navigation areas:

**Public Landing Page (`/`)**
- Incident reporting form for staff to submit new incidents
- Links to login and dashboard (if authenticated)

**Dashboard Sidebar (Protected Routes)**
- **View Incidents**: Main incident listing page
- **Report an Incident**: Incident submission page
- **Add User** (Super Admin): User registration
- **Users** (Super Admin): User access management
- **Reset Password** (Super Admin): Password override terminal

Sidebar features collapsible design with smooth transitions and role-based menu items.

## Authentication Flow

The application uses a protected route structure:
- `/login` - Public authentication page (in `(auth)` layout)
- `/dashboard/*` - Protected routes (in `(dashboard)` layout with sidebar navigation)

Login page includes a link to report an incident publicly.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

This application requires the following environment variable:

- `NEXT_PUBLIC_apiurl` - The base URL of your backend API server

## API Integration

The frontend integrates with a backend API providing endpoints for:

- `GET /incidents` - Fetch paginated incident reports
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration (authenticated)
- `GET /user?email={email}` - Search user by email
- `PUT /auth/{enable|disable}` - Toggle user account status
- `PUT /auth/resetpassword` - Reset user password

## Roles & Permissions

| Role | Dashboard Access | Register Users | Manage Users | Password Reset |
|------|-----------------|----------------|--------------|----------------|
| Reporter | ✓ | ✗ | ✗ | ✗ |
| Supervisor | ✓ | ✗ | ✗ | ✗ |
| Admin | ✓ | ✓ | ✗ | ✗ |
| Super Admin | ✓ | ✓ | ✓ | ✓ |

## Incident Data Structure

Each incident report includes:
- Reporter details (name, department, position, contact info)
- Incident timing (date, time)
- Location and type classification
- People involved
- Description and immediate actions taken
- Injury/damage assessment
- Severity level and recommended preventive actions

**Note**: The public reporting form is configured for hospital/staff use (e.g., "RHV Hospital Incident Reporting Form").

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [shadcn/ui](https://ui.shadcn.com/) - component library used in this project.

## Dependencies

Key dependencies include:
- `next` - React framework for production-ready applications
- `react` / `react-dom` - UI library
- `lucide-react` - Icon library
- `radix-ui` - Primitive UI components
- `sonner` - Toast notifications
- `next-themes` - Dark mode support
- `tailwind-merge` / `tw-animate-css` - Styling utilities

## Styling

This project uses:
- Tailwind CSS for utility-first styling
- CSS variables for theme customization
- Dark mode support via `next-themes`

## UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) primitive components:
- **Dialog**: Modal overlays for incident detail views
- **Alert**: Error and success message displays
- **Card**: Content containers with header/content/footer structure
- **Button**: Interactive actions with variants (default, outline, destructive)
- **Input**: Text and email form fields
- **Label**: Form field labels
- **Select**: Dropdown selection for roles and severity levels
- **Table**: Incident listing with pagination
- **Textarea**: Multi-line text input for descriptions
- **Toast**: Notifications via `sonner`
- Custom styling with Tailwind CSS

## Development Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

## TypeScript

This project uses TypeScript with strict mode enabled. Key type definitions:
- `SeverityLevel` - Incident severity classification
- `IncidentReport` - Complete incident data structure
- `UserProfile` - User account structure
- `NavigationItem` - Sidebar navigation configuration