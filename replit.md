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
- June 29, 2025. Created comprehensive legal and compliance pages with footer integration
  * Built Terms of Service page with complete legal framework and user responsibilities
  * Created Data Processing Agreement with GDPR compliance details and security measures
  * Developed Security Compliance page showcasing SOC 2, ISO 27001, and enterprise security features
  * Implemented Bug Bounty Program page with reward structure and submission guidelines
  * Added Enterprise Sales contact page with lead generation form and enterprise features
  * Updated footer navigation to properly link to all legal and compliance pages
  * Added Home button to developer navigation for easy return to main platform
  * Integrated all new pages into routing system for proper accessibility
- June 29, 2025. Enhanced PDF report generation and removed Home from developer navigation
  * Fixed PDF report generator with comprehensive error handling and API data integration
  * Added functional download buttons to all report components (InvestorReports and ReportsAll)
  * Created downloadable PDF reports for monthly performance, risk compliance, portfolio optimization, and comprehensive analysis
  * Removed Home button from developer dashboard navigation as requested by user
  * Maintained clean developer navigation with Dashboard, Backtesting, Bounties, and Learning sections
- June 29, 2025. Implemented clickable bounty statistics with comprehensive user profiles and performance tracking
  * Created detailed user profile schemas with bounty performance metrics, skills, achievements, and rankings
  * Built comprehensive UserDetail page with tabbed interface showing overview, bounties, activity, and rankings
  * Developed BountyLeaderboard page with sortable rankings, search, filtering, and detailed user statistics
  * Made bounty statistics clickable linking to leaderboard with user performance data
  * Added user profile tracking including reputation scores, success rates, completion times, and category rankings
  * Integrated comprehensive achievement system with rarity levels and skill endorsements
  * Created responsive design for both desktop and mobile viewing of user profiles and leaderboards
- June 29, 2025. Built comprehensive real-time trading platform with live market data integration
  * Implemented complete market data service with WebSocket real-time price feeds, order books, and trade streams
  * Created trading service with full order management: market, limit, stop, and stop-limit orders
  * Built comprehensive trading API endpoints with authentication, validation, and error handling
  * Developed real-time market data feed component with live price updates, order book visualization, and trade history
  * Created advanced trading interface with portfolio overview, order placement, position tracking, and trade history
  * Integrated WebSocket server for real-time data streaming between backend services and frontend components
  * Added live trading page with tabbed interface combining market data feed and trading capabilities
  * Enhanced navigation with Trading section in investor dashboard for easy access to live trading features
- June 29, 2025. Created comprehensive real-time sentiment visualizer with multi-asset dashboard support
  * Built AI-powered sentiment analysis system covering Stocks, Crypto, Forex, Commodities, and Indices
  * Enhanced market data service with sentiment data generation including news, social, and technical sentiment scores
  * Created comprehensive sentiment visualizer component with real-time updates, category filtering, and sorting options
  * Integrated sentiment data into existing market data feeds with confidence scoring and keyword extraction
  * Added sentiment analysis tab to live trading interface with asset selection functionality
  * Implemented comprehensive asset type support with proper formatting for prices, volumes, and market caps
  * Built interactive sentiment widgets with progress bars, badges, and detailed sentiment breakdowns
  * Added real-time sentiment evolution with blended scoring and automatic data refresh intervals
- June 29, 2025. Built comprehensive bounty funding system for AI Financial model development
  * Created complete bounty funding page with multi-tab interface (Browse, My Requests, My Funding)
  * Implemented database schema for bounty funding requests and contributions with proper relationships
  * Built comprehensive API endpoints for creating, browsing, and funding bounty requests
  * Added category filtering, sorting, and status management for funding requests
  * Created interactive funding request cards with progress tracking, skill requirements, and deliverables
  * Integrated funding contribution system with real-time progress updates and backer tracking
  * Added comprehensive form for submitting new funding requests with validation and user authentication
  * Built statistics dashboard showing total funded amounts, active bounties, contributors, and completion rates
- June 29, 2025. Enhanced mobile navigation with responsive dashboard switching dropdown
  * Created sophisticated mobile dashboard switcher with visual feedback and smooth transitions
  * Added current mode display with contextual descriptions and colored badges (DEV/INV)
  * Implemented two-button grid layout for easy dashboard mode switching on mobile
  * Added quick action buttons that dynamically change based on current dashboard mode
  * Enhanced UX with gradient backgrounds, hover effects, and visual indicators
  * Integrated quick navigation to key features (Dashboard, Backtest for dev; Portfolio, Bots for investor)
  * Improved mobile menu hierarchy with prominent dashboard mode section at top
