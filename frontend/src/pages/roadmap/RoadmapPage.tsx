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
function StarIcon() { return <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> }
function ClockIcon() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg> }
function TrophyIcon() { return <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> }
function LogoutIcon() { return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> }
function CheckSolid() { return <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> }
function ChevronDownIcon() { return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> }
function DataIcon() { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> }
function CodeIcon() { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }
function MobileIcon() { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
function FilterIcon() { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg> }

// ── Sidebar (shared) ──────────────────────────────────────
const navItems = [
  { label: "Dashboard", path: "/dashboard", Icon: HomeIcon },
  { label: "Learning Roadmap", path: "/roadmap", Icon: RoadmapIcon },
  { label: "Project Marketplace", path: "/projects", Icon: BriefcaseIcon },
  { label: "Notifications", path: "/notifications", Icon: BellIcon, badge: 3 },
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

// ── Page ──────────────────────────────────────────────────
const paths = [
  { id: "data", label: "Data Engineering & Science", Icon: DataIcon },
  { id: "web", label: "Web Development", Icon: CodeIcon },
  { id: "mobile", label: "Mobile Development", Icon: MobileIcon },
]

const filterTabs = ["All", "Beginner", "Intermediate", "Advanced", "Professional"]

const courses = [
  {
    provider: "MIT xPRO", level: "Advanced", levelColor: "text-purple-600 border-purple-300 bg-purple-50",
    title: "Full–Stack System Design", instructor: "Dr. Aanya Rao",
    rating: 4.8, reviews: "8.7k", hours: 36, prestige: 97, date: "Apr 2026",
    tags: ["Architecture", "Scaling"], progress: null, price: "$149", action: "Enroll",
  },
  {
    provider: "Meta", level: "Intermediate", levelColor: "text-blue-600 border-blue-300 bg-blue-50",
    title: "The Complete React & TypeScript Bootcamp", instructor: "Sophie Chen",
    rating: 4.7, reviews: "54.3k", hours: 40, prestige: 96, date: "May 2026",
    tags: ["React", "TypeScript"], progress: 42, price: "$74", action: "Continue",
  },
  {
    provider: "Codecademy", level: "Intermediate", levelColor: "text-blue-600 border-blue-300 bg-blue-50",
    title: "Node.js & Backend API Mastery", instructor: "James Okafor",
    rating: 4.5, reviews: "22.0k", hours: 28, prestige: 82, date: "Feb 2026",
    tags: ["Node.js", "APIs"], progress: null, price: "$59", action: "Enroll",
  },
]

export default function RoadmapPage() {
  const [activePath, setActivePath] = useState("web")
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Learning Roadmap</h1>
            <p className="text-xs text-gray-500">Recommended courses for your career path</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">

          {/* Path tabs */}
          <div className="flex items-center gap-2">
            {paths.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActivePath(id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activePath === id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>

          {/* Top row: description card + career opportunities */}
          <div className="grid grid-cols-3 gap-5">
            {/* Description */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Web Development</h2>
              <p className="text-sm text-gray-500 mb-5">
                Become a full-stack engineer. Build responsive interfaces, scalable APIs, and production-grade applications used by millions.
              </p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "TypeScript", "React", "Node.js", "Next.js", "PostgreSQL", "Tailwind", "Docker"].map((s) => (
                  <span key={s} className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">{s}</span>
                ))}
              </div>
            </div>

            {/* Career opportunities */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BriefcaseIcon /> Career Opportunities
              </p>
              <div className="space-y-3">
                {[
                  { role: "Frontend Developer", range: "$75k–$120k" },
                  { role: "Backend Developer", range: "$85k–$130k" },
                  { role: "Full-Stack Engineer", range: "$90k–$145k" },
                  { role: "DevOps Engineer", range: "$100k–$160k" },
                ].map(({ role, range }) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{role}</span>
                    <span className="text-sm font-semibold text-green-600">{range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap progression */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
              🎓 Roadmap Progression
            </h3>
            <div className="flex items-start gap-0">
              {[
                {
                  n: 1, stage: "Beginner", done: true, current: false,
                  skills: ["HTML, CSS & JavaScript", "Git & GitHub", "Responsive design"],
                },
                {
                  n: 2, stage: "Intermediate", done: true, current: false,
                  skills: ["React & state management", "REST APIs", "Databases"],
                },
                {
                  n: 3, stage: "Advanced", done: false, current: true,
                  skills: ["Next.js & SSR", "Authentication & security", "Testing"],
                },
                {
                  n: 4, stage: "Professional", done: false, current: false,
                  skills: ["System design", "CI/CD", "Cloud deployment & scaling"],
                },
              ].map(({ n, stage, done, current, skills }, i, arr) => (
                <div key={stage} className="flex flex-1 items-start">
                  <div className="flex flex-col items-start flex-1">
                    <div className="flex items-center w-full mb-3">
                      {/* Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        done ? "bg-green-500" : current ? "bg-indigo-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {done ? <CheckSolid /> : <span className={current ? "text-white" : ""}>{n}</span>}
                      </div>
                      {/* Connector line */}
                      {i < arr.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${done ? "bg-green-400" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <p className={`text-sm font-semibold mb-2 ${done ? "text-gray-800" : current ? "text-gray-900" : "text-gray-400"}`}>
                      {stage}
                    </p>
                    <ul className="space-y-1">
                      {skills.map((s) => (
                        <li key={s} className={`text-xs flex items-start gap-1.5 ${done || current ? "text-gray-500" : "text-gray-400"}`}>
                          <span className="mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < arr.length - 1 && <div className="w-4 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Filter row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500">
                <FilterIcon />
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Community rating
              <ChevronDownIcon />
            </button>
          </div>

          {/* Course cards */}
          <div className="grid grid-cols-3 gap-4 pb-6">
            {courses.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {c.provider[0]}
                    </div>
                    <span className="text-xs font-medium text-gray-500">{c.provider}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${c.levelColor}`}>{c.level}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">by {c.instructor}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><StarIcon /><span className="font-semibold text-gray-700">{c.rating}</span> ({c.reviews})</span>
                  <span className="flex items-center gap-1"><ClockIcon />{c.hours}h</span>
                  <span>🏅 {c.prestige} prestige</span>
                  <span>🔄 {c.date}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>
                  ))}
                </div>
                {c.progress !== null && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-gray-700">{c.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-base font-bold text-gray-900">{c.price}</span>
                  <button className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                    c.action === "Continue"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}>
                    {c.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
