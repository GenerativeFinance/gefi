# GeFi - AI Financial Platform

## Overview
GeFi is a comprehensive AI-powered financial platform that enables developers to create and monetize AI financial models. It also provides investors with access to sophisticated financial analytics and risk management tools. The platform combines modern web technologies with machine learning to deliver real-time portfolio management, risk assessment, and market insights, aiming to be a central hub for AI in finance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with TypeScript schema definitions
- **Session Storage**: PostgreSQL-backed session store
- **Migrations**: Drizzle Kit

### Key Features
- **Authentication & Authorization**: Replit Auth, secure HTTP-only cookies, PostgreSQL-backed sessions, route-level protection.
- **Portfolio Management**: Real-time analytics, AI model integration for optimization, performance tracking.
- **AI Model Marketplace**: Discovery, subscription system, developer tools for model management, performance metrics.
- **Risk Management System**: Real-time monitoring, stress testing, VaR calculation, automated alerts.
- **Reporting & Analytics**: AI-generated market analysis, automated financial reporting, compliance tracking, custom dashboards.
- **Web3 & DeFi Integration**: Wallet connectivity, crypto holdings, DeFi positions, multi-chain support.
- **Smart Contracts**: Transparent revenue sharing and crowdfunding using Solidity.
- **Advanced Backtesting Environment**: Comprehensive testing platform for AI financial models with historical data analysis, performance metrics (Sharpe ratio, max drawdown, volatility, win rate), risk analysis (VaR, expected shortfall), trade tracking, and visual performance charts. Supports multiple data sources (Yahoo Finance, Alpha Vantage, IEX Cloud, Quandl) and configurable risk parameters.
- **Real-time Trading Platform**: Live market data via WebSockets, order management (market, limit, stop), position tracking.
- **Sentiment Visualizer**: AI-powered sentiment analysis across various asset classes with real-time updates.
- **Comprehensive User Profiles**: Role-specific profiles (Developer, Investor, Data Provider, Regulator, Admin, Moderator) with detailed information, performance metrics, and activity tracking.
- **Admin & Moderator Dashboards**: Dedicated pages for user management, content moderation, security, support, and analytics with role-based access control.
- **AI Chatbot System**: Intelligent conversation management with user profile detection, personalized recommendations, and adaptive questioning.
- **Advanced Data Provider Tools**: Dataset upload/management, financial tracking, collaboration platforms, compliance tools, and advanced trend analysis.

## Recent Updates (August 17, 2025)

### Account Creation & Calendly Integration
- **Chatbot Signup Account Creation**: Fully implemented `/api/auth/complete-chatbot-signup` endpoint that processes user preferences (experience level, platform intent, areas of focus) and creates pending accounts with proper role mapping (Expert → analyst, Intermediate → trader, Beginner → investor).
- **Calendly Demo Booking Integration**: Created `/demo-booking` page that redirects users to https://calendly.com/generativefinance after account creation, allowing them to schedule demos while waiting for account approval.
- **User Preference Processing**: Enhanced chatbot signup flow to capture and store comprehensive user data including finance areas of interest, company information, and platform usage intentions.
- **Pending Account Workflow**: All chatbot signups now create accounts with 'pending' status requiring admin approval before activation.

### Model Subscription & Funding Features
- **Model Subscription Management**: Added comprehensive subscription system with `/my-subscriptions` page for users to manage AI model subscriptions, including pause, resume, and cancel functionality.
- **Fund Models Platform**: Enhanced `/model-funding` page with full funding request management, contribution tracking, and investment opportunities for AI financial models.
- **Navigation Updates**: Added "Model Subscriptions" and "Fund Models" to mobile and desktop navigation menus for easy access.
- **Database Schema**: Created model_subscriptions, model_funding_requests, and model_funding_contributions tables to support subscription and funding operations.
- **API Endpoints**: Implemented RESTful APIs for subscription management (`/api/my-subscriptions`, `/api/subscriptions/:id/:action`) and funding operations.

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect authentication
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library
- **vite**: Build tool
- **typescript**: Language
- **drizzle-kit**: Database schema management
- **Web3Modal**: Web3 wallet connection
- **ethers.js**: Ethereum blockchain interaction
- **Recharts**: Charting library
- **Chart.js**: Charting library