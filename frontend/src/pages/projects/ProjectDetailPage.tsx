import { useState } from "react"
import { useParams, useSearchParams, Link } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import { useAuthStore } from "@/store/authStore"
import { useUnreadCount } from "@/hooks/useNotifications"
import { useProject, useApplyProject } from "@/hooks/useProjects"
import api from "@/services/api"

// ── Icons ─────────────────────────────────────────────────
function SearchIcon()      { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon()        { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function ArrowLeftIcon()   { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> }
function UsersIcon()       { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function CodeIcon()        { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }
function CheckIcon()       { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> }

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  recruiting:  { label: "Recruiting",  dot: "bg-green-500",  badge: "text-green-700 bg-green-50 border border-green-200" },
  in_progress: { label: "In Progress", dot: "bg-blue-500",   badge: "text-blue-700 bg-blue-50 border border-blue-200" },
  completed:   { label: "Completed",   dot: "bg-gray-400",   badge: "text-gray-500 bg-gray-100 border border-gray-200" },
}

const AVATAR_COLORS = ["bg-purple-500","bg-emerald-500","bg-pink-500","bg-blue-500","bg-teal-500","bg-orange-500","bg-indigo-500","bg-rose-500"]

function nameInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const unread = useUnreadCount()
  const { data: project, isLoading, refetch } = useProject(Number(id))
  const applyMutation = useApplyProject()

  const invitedRoleId = searchParams.get("invited_role_id") ? Number(searchParams.get("invited_role_id")) : null

  const [applyingRoleId, setApplyingRoleId] = useState<number | null>(null)
  const [appliedRoles, setAppliedRoles]     = useState<number[]>([])
  const [inviteBusy, setInviteBusy]         = useState<"accept" | "decline" | null>(null)
  const [inviteResult, setInviteResult]     = useState<"accepted" | "declined" | null>(null)
  const [inviteError, setInviteError]       = useState<string | null>(null)

  const initials     = user?.full_name ? nameInitials(user.full_name) : "?"
  const isOwner      = project?.owner?.id === user?.id
  const myMembership = project?.members?.find((m: any) => m.user.id === user?.id)
  const isMember     = !!myMembership

  async function handleAcceptInvite() {
    if (!invitedRoleId) return
    setInviteBusy("accept")
    setInviteError(null)
    try {
      await api.post(`/api/v1/projects/${id}/accept-invite`, { role_id: invitedRoleId })
      setInviteResult("accepted")
      refetch()
    } catch (e: any) {
      const detail: string = e?.response?.data?.detail ?? "Something went wrong."
      if (e?.response?.status === 409 && detail.toLowerCase().includes("already")) {
        setInviteResult("accepted")
        refetch()
      } else {
        setInviteError(detail)
      }
    } finally {
      setInviteBusy(null)
    }
  }

  function handleDeclineInvite() {
    setInviteResult("declined")
  }

  function handleApply(roleId: number) {
    setApplyingRoleId(roleId)
    applyMutation.mutate(
      { projectId: Number(id), roleId },
      {
        onSuccess: () => { setAppliedRoles((prev) => [...prev, roleId]); setApplyingRoleId(null) },
        onError:   () => setApplyingRoleId(null),
      }
    )
  }

  const topBar = (
    <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Project Details</h1>
        <p className="text-xs text-gray-500">Project Marketplace</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><SearchIcon /></span>
          <input type="text" placeholder="Search courses, projects..." className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
        </div>
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

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-56 flex flex-col">{topBar}<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div></div>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-56 flex flex-col">{topBar}<div className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-gray-400 text-lg mb-4">Project not found.</p><Link to="/projects" className="text-indigo-600 hover:underline text-sm font-medium">← Back to Marketplace</Link></div></div></div>
    </div>
  )

  const st        = statusConfig[project.status] ?? statusConfig.recruiting
  const openRoles  = project.open_roles?.filter((r) => !r.is_filled) ?? []
  const filledRoles = project.open_roles?.filter((r) => r.is_filled) ?? []

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {topBar}

        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Back + action */}
          <div className="flex items-center justify-between mb-5">
            <Link to={invitedRoleId ? "/notifications" : "/projects"} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
              <ArrowLeftIcon /> {invitedRoleId ? "Back to Notifications" : "Back to Marketplace"}
            </Link>

            {/* Owner: link to manage */}
            {isOwner && (
              <Link to={`/my-projects/${project.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl transition-colors">
                Manage project →
              </Link>
            )}

            {/* Member (already joined): show role */}
            {!isOwner && isMember && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                <CheckIcon /> You're on this team — {myMembership.role}
              </span>
            )}

            {/* Invited visitor: Accept / Decline */}
            {!isOwner && !isMember && invitedRoleId && inviteResult === null && (
              <div className="flex items-center gap-2">
                {inviteError && <span className="text-xs text-red-500">{inviteError}</span>}
                <button
                  onClick={handleDeclineInvite}
                  disabled={inviteBusy !== null}
                  className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptInvite}
                  disabled={inviteBusy !== null}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {inviteBusy === "accept" ? "Joining…" : "Accept invitation"}
                </button>
              </div>
            )}

            {/* Invite result feedback */}
            {!isOwner && !isMember && invitedRoleId && inviteResult === "declined" && (
              <span className="text-sm font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl">
                Invitation declined
              </span>
            )}

            {/* Regular marketplace visitor: apply to join */}
            {!isOwner && !isMember && !invitedRoleId && project.status === "recruiting" && openRoles.length > 0 && (
              <a href="#open-roles" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                Apply to join
              </a>
            )}
          </div>

          {/* Invitation banner */}
          {!isOwner && !isMember && invitedRoleId && inviteResult === null && (
            <div className="mb-5 flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4">
              <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <p className="text-sm font-semibold text-indigo-800">You've been invited to join this project</p>
                <p className="text-xs text-indigo-600">Review the project details below, then accept or decline the invitation above.</p>
              </div>
            </div>
          )}
          {!isOwner && !isMember && invitedRoleId && inviteResult === "accepted" && (
            <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-semibold text-green-800">You've joined the team! Welcome aboard.</p>
            </div>
          )}

          <div className="flex gap-6">

            {/* ── Left ── */}
            <div className="flex-1 space-y-5">

              {/* Project card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${st.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                  </span>
                  <span className="text-xs text-gray-400 font-medium capitalize">{project.career_path}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                <div className="mt-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className={`font-bold ${project.progress === 100 ? "text-green-600" : "text-indigo-600"}`}>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${project.progress === 100 ? "bg-green-500" : "bg-indigo-600"}`} style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Tech stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4"><CodeIcon /><h3 className="text-sm font-semibold text-gray-800">Tech Stack</h3></div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((t) => (
                      <span key={t} className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Open roles */}
              {openRoles.length > 0 && (
                <div id="open-roles" className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UsersIcon />
                    <h3 className="text-sm font-semibold text-gray-800">Open Roles</h3>
                    <span className="ml-auto text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">{openRoles.length} open</span>
                  </div>
                  <div className="space-y-3">
                    {openRoles.map((role) => {
                      const isApplying = applyingRoleId === role.id
                      const hasApplied = appliedRoles.includes(role.id)
                      return (
                        <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{role.role}</p>

                          {isOwner && (
                            <span className="text-xs text-gray-400 font-medium italic">Your project</span>
                          )}
                          {!isOwner && isMember && (
                            <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckIcon />On team</span>
                          )}
                          {!isOwner && !isMember && !invitedRoleId && (
                            hasApplied ? (
                              <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckIcon />Applied!</span>
                            ) : (
                              <button onClick={() => handleApply(role.id)} disabled={isApplying || applyingRoleId !== null}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                                {isApplying ? "Applying…" : "Apply"}
                              </button>
                            )
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Filled roles */}
              {filledRoles.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UsersIcon />
                    <h3 className="text-sm font-semibold text-gray-800">Filled Roles</h3>
                    <span className="ml-auto text-xs text-gray-400">{filledRoles.length} filled</span>
                  </div>
                  <div className="space-y-2">
                    {filledRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">{role.role}</p>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><CheckIcon />Filled</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.status === "completed" && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Project Completed</p>
                    <p className="text-xs text-green-600">This project has been successfully completed.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right ── */}
            <div className="w-72 space-y-5 flex-shrink-0">

              {/* Owner */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Project Owner</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {nameInitials(project.owner.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{project.owner.full_name}{isOwner ? " (you)" : ""}</p>
                    <p className="text-xs text-gray-400 capitalize">{project.owner.career_path ?? "Developer"}</p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <UsersIcon />
                  <h3 className="text-sm font-semibold text-gray-800">Team</h3>
                  <span className="ml-auto text-xs text-gray-400">{project.members?.length ?? 0}/{project.team_size}</span>
                </div>
                <div className="space-y-3">
                  {project.members?.map((member, idx: number) => (
                    <div key={member.user.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {nameInitials(member.user.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{member.user.full_name}{member.user.id === user?.id ? " (you)" : ""}</p>
                        <p className="text-xs text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${st.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Career path</span>
                    <span className="text-gray-800 font-medium capitalize">{project.career_path}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Team size</span>
                    <span className="text-gray-800 font-medium">{project.members?.length ?? 0}/{project.team_size} members</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Open roles</span>
                    <span className={`font-medium ${openRoles.length > 0 ? "text-green-600" : "text-gray-400"}`}>
                      {openRoles.length > 0 ? `${openRoles.length} open` : "Team full"}
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
    </div>
  )
}
