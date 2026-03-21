// webscrape-web/src/App.tsx

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScraperPage } from './pages/ScraperPage'
import { ViewerPage } from './pages/ViewerPage'
import { useSignalR } from './hooks/useSignalR'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

type Page = 'scraper' | 'viewer'

const navItems: { id: Page; label: string; desc: string }[] = [
  { id: 'scraper', label: 'Scraper', desc: 'Manage jobs' },
  { id: 'viewer', label: 'Viewer', desc: 'Browse results' },
]

function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-dot" />
        <span className="logo-text">
          web<span className="logo-accent">scrape</span>
        </span>
      </div>

      <nav className="nav">
        <p className="nav-label">Navigation</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`nav-link ${page === item.id ? 'active' : ''}`}
          >
            <span className="nav-link-dot" />
            <div>
              <div className="nav-link-title">{item.label}</div>
              <div className="nav-link-desc">{item.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a
          href="/hangfire"
          target="_blank"
          rel="noopener noreferrer"
          className="hangfire-link"
        >
          Hangfire dashboard →
        </a>
        <p className="hangfire-desc">Job queue monitor</p>
      </div>
    </aside>
  )
}

function AppInner() {
  const [page, setPage] = useState<Page>('scraper')
  useSignalR()

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="main">
        {page === 'scraper' ? <ScraperPage /> : <ViewerPage />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  )
}