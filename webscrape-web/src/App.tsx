// webscrape-web/src/App.tsx

import { useEffect, useState } from 'react'
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
type Theme = 'dark' | 'light'

const navItems: { id: Page; label: string; desc: string }[] = [
  { id: 'scraper', label: 'Scraper', desc: 'Manage jobs' },
  { id: 'viewer', label: 'Viewer', desc: 'Browse results' },
]

function Sidebar({
  page,
  setPage,
  theme,
  setTheme,
}: {
  page: Page
  setPage: (p: Page) => void
  theme: Theme
  setTheme: (t: Theme) => void
}) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-dot" />
        <span className="logo-text">
          Web<span className="logo-accent">scrape</span>
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
        <div className="theme-switch-row">
          <span className="theme-switch-label">
            Theme
          </span>
          <button
            className={`theme-switch ${theme === 'light' ? 'is-light' : ''}`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            type="button"
            role="switch"
            aria-checked={theme === 'light'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title="Toggle theme"
          >
            <span className="theme-switch-track">
              <span className="theme-switch-thumb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {theme === 'light' ? (
                    <>
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="M4.93 4.93l1.41 1.41" />
                      <path d="M17.66 17.66l1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="M4.93 19.07l1.41-1.41" />
                      <path d="M17.66 6.34l1.41-1.41" />
                    </>
                  ) : (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                  )}
                </svg>
              </span>
            </span>
          </button>
        </div>
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
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('webscrape-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('webscrape-theme', theme)
  }, [theme])

  useSignalR()

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} theme={theme} setTheme={setTheme} />
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