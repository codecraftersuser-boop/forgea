import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import { authService, type LoginPayload, type RegisterPayload } from "@/services/authService"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (data: LoginPayload) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { access_token } = await authService.login(data)
          localStorage.setItem("access_token", access_token)
          const user = await authService.getMe()
          set({ token: access_token, user, isAuthenticated: true, isLoading: false })
        } catch (err: any) {
          const status = err?.response?.status
          const detail = err?.response?.data?.detail
          const msg =
            status === 404 || detail === "Email not registered"
              ? "This email is not registered. Would you like to create an account?"
              : "Incorrect password. Please try again."
          set({ error: msg, isLoading: false, isAuthenticated: false })
          throw new Error(msg)
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { access_token } = await authService.register(data)
          localStorage.setItem("access_token", access_token)
          const user = await authService.getMe()
          set({ token: access_token, user, isAuthenticated: true, isLoading: false })
        } catch (err: any) {
          const msg =
            err?.response?.data?.detail === "Email already registered"
              ? "This email is already registered. Sign in instead."
              : err?.response?.data?.detail ?? "Something went wrong. Please try again."
          set({ error: msg, isLoading: false, isAuthenticated: false })
          throw new Error(msg)
        }
      },

      logout: async () => {
        try { await authService.logout() } catch { /* ignore */ }
        localStorage.removeItem("access_token")
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      fetchMe: async () => {
        try {
          const user = await authService.getMe()
          set({ user, isAuthenticated: true })
        } catch {
          localStorage.removeItem("access_token")
          set({ user: null, token: null, isAuthenticated: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "forgea-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
