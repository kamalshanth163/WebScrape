import { useEffect } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'

export function useSignalR() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl('/hubs/scrape')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    conn.on('JobStatusChanged', (jobId: string, status: string) => {
      // Optimistically update job status in cache
      queryClient.setQueryData(['jobs'], (old: any[]) =>
        old?.map(j => j.id === jobId ? { ...j, status } : j) ?? [])
    })

    conn.on('JobCompleted', () => {
      // Invalidate both queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['results'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    })

    conn.start().catch(console.error)
    return () => { conn.stop() }
  }, [queryClient])
}