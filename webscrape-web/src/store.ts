import create from 'zustand'
import { Job } from './types'
import * as api from './api'

type State = {
  jobs: Job[]
  loading: boolean
  fetchJobs: () => Promise<void>
  addJob: (name: string, url: string) => Promise<void>
  updateJob: (j: Job) => void
}

export const useStore = create<State>((set, get) => ({
  jobs: [],
  loading: false,
  fetchJobs: async () => {
    set({ loading: true })
    try {
      const jobs = await api.getJobs()
      set({ jobs })
    } catch (e) {
      console.error(e)
    } finally {
      set({ loading: false })
    }
  },
  addJob: async (name, url) => {
    try {
      const job = await api.createJob({ name, url })
      set({ jobs: [job, ...get().jobs] })
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  updateJob: (j) => set(({ jobs }) => ({ jobs: jobs.map((x) => (x.id === j.id ? j : x)) })),
}))
