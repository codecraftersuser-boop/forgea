import api from "./api"
import type { Course } from "@/types"

export interface CourseFilters {
  career_path?: string
  level?: string
  skip?: number
  limit?: number
}

export const coursesService = {
  async list(filters: CourseFilters = {}): Promise<Course[]> {
    const params = new URLSearchParams()
    if (filters.career_path) params.set("career_path", filters.career_path)
    if (filters.level)       params.set("level", filters.level)
    if (filters.skip)        params.set("skip", String(filters.skip))
    if (filters.limit)       params.set("limit", String(filters.limit ?? 50))
    const res = await api.get<Course[]>(`/api/v1/courses/?${params}`)
    return res.data
  },

  async myCourses(): Promise<Course[]> {
    const res = await api.get<Course[]>("/api/v1/courses/my")
    return res.data
  },

  async enroll(courseId: number): Promise<void> {
    await api.post(`/api/v1/courses/${courseId}/enroll`)
  },

  async updateProgress(courseId: number, progress: number): Promise<void> {
    await api.patch(`/api/v1/courses/${courseId}/progress`, { progress })
  },

  async activity(): Promise<WeeklyActivity[]> {
    const res = await api.get<WeeklyActivity[]>("/api/v1/courses/activity")
    return res.data
  },
}

export interface WeeklyActivity {
  label: string
  week_start: string
  enrollments: number
  completions: number
}
