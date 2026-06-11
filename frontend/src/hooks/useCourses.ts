import { useQuery, useMutation, useQueryClient } from "react-query"
import { coursesService, type CourseFilters } from "@/services/coursesService"

export function useCourseActivity() {
  return useQuery("courseActivity", () => coursesService.activity(), { staleTime: 60_000 })
}

export function useCourses(filters: CourseFilters = {}) {
  return useQuery(
    ["courses", filters],
    () => coursesService.list(filters),
    { keepPreviousData: true }
  )
}

export function useMyCourses() {
  return useQuery("myCourses", () => coursesService.myCourses())
}

export function useEnrollCourse() {
  const qc = useQueryClient()
  return useMutation(
    (courseId: number) => coursesService.enroll(courseId),
    { onSuccess: () => { qc.invalidateQueries("courses"); qc.invalidateQueries("myCourses") } }
  )
}

export function useUpdateProgress() {
  const qc = useQueryClient()
  return useMutation(
    ({ courseId, progress }: { courseId: number; progress: number }) =>
      coursesService.updateProgress(courseId, progress),
    { onSuccess: () => qc.invalidateQueries("myCourses") }
  )
}
