# WebStore Central

## Overview

WebStore Central is a web application directory/store built with a modern TypeScript full-stack architecture. It allows users to browse, search, filter, and review web applications across various categories (AI, Productivity, Design, Games, Development, Social, Other). The platform features an Apple-inspired design aesthetic with smooth animations and a clean, minimalist UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with CSS variables for theming, following an Apple-inspired design system
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for card animations and page transitions
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for input validation and response types
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with connect-pg-simple for PostgreSQL session storage

### Data Layer
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema Definition**: Drizzle schema in `shared/schema.ts` defining `apps` and `reviews` tables with relations
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions, TypeScript types, and Zod validation schemas
- `routes.ts`: API route definitions with path patterns, HTTP methods, input schemas, and response types

### Key Design Decisions

1. **Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories enables code sharing and type safety across the stack.

2. **Type-Safe API Layer**: Routes defined in `shared/routes.ts` with Zod schemas provide end-to-end type safety and runtime validation.

3. **Storage Abstraction**: `server/storage.ts` implements an `IStorage` interface with `DatabaseStorage` class, allowing for easy testing and potential storage backend changes.

4. **Build Process**: Custom build script (`script/build.ts`) uses esbuild for server bundling with selective dependency bundling to optimize cold start times.

5. **Component Library**: shadcn/ui components are copied into the codebase (not installed as a package) allowing full customization while maintaining a consistent design system.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- Tables: `apps`, `reviews` with foreign key relationships

### Third-Party Services
- **Google Favicons API**: Used to fetch app icons (`https://www.google.com/s2/favicons`)
- **Cheerio**: Server-side HTML parsing for URL scraping functionality

### Frontend Libraries
- **Radix UI**: Accessible, unstyled component primitives (dialog, dropdown, tabs, etc.)
- **TanStack Query**: Data fetching and caching
- **Framer Motion**: Animation library
- **date-fns**: Date formatting utilities
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend dev server and bundler
- **Drizzle Kit**: Database migration tooling
- **TypeScript**: Type checking across the entire codebase