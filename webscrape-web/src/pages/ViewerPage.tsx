// webscrape-web/src/pages/ViewerPage.tsx

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { resultsApi } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { ResultModal } from '../components/ResultModal'
import { format } from 'date-fns'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function ViewerPage() {
  const [page, setPage] = useState(1)
  const { openResultModal, resultModalOpen } = useAppStore()

  const { data, isLoading } = useQuery({
    queryKey: ['results', page],
    queryFn: () => resultsApi.getPaged(page),
    placeholderData: prev => prev,
  })

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0

  async function handleView(id: string) {
    const detail = await resultsApi.getById(id)
    openResultModal(detail)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Viewer</h1>
          <p className="page-subtitle">Browse and download your scraped data</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">All results</span>
          {data && <span className="panel-count">{data.total} total</span>}
        </div>

        {isLoading ? (
          <div className="loading">Loading results...</div>
        ) : !data || data.items.length === 0 ? (
          <div className="empty-state">
            <p>No scrape results yet.</p>
            <p style={{ fontSize: 12 }}>Run a scrape job on the Scraper page first.</p>
          </div>
        ) : (
          <>
            <table className="ws-table">
              <thead>
                <tr>
                  <th>Date / time</th>
                  <th>Job</th>
                  <th>URL</th>
                  <th>Schedule</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span className="cell-mono">
                        {format(new Date(r.scrapedAt), 'MMM d yyyy, HH:mm')}
                      </span>
                    </td>
                    <td><span className="cell-primary">{r.jobName}</span></td>
                    <td><span className="cell-url">{r.url}</span></td>
                    <td>
                      <span className={`badge ${r.scheduleType === 'Recurring' ? 'badge-recurring' : 'badge-onetime'}`}>
                        {r.scheduleType}
                      </span>
                    </td>
                    <td><span className="cell-muted">{formatBytes(r.fileSizeBytes)}</span></td>
                    <td>
                      <span className={`badge ${r.success ? 'badge-success' : 'badge-failed'}`}>
                        {r.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleView(r.id)}
                        >
                          View
                        </button>
                        <a
                          href={resultsApi.downloadUrl(r.id)}
                          download
                          className="btn btn-ghost btn-sm"
                          style={{ textDecoration: 'none' }}
                        >
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">
                  Page {page} of {totalPages} — {data.total} results
                </span>
                <div className="pagination-btns">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {resultModalOpen && <ResultModal />}
    </div>
  )
}