# Web Application Directory

## Overview

This is a full-stack web application directory that allows users to manage and access various web applications through a centralized dashboard. The system provides functionality to create, read, update, and delete web applications with categorization and search capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Validation**: Zod for runtime type checking
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Data access layer
│   └── vite.ts          # Development server setup
├── shared/              # Shared types and schemas
└── migrations/          # Database migration files
```

## Key Components

### Data Models
- **Users**: Basic user authentication system with username/password
- **WebApps**: Core entity representing web applications with metadata including:
  - Name, rich text description, URL
  - Category and subcategory classification
  - Icon representation (Font Awesome classes)
  - Active status flag
  - File attachments array (supports DOC, DOCX, PDF, TXT, RTF)

### API Endpoints
- `GET /api/apps` - Retrieve all applications with optional search/filter parameters
- `GET /api/apps/:id` - Retrieve specific application
- `POST /api/apps` - Create new application
- `PATCH /api/apps/:id` - Update existing application
- `DELETE /api/apps/:id` - Delete application
- `POST /api/upload` - Upload file attachments (supports DOC, DOCX, PDF, TXT, RTF)
- `GET /api/files/:filename` - Download uploaded files

### Frontend Pages
- **Dashboard**: Main interface displaying application cards with search and filtering
- **Admin Panel**: Management interface for CRUD operations on applications
- **404 Page**: Error handling for unknown routes

### Storage Strategy
Currently implements in-memory storage with file persistence for development. The storage layer is abstracted through an interface to support easy migration to database storage.

## Data Flow

1. **Application Load**: React app initializes with TanStack Query client
2. **Data Fetching**: Components use custom hooks that wrap TanStack Query
3. **API Communication**: HTTP requests through centralized apiRequest utility
4. **State Management**: Server state cached and synchronized via React Query
5. **Form Handling**: React Hook Form with Zod validation before API submission
6. **UI Updates**: Optimistic updates and cache invalidation for responsive UX

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component library
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **@tiptap/react**: Rich text editor for descriptions
- **multer**: File upload handling middleware

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: JavaScript bundler for production builds

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)

### Scripts
- `dev`: Development server with hot reloading
- `build`: Production build for both frontend and backend
- `start`: Production server startup
- `db:push`: Apply database schema changes

## Changelog
- July 1, 2025: Implemented professional typography with Helvetica Neue for body text and ITC Charter/Crimson Text for headers
- July 1, 2025: Added short description feature with optional field in forms, card display priority, and search functionality
- July 1, 2025: Added professional footer with PwC branding, links, and company information
- July 1, 2025: Implemented flex layout to ensure footer stays at bottom of page
- July 1, 2025: Created responsive footer with grid layout and proper typography
- July 1, 2025: Redesigned app details modal with modern full-width layout and gradient header design
- July 1, 2025: Enhanced modal with improved visual hierarchy, card-based sections, and better content organization
- July 1, 2025: Added decorative elements and responsive grid layout for optimal viewing experience
- July 1, 2025: Added view details modal accessible via eye icon button on each application card
- July 1, 2025: Implemented comprehensive app details modal showing full description, documents, and launch link
- July 1, 2025: Enhanced application cards with hover-revealed details button for better UX
- July 1, 2025: Added document viewing functionality with clickable file attachments on application cards
- July 1, 2025: Enhanced file upload component with improved UI, file type icons, and view/download capabilities
- July 1, 2025: Implemented file viewing buttons on application cards with proper file type recognition and styling
- July 1, 2025: Refined application cards to be more compact with improved space utilization and PwC brand alignment
- July 1, 2025: Updated grid layout to display more cards per row (up to 5 columns on large screens) for better content density
- July 1, 2025: Enhanced text truncation with line-clamp utilities and optimized typography for readability
- July 1, 2025: Enhanced application filters with modern PwC-compliant design including gradient accents and improved form controls
- July 1, 2025: Completely redesigned application cards with contemporary styling, hover effects, and enhanced visual hierarchy
- July 1, 2025: Modernized empty state with gradient backgrounds, improved messaging, and branded styling
- July 1, 2025: Updated UI to modern PwC branding with orange color scheme and removed sidebar
- July 1, 2025: Implemented new header navigation with PwC logo and responsive design
- July 1, 2025: Added gradient hero sections with PwC orange-to-dark orange styling
- January 1, 2025: Added rich text editor for descriptions using TipTap
- January 1, 2025: Added file upload functionality for DOC, DOCX, PDF, TXT, RTF files
- January 1, 2025: Enhanced app cards to display rich text content and file attachment counts
- January 1, 2025: Restricted app creation/editing to Admin Panel only
- June 30, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.