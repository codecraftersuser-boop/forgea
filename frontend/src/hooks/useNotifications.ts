import { useQuery, useMutation, useQueryClient } from "react-query"
import { notificationsService } from "@/services/notificationsService"

export function useNotifications(unreadOnly = false) {
  return useQuery(
    ["notifications", { unreadOnly }],
    () => notificationsService.list(unreadOnly),
    { refetchInterval: 60_000, staleTime: 30_000 }
  )
}

export function useUnreadCount() {
  const { data } = useNotifications()
  return data ? data.filter((n) => !n.is_read).length : 0
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation(
    (id: number) => notificationsService.markRead(id),
    { onSuccess: () => qc.invalidateQueries("notifications") }
  )
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation(
    () => notificationsService.markAllRead(),
    { onSuccess: () => qc.invalidateQueries("notifications") }
  )
}
