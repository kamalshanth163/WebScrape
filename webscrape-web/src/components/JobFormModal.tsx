import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '../api/client'
import { useAppStore } from '../store/useAppStore'

export function JobFormModal() {
  const { closeJobModal, editingJob } = useAppStore()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: editingJob?.name ?? '',
    url: editingJob?.url ?? '',
    scheduleType: editingJob?.scheduleType ?? 'OneTime' as 'OneTime' | 'Recurring',
    cronExpression: editingJob?.cronExpression ?? '0 9 * * *',
    useHeadlessBrowser: editingJob?.useHeadlessBrowser ?? false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.url.trim()) e.url = 'URL is required'
    else if (!/^https?:\/\/.+/.test(form.url)) e.url = 'Must start with http:// or https://'
    if (form.scheduleType === 'Recurring' && !form.cronExpression.trim())
      e.cron = 'Cron expression is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const mutation = useMutation({
    mutationFn: () => {
      const payload: any = {
        name: form.name,
        url: form.url,
        scheduleType: form.scheduleType === 'Recurring' ? 1 : 0,
        useHeadlessBrowser: form.useHeadlessBrowser,
      }
      if (form.scheduleType === 'Recurring') payload.cronExpression = form.cronExpression
      console.log('Submitting job payload', payload)
      return editingJob ? jobsApi.update(editingJob.id, payload) : jobsApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      closeJobModal()
    },
    onError: (error: any) => {
      console.error('Job create/update error:', error?.response?.data || error)
      const msg = error?.response?.data?.message || error?.response?.data || 'Failed to save job'
      setErrors(e => ({ ...e, submit: String(msg) }))
    },
  })

  function handleSubmit() {
    if (validate()) mutation.mutate()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeJobModal()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{editingJob ? 'Edit job' : 'New scrape job'}</div>
          </div>
          <button className="modal-close" onClick={closeJobModal}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Job name</label>
            <input
              className="form-input"
              value={form.name}
              placeholder="e.g. Daily news scrape"
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Target URL</label>
            <input
              className="form-input"
              value={form.url}
              placeholder="https://example.com"
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            />
            {errors.url && <div className="form-error">{errors.url}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Schedule type</label>
            <div className="toggle-group">
              {(['OneTime', 'Recurring'] as const).map(t => (
                <button
                  key={t}
                  className={`toggle-btn ${form.scheduleType === t ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, scheduleType: t }))}
                >
                  {t === 'OneTime' ? 'One-time' : 'Recurring (cron)'}
                </button>
              ))}
            </div>
          </div>

          {form.scheduleType === 'Recurring' && (
            <div className="form-group">
              <label className="form-label">Cron expression</label>
              <input
                className="form-input"
                value={form.cronExpression}
                placeholder="0 9 * * *"
                onChange={e => setForm(f => ({ ...f, cronExpression: e.target.value }))}
              />
              {errors.cron && <div className="form-error">{errors.cron}</div>}
              <div className="form-hint">
                Examples: &nbsp;<code>0 9 * * *</code> daily 9am &nbsp;·&nbsp;
                <code>0 */6 * * *</code> every 6h &nbsp;·&nbsp;
                <code>0 9 * * 1</code> every Monday
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.useHeadlessBrowser}
                onChange={e => setForm(f => ({ ...f, useHeadlessBrowser: e.target.checked }))}
              />
              Use headless browser (for JavaScript-heavy sites)
            </label>
          </div>
        </div>

        <div className="modal-footer">
          {errors.submit && <div className="form-error" style={{ width: '100%', marginBottom: 8 }}>{errors.submit}</div>}
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={closeJobModal}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : editingJob ? 'Update job' : 'Create job'}
          </button>
        </div>
      </div>
    </div>
  )
}