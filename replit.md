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
  - Name, description, URL
  - Category and subcategory classification
  - Icon representation (Font Awesome classes)
  - Active status flag

### API Endpoints
- `GET /api/apps` - Retrieve all applications with optional search/filter parameters
- `GET /api/apps/:id` - Retrieve specific application
- `POST /api/apps` - Create new application
- `PATCH /api/apps/:id` - Update existing application
- `DELETE /api/apps/:id` - Delete application

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

## Recent Changes
- June 30, 2025: Added app preview functionality with favicon display and website information
- June 30, 2025: Initial setup with full-stack web application directory

## Changelog
- June 30, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.