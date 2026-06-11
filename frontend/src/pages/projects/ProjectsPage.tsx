import { useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import SearchBar from "@/components/layout/SearchBar"
import { useAuthStore } from "@/store/authStore"
import { useProjects } from "@/hooks/useProjects"
import { useUnreadCount } from "@/hooks/useNotifications"

// ── Icons ─────────────────────────────────────────────────
function SearchIcon()      { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon()        { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function UsersIcon()       { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function GridIcon()        { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> }

const statusColors: Record<string, string> = {
  recruiting:  "text-green-700 bg-green-50 border border-green-200",
  in_progress: "text-blue-700 bg-blue-50 border border-blue-200",
  completed:   "text-gray-500 bg-gray-100 border border-gray-200",
}
const statusDots: Record<string, string> = {
  recruiting:  "bg-green-500",
  in_progress: "bg-blue-500",
  completed:   "bg-gray-400",
}
const statusLabels: Record<string, string> = {
  recruiting:  "Recruiting",
  in_progress: "In Progress",
  completed:   "Completed",
}
const avatarBgColors = ["bg-emerald-500","bg-purple-500","bg-pink-500","bg-blue-500","bg-teal-500","bg-orange-500"]

export default function ProjectsPage() {
  const { user } = useAuthStore()
  const unread = useUnreadCount()
  const [pathFilter, setPathFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")

  const { data: projects = [], isLoading } = useProjects({
    career_path: pathFilter || undefined,
    status:      statusFilter || undefined,
  })

  const filtered = projects.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tech_stack?.some((t: string) => t.toLowerCase().includes(q))
    )
  })

  const initials = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Project Marketplace</h1>
            <p className="text-xs text-gray-500">Build real-world experience with a team</p>
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

        <div className="flex-1 overflow-y-auto">

          {/* Hero banner */}
          <div className="mx-8 mt-6 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%)" }}>
            <div className="px-8 py-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Collaborate on real projects</h2>
                <p className="text-indigo-200 text-sm">Join a team, ship something real, and earn peer-validated skills for your portfolio.</p>
              </div>
              <Link to="/projects/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-colors flex-shrink-0 shadow-sm">
                <PlusIcon />Create a project
              </Link>
            </div>
          </div>

          <div className="px-8 py-5 space-y-4">

            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search projects by name or technology..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {[{ val: "", label: "All paths" }, { val: "data", label: "Data" }, { val: "web", label: "Web" }, { val: "mobile", label: "Mobile" }].map(({ val, label }) => (
                <button key={label} onClick={() => setPathFilter(val)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${pathFilter === val ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                  {label}
                </button>
              ))}
              <div className="w-px h-5 bg-gray-200 mx-1" />
              {[{ val: "", label: "All" }, { val: "recruiting", label: "Recruiting" }, { val: "in_progress", label: "In Progress" }, { val: "completed", label: "Completed" }].map(({ val, label }) => (
                <button key={label} onClick={() => setStatusFilter(val)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${statusFilter === val ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Count */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GridIcon />
              <span>{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</span>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 pb-8">
                {filtered.map((p, idx) => {
                  const status     = p.status as string
                  const memberCount = (p.members?.length ?? 0) + (p.members?.some((m: any) => m.user.id === p.owner.id) ? 0 : 1)
                  const openCount   = p.open_roles?.filter((r: any) => !r.is_filled).length ?? 0
                  const lead        = p.owner
                  const leadInitials = lead?.full_name
                    ? lead.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
                    : "?"
                  const avatarBg = avatarBgColors[idx % avatarBgColors.length]
                  const statusLabel = statusLabels[status] ?? status
                  const statusColor = statusColors[status] ?? "text-gray-600 bg-gray-50 border border-gray-200"
                  const statusDot   = statusDots[status] ?? "bg-gray-400"
                  return (
                    <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />{statusLabel}
                        </span>
                        <span className="text-xs text-gray-400 font-medium capitalize">{p.career_path}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">{p.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech_stack?.map((t: string) => (
                          <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold text-gray-700">{p.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.progress === 100 ? "bg-green-500" : "bg-indigo-600"}`}
                            style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><UsersIcon />{memberCount}/{p.team_size} members</span>
                        {openCount > 0
                          ? <span className="text-green-600 font-semibold flex items-center gap-1"><UsersIcon />{openCount} open roles</span>
                          : <span className="text-gray-400 font-medium">Team full</span>
                        }
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {leadInitials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 leading-tight">{lead?.full_name ?? "Unknown"}</p>
                            <p className="text-xs text-gray-400">Owner</p>
                          </div>
                        </div>
                        <Link to={`/projects/${p.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
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
