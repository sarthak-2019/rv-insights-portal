# RV Insights Portal

An enterprise dashboard for managing RV industry call data, transcripts, and analytics across 61+ companies.

## Features

- **Dashboard**: Overview of key metrics and recent activity
- **Call Logs**: Comprehensive call history with filtering and search
- **Transcripts**: View and analyze call transcripts
- **Analytics**: Data visualization and insights
- **AI Performance**: Monitor AI assistant performance metrics
- **AI Predictive**: Predictive analytics and forecasting
- **Companies & Vendors**: Manage company and vendor relationships
- **Team Management**: User and team administration
- **Auto Email**: Automated email workflows
- **Escalations**: Track and manage escalated issues

## Technologies

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Beautiful and accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Tanstack Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd rv-insights-portal

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
rv-insights-portal/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── data/           # Mock data and constants
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── ...config files
```

## Development

The project uses:

- ESLint for code linting
- TypeScript for type checking
- Vite for fast HMR (Hot Module Replacement)

## License

Private and confidential - All rights reserved
