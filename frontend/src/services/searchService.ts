import api from "./api"

export interface SearchCourse {
  id: number
  title: string
  institution: string
  level: string
  career_path: string
  external_url: string
}

export interface SearchProject {
  id: number
  title: string
  status: string
  career_path: string
}

export interface SearchUser {
  id: number
  full_name: string
  career_path: string | null
  level: number
}

export interface SearchResults {
  courses: SearchCourse[]
  projects: SearchProject[]
  users: SearchUser[]
}

export const searchService = {
  async search(q: string): Promise<SearchResults> {
    const res = await api.get<SearchResults>(`/api/v1/search/?q=${encodeURIComponent(q)}`)
    return res.data
  },
}
