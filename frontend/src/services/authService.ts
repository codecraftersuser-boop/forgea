import api from "./api"
import type { User } from "@/types"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface ForgotPasswordPayload { email: string }
export interface ResetPasswordPayload  { token: string; password: string }

export const authService = {
  async forgotPassword(data: ForgotPasswordPayload): Promise<void> {
    await api.post("/api/v1/auth/forgot-password", data)
  },

  async resetPassword(data: ResetPasswordPayload): Promise<void> {
    await api.post("/api/v1/auth/reset-password", data)
  },

  async login(data: LoginPayload): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/api/v1/auth/login", data)
    return res.data
  },

  async register(data: RegisterPayload): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/api/v1/auth/register", data)
    return res.data
  },

  async logout(): Promise<void> {
    await api.post("/api/v1/auth/logout")
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>("/api/v1/users/me")
    return res.data
  },
}
