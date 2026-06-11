import { Link } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import { useAuthStore } from "@/store/authStore"
import { useUnreadCount } from "@/hooks/useNotifications"
import { useMyProjects } from "@/hooks/useProjects"
import type { Project } from "@/types"

// ── Icons ─────────────────────────────────────────────────
function SearchIcon()      { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon()        { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function UsersIcon()       { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  recruiting:  { label: "Recruiting",  dot: "bg-green-500",  badge: "text-green-700 bg-green-50 border border-green-200" },
  in_progress: { label: "In Progress", dot: "bg-orange-400", badge: "text-orange-600 bg-orange-50 border border-orange-200" },
  completed:   { label: "Completed",   dot: "bg-gray-400",   badge: "text-gray-500 bg-gray-100 border border-gray-200" },
}

const AVATAR_COLORS = ["bg-indigo-600", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-teal-500", "bg-orange-500"]

function nameInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function MyProjectsPage() {
  const { user } = useAuthStore()
  const unread = useUnreadCount()
  const { data: projects = [], isLoading } = useMyProjects()

  const initials = user?.full_name ? nameInitials(user.full_name) : "?"

  const totalProjects = projects.length
  const recruiting    = projects.filter((p: Project) => p.status === "recruiting").length
  const inProgress    = projects.filter((p: Project) => p.status === "in_progress").length
  const avgProgress   = totalProjects
    ? Math.round(projects.reduce((s: number, p: Project) => s + p.progress, 0) / totalProjects)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
            <p className="text-xs text-gray-500">Manage and track projects you created</p>
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

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Recruiting</p>
              <p className="text-3xl font-bold text-green-600">{recruiting}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
              <p className="text-xs text-gray-500 font-medium mb-1">In Progress</p>
              <p className="text-3xl font-bold text-orange-500">{inProgress}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
              <p className="text-xs text-gray-500 font-medium mb-1">Avg. Progress</p>
              <p className="text-3xl font-bold text-teal-500">{avgProgress}%</p>
            </div>
          </div>

          {/* Overall progress bar */}
          {totalProjects > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Overall Progress</p>
                  <p className="text-xs text-gray-400 mt-0.5">Average completion across all your projects</p>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{avgProgress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${avgProgress}%`, background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)" }}
                />
              </div>
            </div>
          )}

          {/* Projects grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Your Projects</h2>
              <Link to="/projects/new" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                <PlusIcon />New Project
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 font-medium mb-1">No projects yet</p>
                <p className="text-gray-400 text-sm mb-4">Create your first project to start collaborating</p>
                <Link to="/projects/new" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  <PlusIcon />Create Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {projects.map((p: Project, idx: number) => {
                  const st = statusConfig[p.status] ?? statusConfig.recruiting
                  const openRoles = p.open_roles?.filter((r) => !r.is_filled).length ?? 0
                  const ownerColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  return (
                    <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                        <span className="text-xs text-gray-400 font-medium capitalize">{p.career_path}</span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">{p.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                      </div>

                      {p.tech_stack && p.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {p.tech_stack.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>
                          ))}
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span className={`font-semibold ${p.progress === 100 ? "text-green-600" : "text-gray-700"}`}>{p.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.progress === 100 ? "bg-green-500" : "bg-indigo-600"}`} style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><UsersIcon />{p.members?.length ?? 0}/{p.team_size} members</span>
                        {openRoles > 0
                          ? <span className="text-green-600 font-semibold flex items-center gap-1"><UsersIcon />{openRoles} open roles</span>
                          : <span className="text-gray-400 font-medium">Team full</span>
                        }
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${ownerColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {nameInitials(p.owner.full_name)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 leading-tight">{p.owner.full_name}</p>
                            <p className="text-xs text-gray-400 capitalize">{p.owner.career_path ?? "Developer"}</p>
                          </div>
                        </div>
                        <Link to={`/my-projects/${p.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                          View →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
