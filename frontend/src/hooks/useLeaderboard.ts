import { useQuery } from "react-query"
import api from "@/services/api"

export function useLeaderboard(limit = 10) {
  return useQuery(["leaderboard", limit], async () => {
    const { data } = await api.get(`/api/v1/users/leaderboard?limit=${limit}`)
    return data
  }, { staleTime: 5 * 60_000 })
}
