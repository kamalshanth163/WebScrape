import { Job } from './types'

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000'

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/api/jobs`)
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return res.json()
}

export async function createJob(payload: { name: string; url: string }): Promise<Job> {
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create job')
  return res.json()
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`)
  if (!res.ok) throw new Error('Failed to fetch job')
  return res.json()
}

export default { getJobs, createJob, getJob }
