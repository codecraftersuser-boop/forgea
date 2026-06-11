import { useQuery, useMutation, useQueryClient } from "react-query"
import { projectsService, type ProjectFilters, type CreateProjectPayload } from "@/services/projectsService"

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery(
    ["projects", filters],
    () => projectsService.list(filters),
    { keepPreviousData: true }
  )
}

export function useMyProjects(status?: string) {
  return useQuery(
    ["myProjects", status],
    () => projectsService.myProjects(status),
    { keepPreviousData: true }
  )
}

export function useProject(id: number) {
  return useQuery(
    ["project", id],
    () => projectsService.get(id),
    { enabled: !!id }
  )
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation(
    ({ id, data }: { id: number; data: { progress?: number; status?: string; title?: string; description?: string } }) =>
      projectsService.update(id, data),
    {
      onSuccess: (_, { id }) => {
        qc.invalidateQueries("myProjects")
        qc.invalidateQueries(["project", id])
      },
    }
  )
}

export function useCompleteProject() {
  const qc = useQueryClient()
  return useMutation(
    (id: number) => projectsService.complete(id),
    { onSuccess: () => qc.invalidateQueries("myProjects") }
  )
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation(
    (data: CreateProjectPayload) => projectsService.create(data),
    { onSuccess: () => qc.invalidateQueries("projects") }
  )
}

export function useApplyProject() {
  const qc = useQueryClient()
  return useMutation(
    ({ projectId, roleId }: { projectId: number; roleId: number }) =>
      projectsService.apply(projectId, roleId),
    { onSuccess: () => qc.invalidateQueries("projects") }
  )
}

export function useAcceptApplication() {
  const qc = useQueryClient()
  return useMutation(
    ({ projectId, applicantId, roleId }: { projectId: number; applicantId: number; roleId: number }) =>
      projectsService.acceptApplication(projectId, applicantId, roleId),
    { onSuccess: () => { qc.invalidateQueries("projects"); qc.invalidateQueries("notifications") } }
  )
}

export function useDeclineApplication() {
  const qc = useQueryClient()
  return useMutation(
    ({ projectId, applicantId }: { projectId: number; applicantId: number }) =>
      projectsService.declineApplication(projectId, applicantId),
    { onSuccess: () => qc.invalidateQueries("notifications") }
  )
}

export function useJoinProject() {
  const qc = useQueryClient()
  return useMutation(
    ({ projectId, roleId }: { projectId: number; roleId: number }) =>
      projectsService.joinProject(projectId, roleId),
    { onSuccess: () => { qc.invalidateQueries("myProjects"); qc.invalidateQueries("notifications") } }
  )
}

export function useDeclineInvitation() {
  const qc = useQueryClient()
  return useMutation(
    (projectId: number) => projectsService.declineInvitation(projectId),
    { onSuccess: () => qc.invalidateQueries("notifications") }
  )
}
