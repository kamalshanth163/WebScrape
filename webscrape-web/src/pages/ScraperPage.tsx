// webscrape-web/src/pages/ScraperPage.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi, analyticsApi } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { JobFormModal } from '../components/JobFormModal'
import { format } from 'date-fns'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    Pending: 'badge badge-pending',
    Running: 'badge badge-running',
    Completed: 'badge badge-completed',
    Failed: 'badge badge-failed',
  }
  return <span className={cls[status] ?? 'badge'}>{status}</span>
}

export function ScraperPage() {
  const queryClient = useQueryClient()
  const { openJobModal, jobModalOpen } = useAppStore()

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
    refetchInterval: 30_000,
  })

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.get,
    refetchInterval: 30_000,
  })

  const deleteMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const analyticsCards = analytics
    ? [
        { label: 'Total jobs',      value: analytics.totalJobs,            cls: 'blue'   },
        { label: 'Successful',      value: analytics.successfulJobs,       cls: 'green'  },
        { label: 'Success rate',    value: `${analytics.successRate}%`,    cls: 'amber'  },
        { label: 'Data collected',  value: formatBytes(analytics.totalBytesCollected), cls: 'purple' },
      ]
    : []

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Scraper</h1>
          <p className="page-subtitle">Manage and schedule your scrape jobs</p>
        </div>
        <button className="btn btn-primary" onClick={() => openJobModal()}>
          + New scrape job
        </button>
      </div>

      {/* Analytics cards */}
      {analytics && (
        <div className="analytics-grid">
          {analyticsCards.map(c => (
            <div key={c.label} className="analytics-card">
              <div className="analytics-card-label">{c.label}</div>
              <div className={`analytics-card-value ${c.cls}`}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming schedules */}
      {analytics && analytics.upcomingJobs.length > 0 && (
        <div className="upcoming-panel">
          <div className="upcoming-panel-title">Upcoming schedules</div>
          <div className="upcoming-bar">
            {analytics.upcomingJobs.map(j => (
              <div key={j.name} className="upcoming-chip">
                <div className="upcoming-dot" />
                <span className="upcoming-name">{j.name}</span>
                <span className="upcoming-time">
                  {format(new Date(j.nextRun), 'MMM d, HH:mm')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs table */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Scrape jobs</span>
          <span className="panel-count">{jobs.length} total</span>
        </div>

        {isLoading ? (
          <div className="loading">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <p>No scrape jobs yet.</p>
            <button className="empty-link" onClick={() => openJobModal()}>
              Create your first job →
            </button>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="ws-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Last run</th>
                  <th>Next run</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td><span className="cell-primary">{job.name}</span></td>
                    <td><span className="cell-url">{job.url}</span></td>
                    <td>
                      <span className={`badge ${job.scheduleType === 'Recurring' ? 'badge-recurring' : 'badge-onetime'}`}>
                        {job.scheduleType === 'Recurring' ? job.cronExpression : 'One-time'}
                      </span>
                    </td>
                    <td><StatusBadge status={job.status} /></td>
                    <td>
                      <span className="cell-muted">
                        {job.lastRunAt ? format(new Date(job.lastRunAt), 'MMM d, HH:mm') : '—'}
                      </span>
                    </td>
                    <td>
                      <span className="cell-muted">
                        {job.nextRunAt ? format(new Date(job.nextRunAt), 'MMM d, HH:mm') : '—'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openJobModal(job)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => confirm('Delete this job?') && deleteMutation.mutate(job.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {jobModalOpen && <JobFormModal />}
    </div>
  )
}