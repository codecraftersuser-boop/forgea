import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import SearchBar from "@/components/layout/SearchBar"
import { useAuthStore } from "@/store/authStore"
import { useUnreadCount } from "@/hooks/useNotifications"
import { useProject, useUpdateProject, useCompleteProject } from "@/hooks/useProjects"

// ── Icons ─────────────────────────────────────────────────
function PlusIcon()        { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function ArrowLeftIcon()   { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> }
function UsersIcon()       { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function CheckCircleIcon() { return <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function CodeIcon()        { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  recruiting:  { label: "Recruiting",  dot: "bg-green-500",  badge: "text-green-700 bg-green-50 border border-green-200" },
  in_progress: { label: "In Progress", dot: "bg-orange-400", badge: "text-orange-600 bg-orange-50 border border-orange-200" },
  completed:   { label: "Completed",   dot: "bg-gray-400",   badge: "text-gray-500 bg-gray-100 border border-gray-200" },
}

const AVATAR_COLORS = ["bg-indigo-600", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-teal-500", "bg-orange-500", "bg-rose-500"]

function nameInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function MyProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const unread = useUnreadCount()

  const projectId = Number(id)
  const { data: project, isLoading } = useProject(projectId)
  const updateProject  = useUpdateProject()
  const completeProject = useCompleteProject()

  const [editingProgress, setEditingProgress] = useState(false)
  const [progressValue, setProgressValue]     = useState(0)
  const [confirmComplete, setConfirmComplete] = useState(false)

  // Invite state: roleId → email input + sent status
  const [inviteOpen, setInviteOpen]   = useState<number | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState("")
  const [inviteSent, setInviteSent]   = useState<number[]>([])
  const [inviteSending, setInviteSending] = useState(false)

  function openInvite(roleId: number) {
    setInviteOpen(roleId)
    setInviteEmail("")
    setInviteError("")
  }

  async function sendInvite(roleId: number) {
    const email = inviteEmail.trim()
    if (!email) { setInviteError("Enter an email address"); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInviteError("Enter a valid email address"); return }
    setInviteSending(true)
    setInviteError("")
    try {
      const { default: api } = await import("@/services/api")
      await api.post(`/api/v1/projects/${projectId}/invite`, { email, role_id: roleId })
      setInviteSent((prev) => [...prev, roleId])
      setInviteOpen(null)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      if (err?.response?.status === 404 && detail?.includes("email")) {
        setInviteError("No account found with that email address.")
      } else if (err?.response?.status === 409) {
        setInviteError("This user is already a member of the project.")
      } else if (err?.response?.status === 400) {
        setInviteError(detail ?? "Invalid request.")
      } else {
        setInviteError("Failed to send invite. Try again.")
      }
    } finally {
      setInviteSending(false)
    }
  }

  const initials = user?.full_name ? nameInitials(user.full_name) : "?"
  const isOwner  = project?.owner?.id === user?.id

  function startEditProgress() {
    setProgressValue(project?.progress ?? 0)
    setEditingProgress(true)
  }

  function saveProgress() {
    updateProject.mutate({ id: projectId, data: { progress: progressValue } }, {
      onSuccess: () => setEditingProgress(false),
    })
  }

  function handleComplete() {
    completeProject.mutate(projectId, {
      onSuccess: () => {
        setConfirmComplete(false)
        navigate("/my-projects")
      },
    })
  }

  const headerContent = (
    <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-900">Project Details</h1>
        <p className="text-xs text-gray-500">View and manage your project</p>
      </div>
      <div className="flex items-center gap-3">
        <SearchBar />
        <Link to="/notifications" className="relative">
          <BellOutlineIcon />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
        </Link>
        <Link to="/projects/new" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
          <PlusIcon />New Project
        </Link>
        <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all">
          {initials}
        </Link>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-56 flex flex-col">
          {headerContent}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-56 flex flex-col">
          {headerContent}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-4">Project not found.</p>
              <Link to="/my-projects" className="text-indigo-600 hover:underline text-sm font-medium">← Back to My Projects</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const st = statusConfig[project.status] ?? statusConfig.recruiting
  const openRoles = project.open_roles?.filter((r) => !r.is_filled) ?? []
  // Owner counts as a team member even if not in the members list
  const ownerInMembers = (project.members ?? []).some((m) => m.user.id === project.owner.id)
  const teamCount = (project.members?.length ?? 0) + (ownerInMembers ? 0 : 1)
  const teamFull = teamCount >= project.team_size

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {headerContent}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          <Link to="/my-projects" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 font-medium">
            <ArrowLeftIcon /> Back to My Projects
          </Link>

          <div className="flex gap-6">

            {/* ── Left column ── */}
            <div className="flex-1 space-y-5">

              {/* Project header card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${st.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    <span className="text-xs text-gray-400 font-medium capitalize">{project.career_path}</span>
                  </div>
                  {isOwner && project.status !== "completed" && (
                    <div className="flex gap-2">
                      <button
                        onClick={startEditProgress}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        Update Progress
                      </button>
                      <button
                        onClick={() => setConfirmComplete(true)}
                        className="text-sm font-medium text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>

                {/* Progress */}
                <div className="mt-5">
                  {editingProgress ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-bold text-indigo-600">{progressValue}%</span>
                      </div>
                      <input
                        type="range" min={0} max={100} step={5}
                        value={progressValue}
                        onChange={(e) => setProgressValue(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveProgress}
                          disabled={updateProject.isLoading}
                          className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {updateProject.isLoading ? "Saving…" : "Save"}
                        </button>
                        <button onClick={() => setEditingProgress(false)} className="text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-1.5 rounded-lg">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className={`font-bold ${project.progress === 100 ? "text-green-600" : "text-indigo-600"}`}>{project.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${project.progress === 100 ? "bg-green-500" : "bg-indigo-600"}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tech stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CodeIcon />
                    <h3 className="text-sm font-semibold text-gray-800">Tech Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((t) => (
                      <span key={t} className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Open roles */}
              {openRoles.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UsersIcon />
                    <h3 className="text-sm font-semibold text-gray-800">Open Roles</h3>
                    {teamFull ? (
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-semibold">
                        Team full
                      </span>
                    ) : (
                      <span className="ml-auto text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                        {openRoles.length} open
                      </span>
                    )}
                  </div>
                  {teamFull && (
                    <p className="text-xs text-gray-400 mb-3 -mt-1">
                      The team has reached its size limit ({project.team_size} members). Increase the team size to invite more people.
                    </p>
                  )}
                  <div className="space-y-3">
                    {openRoles.map((role) => (
                      <div key={role.id} className="rounded-lg border border-gray-100 overflow-hidden">
                        {/* Role row */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900">{role.role}</p>
                          <div className="flex items-center gap-2">
                            {teamFull ? (
                              <span className="text-xs font-medium text-gray-400 px-3 py-1.5">Unavailable</span>
                            ) : inviteSent.includes(role.id) ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Invite sent
                              </span>
                            ) : isOwner ? (
                              <button
                                onClick={() => inviteOpen === role.id ? setInviteOpen(null) : openInvite(role.id)}
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                                  inviteOpen === role.id
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "text-indigo-600 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50"
                                }`}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Invite
                              </button>
                            ) : (
                              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition-colors">
                                Apply
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inline invite form (owner only) */}
                        {isOwner && inviteOpen === role.id && (
                          <div className="px-4 py-3 bg-white border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">
                              Enter the email of the person you'd like to invite as <span className="font-semibold text-gray-700">{role.role}</span>:
                            </p>
                            <div className="flex gap-2">
                              <input
                                type="email"
                                autoFocus
                                placeholder="colleague@example.com"
                                value={inviteEmail}
                                onChange={(e) => { setInviteEmail(e.target.value); setInviteError("") }}
                                onKeyDown={(e) => { if (e.key === "Enter") sendInvite(role.id); if (e.key === "Escape") setInviteOpen(null) }}
                                className={`flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${inviteError ? "border-red-300" : "border-gray-200"}`}
                              />
                              <button
                                onClick={() => sendInvite(role.id)}
                                disabled={inviteSending}
                                className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                              >
                                {inviteSending ? "Sending…" : "Send"}
                              </button>
                              <button
                                onClick={() => setInviteOpen(null)}
                                className="text-sm text-gray-400 hover:text-gray-600 px-2"
                              >
                                ✕
                              </button>
                            </div>
                            {inviteError && <p className="text-xs text-red-500 mt-1.5">{inviteError}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed banner */}
              {project.status === "completed" && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
                  <CheckCircleIcon />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Project Completed</p>
                    <p className="text-xs text-green-600">This project has been successfully completed. Great work!</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column ── */}
            <div className="w-72 space-y-5 flex-shrink-0">

              {/* Team members */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <UsersIcon />
                  <h3 className="text-sm font-semibold text-gray-800">Team</h3>
                  <span className="ml-auto text-xs text-gray-400">{teamCount}/{project.team_size}</span>
                </div>
                <div className="space-y-3">
                  {!ownerInMembers && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {nameInitials(project.owner.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {project.owner.full_name}
                          {project.owner.id === user?.id ? " (you)" : ""}
                        </p>
                        <p className="text-xs text-gray-400">Owner</p>
                      </div>
                    </div>
                  )}
                  {project.members?.map((member, idx: number) => (
                    <div key={member.user.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {nameInitials(member.user.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {member.user.full_name}
                          {member.user.id === user?.id ? " (you)" : ""}
                        </p>
                        <p className="text-xs text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${st.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Career path</span>
                    <span className="text-gray-800 font-medium capitalize">{project.career_path}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Team size</span>
                    <span className="text-gray-800 font-medium">{teamCount}/{project.team_size} members</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Open roles</span>
                    <span className={`font-medium ${!teamFull && openRoles.length > 0 ? "text-green-600" : "text-gray-400"}`}>
                      {!teamFull && openRoles.length > 0 ? `${openRoles.length} open` : "Team full"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-800 font-medium">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm complete modal */}
      {confirmComplete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 mx-4">
            <h3 className="text-base font-bold text-gray-900 mb-2">Mark project as complete?</h3>
            <p className="text-sm text-gray-500 mb-5">All team members will receive +200 XP. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                disabled={completeProject.isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {completeProject.isLoading ? "Completing…" : "Yes, complete it"}
              </button>
              <button
                onClick={() => setConfirmComplete(false)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
