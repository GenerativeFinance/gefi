# GeFi - AI Financial Platform

## Overview

GeFi is a comprehensive AI-powered financial platform that enables developers to create and monetize AI financial models while providing investors with access to sophisticated financial analytics and risk management tools. The platform combines modern web technologies with machine learning capabilities to deliver real-time portfolio management, risk assessment, and market insights.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with TypeScript schema definitions
- **Session Storage**: PostgreSQL-backed session store
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication and Authorization
- **Provider**: Replit Auth integration with OpenID Connect
- **Session Management**: Secure HTTP-only cookies with PostgreSQL backing
- **User Management**: Complete user lifecycle with profile management
- **Authorization**: Route-level protection with middleware

### Portfolio Management
- **Real-time Analytics**: Live P&L tracking and performance metrics
- **Asset Distribution**: Risk-based allocation visualization
- **AI Model Integration**: Portfolio optimization using machine learning models
- **Performance Tracking**: Historical data and trend analysis

### AI Model Marketplace
- **Model Discovery**: Browse and search AI financial models
- **Subscription System**: Flexible pricing and access control
- **Developer Tools**: Model upload and management capabilities
- **Performance Metrics**: Model accuracy and return tracking

### Risk Management System
- **Real-time Monitoring**: Continuous risk assessment and alerts
- **Stress Testing**: Scenario-based risk analysis
- **VaR Calculation**: Value at Risk estimation
- **Alert System**: Automated notifications for risk thresholds

### Reporting and Analytics
- **Market Insights**: AI-generated market analysis and trends
- **Performance Reports**: Automated financial reporting
- **Compliance Tracking**: Regulatory compliance monitoring
- **Custom Dashboards**: Personalized analytics views

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating secure sessions
2. **Portfolio Data**: Real-time portfolio data flows from database to frontend via REST APIs
3. **AI Model Integration**: Models process portfolio data and return optimization suggestions
4. **Risk Assessment**: Continuous monitoring generates alerts and risk metrics
5. **Market Data**: External market data feeds into AI models for analysis
6. **Reporting**: Automated report generation based on portfolio and market data

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect authentication

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS

### Production Build
- **Frontend**: Vite build with optimized assets
- **Backend**: esbuild compilation for Node.js deployment
- **Static Assets**: Served from dist/public directory
- **Process Management**: PM2 or similar for production deployment

### Database Management
- **Schema Evolution**: Drizzle migrations for version control
- **Connection Pooling**: Neon serverless with automatic scaling
- **Backup Strategy**: Automated PostgreSQL backups via Neon

## Changelog

```
Changelog:
- June 28, 2025. Initial setup with comprehensive AI financial platform
- June 28, 2025. Enhanced marketplace with pricing tiers and subscription system
- June 28, 2025. Implemented comprehensive user analytics dashboard with Chart.js
  * Local storage analytics tracking (views, time spent, subscriptions)
  * Advanced Chart.js visualizations (line, bar, pie charts)
  * CSS Grid responsive layout with mobile optimization
  * Real-time metrics with KPI cards
  * Sample data generation for demonstration
  * Category-based analytics and top models tracking
- June 28, 2025. Completed comprehensive marketplace enhancements
  * Export functionality: CSV and PDF export for marketplace data using PapaParse and jsPDF
  * Enhanced error handling: Intelligent error states with helpful suggestions for empty results
  * Mobile responsiveness: Optimized grid layouts and filter arrangements for all screen sizes
  * User experience improvements: Better loading states, retry mechanisms, and popular model suggestions
  * Fixed notification banner infinite loop issue (temporarily disabled for debugging)
  * Type-safe export utilities with proper null handling and schema compatibility
- June 28, 2025. Implemented comprehensive user settings and theme system
  * Created ThemeProvider with light/dark mode toggle functionality
  * Built comprehensive settings page with all user parameters (profile, notifications, security, display, trading preferences)
  * Updated CSS variables for proper light/dark mode support
  * Integrated settings page with navigation header and routing system
  * Removed system preferences option as requested, keeping only light and dark modes
  * Added extensive user preference controls for notifications, privacy, security, and trading settings
- June 28, 2025. Built comprehensive Developer Dashboard for AI financial models
  * Complete model submission system with metadata, categories, and funding goals
  * Crowdfunding interface with progress tracking and investor management
  * Analytics overview with real-time metrics (models, funding, collaborators, deployments)
  * Multi-tab organization: Overview, My Models, Funding, Collaboration, Deployment
  * Status management through full lifecycle: draft → submitted → approved → testing → deployed
  * Interactive model cards with funding progress, collaborator counts, and test results
  * Database schema for developer models, funding, collaborators, versions, tests, chat, and rewards
- June 28, 2025. Implemented advanced backtesting environment for AI model development
  * Complete backtesting interface with configuration, results, analysis, and comparison tabs
  * Advanced Chart.js visualizations for performance tracking and drawdown analysis
  * Comprehensive metrics calculation: Sharpe ratio, max drawdown, win rate, profit factor
  * Real-time backtest monitoring with status tracking (running, completed, failed)
  * Historical data integration with multiple asset classes (stocks, crypto, forex)
  * Detailed trade analysis with position tracking and P&L calculation
  * Database schema for backtests, trades, performance data, and positions
  * Risk-adjusted performance metrics and benchmark comparison capabilities
- June 28, 2025. Added comprehensive Bounties and Learning sections to Developer dashboard
  * Implemented Bounties page with bounty board, filtering, and claim functionality
  * Created Learning center with tutorials, guides, workshops, projects, and certifications
  * Added navigation buttons to Developer dashboard header for Bounties and Learning
  * Enhanced Developer workflow with incentive system and skill development resources
  * Integrated progress tracking, difficulty levels, and content categorization
  * Built comprehensive UI for both bounty management and educational content discovery
- June 29, 2025. Fixed header navigation and search lightbox styling
  * Corrected header to display Developer navigation on Bounties and Learning pages
  * Updated route detection logic to include /bounties and /learning paths
  * Added proper navigation buttons for all four developer tools: Dashboard, Backtesting, Bounties, Learning
  * Enhanced search lightbox styling with improved dark theme appearance
  * Added backdrop blur, better borders, and proper input field styling for both desktop and mobile search dialogs
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```