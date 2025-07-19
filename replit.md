# ConstructScan - QR Points PWA

## Overview

ConstructScan is a Progressive Web Application (PWA) designed for the construction industry, allowing workers to scan QR codes on construction sites to earn points. The application features a mobile-first design with OTP-based authentication and real-time QR code validation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: Redux Toolkit with separate slices for authentication and QR code operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with hot module replacement
- **UI Components**: Radix UI primitives for accessibility
- **Mobile Experience**: PWA-ready with responsive design optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with centralized error handling
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Authentication System
- **OTP-based Login**: SMS-based verification using Indian mobile number format (+91)
- **Session Management**: Secure session storage with PostgreSQL
- **User Management**: Automatic user creation on first successful OTP verification

### QR Code System
- **Format Validation**: 32-character alphanumeric codes with specific point calculation rules
- **Point Calculation**: Points derived from first and last characters of QR code
- **Scanner Integration**: Camera-based QR scanning with real-time detection
- **Validation Flow**: Multi-step validation process with swipe-to-confirm interaction

### Mobile-First Design
- **PWA Features**: Manifest configuration for app-like experience
- **Responsive Layout**: Container-based design optimized for mobile screens
- **Touch Interactions**: Swipe gestures and touch-optimized UI components
- **Status Bar**: Custom status bar component for native app feel

### State Management
- **Auth Slice**: User authentication state, OTP handling, and profile management
- **QR Slice**: QR code scanning state, validation progress, and point tracking
- **Persistence**: Session-based state persistence for user data

## Data Flow

### Authentication Flow
1. User enters mobile number
2. System generates and stores 6-digit OTP with 5-minute expiration
3. User enters OTP for verification
4. System validates OTP and creates/retrieves user account
5. Session established for authenticated access

### QR Scanning Flow
1. User initiates camera-based QR scanning
2. Real-time QR code detection and format validation
3. Point calculation based on QR code structure
4. Swipe-to-confirm validation interface
5. Server-side validation and point allocation
6. User profile update with new point total

### Data Schema
- **Users**: ID, mobile number, total points, timestamps
- **QR Codes**: Unique ID, point values, scan status, timestamps
- **OTP Verifications**: Mobile number, OTP code, expiration, verification status

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query for server state
- **UI Framework**: Radix UI components, Tailwind CSS, Framer Motion for animations
- **Backend**: Express.js, Drizzle ORM, Neon database driver
- **Development**: Vite, TypeScript, ESBuild for production builds

### Database Integration
- **Drizzle ORM**: Type-safe database operations with schema validation
- **PostgreSQL**: Primary database with Neon serverless hosting
- **Session Store**: connect-pg-simple for PostgreSQL session management

### Authentication & Validation
- **Zod**: Runtime type validation for API requests and responses
- **React Hook Form**: Form state management with validation
- **OTP Generation**: Server-side OTP generation with cryptographic randomness

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with Express middleware
- **Type Safety**: Full TypeScript coverage across client and server
- **Development Tools**: Replit integration with runtime error overlay

### Production Build
- **Client Build**: Vite builds optimized React application to dist/public
- **Server Build**: ESBuild bundles Express server to dist/index.js
- **Static Assets**: Vite handles asset optimization and bundling
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Database Management
- **Schema Migrations**: Drizzle Kit for database schema management
- **Connection Pooling**: Neon serverless handles connection management
- **Development Data**: In-memory storage fallback for development/testing

### Mobile Deployment
- **PWA Manifest**: Configured for installation on mobile devices
- **Service Worker**: Ready for offline capabilities (can be extended)
- **Mobile Optimization**: Responsive design with touch-friendly interactions