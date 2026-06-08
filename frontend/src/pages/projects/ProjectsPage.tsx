import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import logo from "@/assets/logo.png"

// ── Icons ─────────────────────────────────────────────────
function HomeIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
function RoadmapIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> }
function BriefcaseIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function BellNavIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function UserIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
function SearchIcon() { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function TrophyIcon() { return <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> }
function LogoutIcon() { return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> }
function UsersIcon() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function GridIcon() { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> }

// ── Sidebar ───────────────────────────────────────────────
const navItems = [
  { label: "Dashboard", path: "/dashboard", Icon: HomeIcon },
  { label: "Learning Roadmap", path: "/roadmap", Icon: RoadmapIcon },
  { label: "Project Marketplace", path: "/projects", Icon: BriefcaseIcon },
  { label: "Notifications", path: "/notifications", Icon: BellNavIcon, badge: 3 },
  { label: "My Profile", path: "/profile", Icon: UserIcon },
]

function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen fixed top-0 left-0 z-20 py-5 px-3" style={{ backgroundColor: "#111827" }}>
      <div className="flex items-center gap-2.5 px-3 mb-7">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src={logo} alt="F" className="w-6 h-6 object-contain" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Forgea</span>
      </div>
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ label, path, Icon, badge }) => {
          const active = pathname === path
          return (
            <Link key={path} to={path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Icon />
              <span className="flex-1">{label}</span>
              {badge && <span className="bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{badge}</span>}
            </Link>
          )
        })}
      </nav>
      <div className="mt-4 px-3 space-y-3">
        <div className="flex items-center gap-2">
          <TrophyIcon />
          <span className="text-sm font-semibold text-white">Level 7</span>
          <span className="ml-auto text-xs text-gray-400">6240 XP</span>
        </div>
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: "78%" }} />
        </div>
        <p className="text-xs text-gray-500">1760 XP to level 8</p>
        <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">JA</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Jordan Avery</p>
            <p className="text-xs text-gray-500 truncate">Final-year CS Student</p>
          </div>
          <button className="text-gray-500 hover:text-gray-300"><LogoutIcon /></button>
        </div>
      </div>
    </aside>
  )
}

// ── Data ──────────────────────────────────────────────────
const projects = [
  {
    name: "EcoTrack — Carbon Footprint Analytics", status: "Recruiting", type: "Data",
    desc: "A data platform that ingests household energy data and visualizes carbon footprint trends with predictive insights and personalized reduction tips.",
    tags: ["Python", "Airflow", "PostgreSQL", "Power BI"],
    progress: 45, members: 3, maxMembers: 5, openRoles: 2, teamFull: false,
    lead: { initials: "AR", name: "Aisha Rahman", role: "Data Engineer", color: "bg-emerald-500" },
  },
  {
    name: "CampusHub — Student Marketplace", status: "In Progress", type: "Web",
    desc: "A full-stack web marketplace where university students buy, sell, and trade textbooks and gear, with real-time chat and secure payments.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    progress: 72, members: 4, maxMembers: 4, openRoles: 0, teamFull: true,
    lead: { initials: "DO", name: "Daniel Osei", role: "Full-Stack Engineer", color: "bg-purple-500" },
  },
  {
    name: "FitQuest — Gamified Fitness App", status: "Recruiting", type: "Mobile",
    desc: "A cross-platform mobile app that turns workouts into RPG-style quests with streaks, leaderboards, and social challenges.",
    tags: ["Flutter", "Firebase", "Dart"],
    progress: 30, members: 2, maxMembers: 4, openRoles: 2, teamFull: false,
    lead: { initials: "ML", name: "Maya Lindberg", role: "Mobile Developer", color: "bg-pink-500" },
  },
  {
    name: "LedgerLite — Open Source Finance Dashboard", status: "In Progress", type: "Web",
    desc: "A privacy-first personal finance dashboard with budget tracking, recurring expense detection, and beautiful spending visualizations.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    progress: 88, members: 5, maxMembers: 6, openRoles: 1, teamFull: false,
    lead: { initials: "TR", name: "Tomás Rivera", role: "Frontend Developer", color: "bg-blue-500" },
  },
  {
    name: "MediPredict — Health Risk Models", status: "Completed", type: "Data",
    desc: "An ML research project building interpretable models that predict early health risks from anonymized clinical datasets.",
    tags: ["Python", "TensorFlow", "Pandas"],
    progress: 100, members: 5, maxMembers: 5, openRoles: 0, teamFull: true,
    lead: { initials: "DS", name: "Dr. Sofia Greco", role: "Data Scientist", color: "bg-teal-500" },
  },
  {
    name: "Wanderlist — Travel Planner", status: "Recruiting", type: "Mobile",
    desc: "A mobile app to collaboratively plan trips with shared itineraries, offline maps, budget splitting, and AI suggestions.",
    tags: ["React Native", "Firebase", "TypeScript"],
    progress: 12, members: 1, maxMembers: 4, openRoles: 3, teamFull: false,
    lead: { initials: "KW", name: "Kenji Watanabe", role: "Mobile Developer", color: "bg-orange-500" },
  },
]

const statusColors: Record<string, string> = {
  "Recruiting": "text-green-700 bg-green-50 border border-green-200",
  "In Progress": "text-blue-700 bg-blue-50 border border-blue-200",
  "Completed": "text-gray-500 bg-gray-100 border border-gray-200",
}

const statusDots: Record<string, string> = {
  "Recruiting": "bg-green-500",
  "In Progress": "bg-blue-500",
  "Completed": "bg-gray-400",
}

// ── Page ──────────────────────────────────────────────────
export default function ProjectsPage() {
  const [pathFilter, setPathFilter] = useState("All paths")
  const [statusFilter, setStatusFilter] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = projects.filter((p) => {
    const matchPath = pathFilter === "All paths" || p.type === pathFilter
    const matchStatus = statusFilter === "All" || p.status === statusFilter
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchPath && matchStatus && matchSearch
  })

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
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><SearchIcon /></span>
              <input type="text" placeholder="Search courses, projects..." className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
            </div>
            <div className="relative">
              <BellOutlineIcon />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <Link to="/projects/new" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              <PlusIcon />New Project
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all">JA</Link>
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
              {["All paths", "Data", "Web", "Mobile"].map((f) => (
                <button
                  key={f}
                  onClick={() => setPathFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    pathFilter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="w-px h-5 bg-gray-200 mx-1" />
              {["All", "Recruiting", "In Progress", "Completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    statusFilter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Count */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GridIcon />
              <span>{filtered.length} projects found</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-4 pb-8">
              {filtered.map((p) => (
                <div key={p.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                  {/* Status + type */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[p.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[p.status]}`} />
                      {p.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{p.type}</span>
                  </div>

                  {/* Title + desc */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{p.desc}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-gray-700">{p.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.progress === 100 ? "bg-green-500" : "bg-indigo-600"}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Members / roles */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><UsersIcon />{p.members}/{p.maxMembers} members</span>
                    {p.teamFull
                      ? <span className="text-gray-400 font-medium">Team full</span>
                      : <span className="text-green-600 font-semibold flex items-center gap-1"><UsersIcon />{p.openRoles} open roles</span>
                    }
                  </div>

                  {/* Lead + View */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${p.lead.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {p.lead.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 leading-tight">{p.lead.name}</p>
                        <p className="text-xs text-gray-400">{p.lead.role}</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
