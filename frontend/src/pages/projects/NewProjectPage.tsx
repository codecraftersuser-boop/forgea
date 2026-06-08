import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import logo from "@/assets/logo.png"

// ── Icons ─────────────────────────────────────────────────
function HomeIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
function RoadmapIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> }
function BriefcaseIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function BellIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function UserIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
function SearchIcon() { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function TrophyIcon() { return <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> }
function LogoutIcon() { return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> }
function ArrowLeftIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> }
function RocketIcon() { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> }
function StackIcon() { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" /></svg> }
function UsersIcon() { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function PublishIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> }
function XIcon() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> }

// ── Nav ───────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard", path: "/dashboard", Icon: HomeIcon },
  { label: "Learning Roadmap", path: "/roadmap", Icon: RoadmapIcon },
  { label: "Project Marketplace", path: "/projects", Icon: BriefcaseIcon },
  { label: "Notifications", path: "/notifications", Icon: BellIcon, badge: 3 },
  { label: "My Profile", path: "/profile", Icon: UserIcon },
]

function Sidebar() {
  const { pathname } = useLocation()
  const active = (path: string) => pathname === path || pathname.startsWith(path + "/")
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
          const isActive = active(path)
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
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

// ── Page ──────────────────────────────────────────────────
export default function NewProjectPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [careerPath, setCareerPath] = useState("Web Development")
  const [teamSize, setTeamSize] = useState(4)
  const [techInput, setTechInput] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])
  const [roleInput, setRoleInput] = useState("")
  const [roles, setRoles] = useState<string[]>([])

  const addTech = () => {
    const v = techInput.trim()
    if (v && !techStack.includes(v)) setTechStack(prev => [...prev, v])
    setTechInput("")
  }
  const addRole = () => {
    const v = roleInput.trim()
    if (v && !roles.includes(v)) setRoles(prev => [...prev, v])
    setRoleInput("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Create a Project</h1>
            <p className="text-xs text-gray-400">Recruit a team and start building</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><SearchIcon /></span>
              <input type="text" placeholder="Search courses, projects..."
                className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
            </div>
            <div className="relative">
              <BellOutlineIcon />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <Link to="/projects/new" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              <PlusIcon />New Project
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all">
              JA
            </Link>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Main form ── */}
          <main className="flex-[3] overflow-y-auto px-8 py-6">

            {/* Back link */}
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeftIcon />
              Back to marketplace
            </Link>

            <div className="space-y-5">

              {/* Project basics */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <RocketIcon />
                  <h2 className="text-base font-semibold text-gray-800">Project basics</h2>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Project title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. EcoTrack — Carbon Footprint Analytics"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="What are you building, who is it for, and what makes it exciting to work on?"
                      rows={5}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400 resize-y"
                    />
                  </div>

                  {/* Career path + Team size */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Career path</label>
                      <select
                        value={careerPath}
                        onChange={e => setCareerPath(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white appearance-none"
                      >
                        <option>Web Development</option>
                        <option>Data Engineering &amp; Science</option>
                        <option>Mobile Development</option>
                        <option>DevOps</option>
                        <option>UI/UX Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Target team size</label>
                      <input
                        type="number"
                        min={2} max={20}
                        value={teamSize}
                        onChange={e => setTeamSize(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech stack */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <h2 className="text-base font-semibold text-gray-800">Tech stack</h2>
                </div>

                {/* Tags */}
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {techStack.map(t => (
                      <span key={t} className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full">
                        {t}
                        <button onClick={() => setTechStack(prev => prev.filter(x => x !== t))} className="hover:text-indigo-900"><XIcon /></button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="Add a technology and press Enter"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400"
                  />
                  <button
                    onClick={addTech}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <PlusIcon /> Add
                  </button>
                </div>
              </div>

              {/* Open roles */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <UsersIcon />
                  <h2 className="text-base font-semibold text-gray-800">Open roles</h2>
                </div>

                {/* Role tags */}
                {roles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {roles.map(r => (
                      <span key={r} className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full">
                        {r}
                        <button onClick={() => setRoles(prev => prev.filter(x => x !== r))} className="hover:text-purple-900"><XIcon /></button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={e => setRoleInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addRole())}
                    placeholder="e.g. Frontend Developer"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400"
                  />
                  <button
                    onClick={addRole}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <PlusIcon /> Add
                  </button>
                </div>
              </div>

            </div>
          </main>

          {/* ── Right panel: Preview ── */}
          <aside className="flex-[2] bg-gray-50 border-l border-gray-100 overflow-y-auto flex-shrink-0 px-8 py-6 flex flex-col gap-4">

            <h3 className="text-base font-semibold text-gray-800">Preview</h3>

            {/* Preview card — all in one box */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Top: tag + title + description */}
              <div className="p-5">
                <span className="inline-block text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full mb-3">
                  {careerPath.split(" ")[0]}
                </span>
                <h4 className="text-base font-bold text-gray-900 leading-snug">
                  {title || "Your project title"}
                </h4>
                <p className="text-sm text-indigo-400 mt-1 leading-relaxed line-clamp-3">
                  {description || "A short description of what your team will build together."}
                </p>
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {techStack.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider + team info */}
              <div className="border-t border-gray-100 px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Team size</span>
                  <span className="text-sm font-semibold text-gray-800">{teamSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Open roles</span>
                  <span className="text-sm font-semibold text-gray-800">{roles.length}</span>
                </div>
              </div>
            </div>

            {/* Publish button */}
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)" }}
            >
              <PublishIcon />
              Publish project
            </button>
            <p className="text-xs text-gray-400 text-center -mt-1">
              You can edit details and manage applicants after publishing.
            </p>

          </aside>
        </div>
      </div>
    </div>
  )
}
