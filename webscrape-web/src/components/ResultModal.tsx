// webscrape-web/src/components/ResultModal.tsx

import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { resultsApi } from '../api/client'
import { format } from 'date-fns'

export function ResultModal() {
  const { closeResultModal, viewingResult } = useAppStore()
  const [view, setView] = useState<'text' | 'html'>('text')

  if (!viewingResult) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeResultModal()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <div className="modal-title">{viewingResult.jobName}</div>
            <div className="modal-subtitle">{viewingResult.url}</div>
            <div className="modal-meta">
              Scraped {format(new Date(viewingResult.scrapedAt), 'PPpp')}
            </div>
          </div>
          <button className="modal-close" onClick={closeResultModal}>✕</button>
        </div>

        <div className="modal-tabs">
          {(['text', 'html'] as const).map(v => (
            <button
              key={v}
              className={`modal-tab ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}
            >
              {v === 'text' ? 'Extracted text' : 'Raw HTML'}
            </button>
          ))}
        </div>

        <div className="modal-body">
          <div className="code-preview">
            {view === 'text' ? viewingResult.extractedText ?? '(no text extracted)' : viewingResult.rawHtml}
          </div>
        </div>

        <div className="modal-download-bar">
          <a  
            href={resultsApi.downloadUrl(viewingResult.id, 'json')}
            download
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Download JSON
          </a>
          <a
            href={resultsApi.downloadUrl(viewingResult.id, 'html')}
            download
            className="btn btn-ghost btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Download HTML
          </a>
        </div>
      </div>
    </div>
  )
}