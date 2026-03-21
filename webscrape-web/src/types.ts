export type JobStatus = 'pending' | 'running' | 'done' | 'failed'

export interface Job {
  id: string
  name: string
  url: string
  status: JobStatus
  result?: any
  createdAt: string
}