- June 29, 2025. Implemented comprehensive Web3 & DeFi integration with wallet connectivity
  * Built complete Web3 database schema with wallets, crypto holdings, DeFi positions, transactions, yield farming, and NFT tables
  * Created Web3Context provider for centralized wallet state management using Web3Modal and ethers.js
  * Developed comprehensive Web3 DeFi dashboard with wallet connection, portfolio tracking, and DeFi protocol integration
  * Added Web3 & DeFi navigation link to investor dashboard with CircleDollarSign icon
  * Integrated multi-chain support for Ethereum, BSC, Polygon, Avalanche, and Fantom networks
  * Fixed OAuth authentication flow with proper `/api/login` route redirecting to available providers (Google, GitHub, LinkedIn)
  * Established complete blockchain connectivity infrastructure for decentralized finance operations
- June 29, 2025. Implemented comprehensive smart contracts for transparent revenue sharing and crowdfunding
  * Created Solidity smart contracts for revenue sharing and crowdfunding with transparent fund management
  * Built comprehensive smart contract service layer with ethers.js integration for blockchain interactions
  * Developed sophisticated blockchain contracts dashboard with wallet connectivity and transaction management
  * Implemented revenue sharing contracts with automatic distribution to developers, platform, and investors
  * Created crowdfunding smart contracts with escrow protection and automatic refund mechanisms
  * Added comprehensive blockchain analytics with real-time contract metrics and platform statistics
  * Integrated smart contract features including trustless execution, multi-party sharing, and gas optimization
  * Built complete UI for contract deployment, contribution management, and withdrawal functionality
- June 29, 2025. Configured comprehensive Investor menu navigation system with hierarchical structure
  * Restructured investor navigation to match specification with Home, Market Insights, Portfolio, Reports, Risk Management, Trading, and Learning sections
  * Created detailed submenu items for each main category (Real-Time Market Data, AI-Generated Insights, Recent Alerts, etc.)
  * Built comprehensive Market Sentiment page with AI-powered insights, sentiment analysis, and macroeconomic trend predictions
  * Enhanced mobile navigation with organized section headers and improved categorization for investor dashboard
  * Implemented proper routing for all new navigation items including market sentiment analysis page
  * Added comprehensive AI market analysis with confidence scoring, impact assessment, and sector breakdown
  * Integrated responsive design ensuring proper functionality across desktop and mobile platforms
- July 1, 2025. Fixed layout issues and completed page routing system
  * Fixed Trading Bots page by adding proper Layout wrapper for consistent header/footer display
  * Created and properly routed 6 new pages: Community, Docs, Webinars, Portfolio AI Models, Strategies, and Orders
  * Fixed naming conflicts in App.tsx imports and resolved duplicate component references
  * Ensured all new pages are accessible through proper routing configuration
  * Completed comprehensive page structure with consistent Layout wrapper across all components
- July 1, 2025. Fixed submenu structure and created unified funding page
  * Confirmed Dashboard option is present in both /live-trading and /portfolio submenu structures
  * Fixed portfolio submenu AI Models link to use correct route (/portfolio/ai-models)
  * Created new unified funding page (/funding) with proper submenu structure: Dashboard, Bot Funding, AI Model Funding, Bounty Funding
  * Added tabbed interface with dashboard overview showing combined funding statistics and quick access to specialized funding sections
  * Updated default navigation to point to unified funding page instead of individual funding pages
  * Maintained existing specialized funding pages accessible through the unified interface
- July 1, 2025. Updated portfolio submenu and created comprehensive portfolio performance page
  * Changed "Overview" to "Portfolio" in portfolio submenu navigation with Wallet icon
  * Created comprehensive /portfolio-performance page with advanced analytics and visualizations
  * Added tabbed interface with Overview, Returns, Allocation, and Risk Analysis sections
  * Integrated Recharts library for portfolio value charts, monthly returns comparison, and asset allocation pie charts
  * Built comprehensive performance metrics including Sharpe ratio, max drawdown, and top performers tracking
  * Added export functionality and refresh capabilities for portfolio performance reports
- July 2, 2025. Created comprehensive Categories and Tutorials pages for AI Models and Learning sections
  * Built Categories page (/categories) with advanced search, filtering, and sorting capabilities
  * Added category statistics dashboard with comprehensive metrics and visualization
  * Created Tutorials page (/tutorials) with detailed tutorial management and progress tracking
  * Integrated tutorial enrollment system with difficulty levels, ratings, and completion tracking
  * Added instructor profiles, learning objectives, and prerequisite management
  * Enhanced submenu navigation to properly highlight Categories in AI Models and Tutorials in Learning
  * Implemented grid/list view modes for flexible content browsing in both pages
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```