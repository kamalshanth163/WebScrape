import { create } from 'zustand'
import type { ScrapeJob, ScrapeResultDetail } from '../api/client'

interface AppState {
  // Job form modal
  jobModalOpen: boolean
  editingJob: ScrapeJob | null
  openJobModal: (job?: ScrapeJob) => void
  closeJobModal: () => void
  // Result detail modal
  resultModalOpen: boolean
  viewingResult: ScrapeResultDetail | null
  openResultModal: (result: ScrapeResultDetail) => void
  closeResultModal: () => void
}

export const useAppStore = create<AppState>(set => ({
  jobModalOpen: false, editingJob: null,
  openJobModal: (job) => set({ jobModalOpen: true, editingJob: job ?? null }),
  closeJobModal: () => set({ jobModalOpen: false, editingJob: null }),
  resultModalOpen: false, viewingResult: null,
  openResultModal: (result) => set({ resultModalOpen: true, viewingResult: result }),
  closeResultModal: () => set({ resultModalOpen: false, viewingResult: null })
}))