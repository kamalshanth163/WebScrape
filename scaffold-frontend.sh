# Create Vite + React + TypeScript project
npm create vite@latest webscrape-web -- --template react-ts
cd webscrape-web

# Install all required packages
npm install

# TanStack Query (server state, caching, refetching)
npm install @tanstack/react-query @tanstack/react-table

# Axios for HTTP requests
npm install axios

# Zustand for lightweight client state
npm install zustand

# SignalR client for real-time job status
npm install @microsoft/signalr

# shadcn/ui setup
npm install tailwindcss @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Date formatting
npm install date-fns

# Cron expression validation on frontend
npm install cronstrue
