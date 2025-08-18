# GeFi - AI Financial Platform

## Overview
GeFi is a comprehensive AI-powered financial platform designed for developers to create and monetize AI financial models, and for investors to access advanced financial analytics and risk management tools. It integrates modern web technologies with machine learning to offer real-time portfolio management, risk assessment, and market insights. The platform aims to become a central hub for AI in finance, providing capabilities for model marketplace, robust risk management, AI-generated reporting, and Web3/DeFi integration with smart contracts for revenue sharing.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints

### Data Storage
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with TypeScript schema definitions
- **Session Storage**: PostgreSQL-backed session store
- **Migrations**: Drizzle Kit

### Key Features
- **Authentication & Authorization**: Secure user authentication and role-based access control.
- **Portfolio Management**: Real-time analytics and AI model integration for optimization.
- **AI Model Marketplace**: Discovery, subscription, and developer tools for model management.
- **Risk Management System**: Real-time monitoring, stress testing, and VaR calculation.
- **Reporting & Analytics**: AI-generated market analysis and automated financial reporting.
- **Web3 & DeFi Integration**: Wallet connectivity and multi-chain support for crypto assets.
- **Smart Contracts**: Transparent revenue sharing and crowdfunding using Solidity.
- **Advanced Backtesting Environment**: Comprehensive testing for AI financial models with historical data and performance metrics.
- **Real-time Trading Platform**: Live market data via WebSockets and order management.
- **Sentiment Visualizer**: AI-powered sentiment analysis across asset classes.
- **Comprehensive User Profiles**: Role-specific profiles for various user types.
- **Admin & Moderator Dashboards**: Tools for user management, content moderation, and analytics.
- **AI Chatbot System**: Intelligent conversation management with personalized recommendations.
- **Advanced Data Provider Tools**: Dataset upload/management and compliance tools.
- **PDF Report Generation System**: Background processing for generating executive-quality financial reports.
- **Account Creation & Calendly Integration**: Streamlined user signup with pending account workflow and demo booking.
- **Model Subscription & Funding**: Features for managing AI model subscriptions and funding requests.
- **Error Handling**: Comprehensive error boundary implementation and defensive data access.
- **Profile Compatibility**: Defensive user lookup strategies for multiple authentication providers.

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