import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Types matching backend DTOs
export type ScheduleType = 'OneTime' | 'Recurring'
export type JobStatus = 'Pending' | 'Running' | 'Completed' | 'Failed'

export interface ScrapeJob {
  id: string; name: string; url: string
  scheduleType: ScheduleType; cronExpression?: string
  status: JobStatus; useHeadlessBrowser: boolean
  createdAt: string; lastRunAt?: string; nextRunAt?: string
}

export interface ScrapeResult {
  id: string; scrapeJobId: string; jobName: string; url: string
  scheduleType: string; success: boolean; errorMessage?: string
  fileSizeBytes: number; scrapedAt: string
}

export interface ScrapeResultDetail extends ScrapeResult {
  rawHtml: string; extractedText?: string
}

export interface PagedResults {
  items: ScrapeResult[]; total: number; page: number; pageSize: number
}

export interface Analytics {
  totalJobs: number; successfulJobs: number; successRate: number
  totalBytesCollected: number
  upcomingJobs: Array<{ name: string; nextRun: string }>
}

// API functions
export const jobsApi = {
  getAll: () => api.get<ScrapeJob[]>('/jobs').then(r => r.data),
  create: (dto: Omit<ScrapeJob, 'id' | 'status' | 'createdAt' | 'lastRunAt' | 'nextRunAt'>) =>
    api.post<ScrapeJob>('/jobs', dto).then(r => r.data),
  update: (id: string, dto: Partial<ScrapeJob>) =>
    api.put<ScrapeJob>(`/jobs/${id}`, dto).then(r => r.data),
  delete: (id: string) => api.delete(`/jobs/${id}`)
}

export const resultsApi = {
  getPaged: (page: number, pageSize = 20) =>
    api.get<PagedResults>(`/results?page=${page}&pageSize=${pageSize}`).then(r => r.data),
  getById: (id: string) => api.get<ScrapeResultDetail>(`/results/${id}`).then(r => r.data),
  downloadUrl: (id: string, format = 'json') => `/api/results/${id}/download?format=${format}`
}

export const analyticsApi = {
  get: () => api.get<Analytics>('/analytics').then(r => r.data)
}