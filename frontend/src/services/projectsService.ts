import api from "./api"
import type { Project } from "@/types"

export interface ProjectFilters {
  career_path?: string
  status?: string
  skip?: number
  limit?: number
}

export interface CreateProjectPayload {
  title: string
  description: string
  career_path: string
  team_size: number
  tech_stack: string[]
  open_roles: string[]
}

export const projectsService = {
  async list(filters: ProjectFilters = {}): Promise<Project[]> {
    const params = new URLSearchParams()
    if (filters.career_path) params.set("career_path", filters.career_path)
    if (filters.status)      params.set("status", filters.status)
    if (filters.skip)        params.set("skip", String(filters.skip))
    if (filters.limit)       params.set("limit", String(filters.limit))
    const res = await api.get<Project[]>(`/api/v1/projects/?${params}`)
    return res.data
  },

  async get(id: number): Promise<Project> {
    const res = await api.get<Project>(`/api/v1/projects/${id}`)
    return res.data
  },

  async create(data: CreateProjectPayload): Promise<Project> {
    const res = await api.post<Project>("/api/v1/projects/", data)
    return res.data
  },

  async myProjects(status?: string): Promise<Project[]> {
    const params = status ? `?status=${status}` : ""
    const res = await api.get<Project[]>(`/api/v1/projects/my${params}`)
    return res.data
  },

  async update(id: number, data: { progress?: number; status?: string; title?: string; description?: string }): Promise<Project> {
    const res = await api.patch<Project>(`/api/v1/projects/${id}`, data)
    return res.data
  },

  async complete(id: number): Promise<void> {
    await api.post(`/api/v1/projects/${id}/complete`)
  },

  async apply(projectId: number, roleId: number): Promise<void> {
    await api.post(`/api/v1/projects/${projectId}/apply`, { role_id: roleId })
  },

  async acceptApplication(projectId: number, applicantId: number, roleId: number): Promise<void> {
    await api.post(`/api/v1/projects/${projectId}/accept_application`, { applicant_id: applicantId, role_id: roleId })
  },

  async declineApplication(projectId: number, applicantId: number): Promise<void> {
    await api.post(`/api/v1/projects/${projectId}/decline_application`, { applicant_id: applicantId })
  },

  async joinProject(projectId: number, roleId: number): Promise<void> {
    await api.post(`/api/v1/projects/${projectId}/join`, { role_id: roleId })
  },

  async declineInvitation(projectId: number): Promise<void> {
    await api.post(`/api/v1/projects/${projectId}/decline_invitation`)
  },
}
