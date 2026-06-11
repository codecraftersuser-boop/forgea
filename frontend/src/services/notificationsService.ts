import api from "./api"
import type { Notification } from "@/types"

export const notificationsService = {
  async list(unreadOnly = false): Promise<Notification[]> {
    const params = unreadOnly ? "?unread_only=true" : ""
    const res = await api.get<Notification[]>(`/api/v1/notifications/${params}`)
    return res.data
  },

  async markRead(id: number): Promise<Notification> {
    const res = await api.patch<Notification>(`/api/v1/notifications/${id}/read`)
    return res.data
  },

  async markAllRead(): Promise<void> {
    await api.patch("/api/v1/notifications/read-all")
  },
}
