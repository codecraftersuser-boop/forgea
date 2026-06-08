import { Link, useLocation } from "react-router-dom"
import logo from "@/assets/logo.png"

// ── Icons ─────────────────────────────────────────────────
function HomeIcon() { return <svg className="w-4.5 h-4.5" style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
function RoadmapIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> }
function BriefcaseIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function BellIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function UserIcon() { return <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
function SearchIcon() { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function StarIcon() { return <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> }
function ClockIcon() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg> }
function UsersIcon() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function TrophyIcon() { return <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> }
function LogoutIcon() { return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> }
function CheckCircleSolid() { return <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> }
function TrendUpSmIcon() { return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> }
// Stat card icons
function ReputationIcon() { return <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> }
function BookOpenIcon() { return <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> }
function FolderIcon() { return <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg> }
function FireIcon() { return <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> }
// Achievement icons
function AchFirstSteps() { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> }
function AchTeamPlayer() { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function AchCodeReviewer() { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }
function AchStreakMaster() { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> }
function AchCollaborator() { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> }
function AchPolyglot() { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> }

// ── Area Chart ────────────────────────────────────────────
function AreaChart() {
  const data = [18, 22, 20, 28, 32, 35, 30, 38, 42, 45, 40, 48, 52, 55, 58, 60, 56, 62, 65, 70, 68, 74, 72, 78]
  const w = 800; const h = 160
  const max = Math.max(...data); const min = Math.min(...data) - 5
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * (h - 20) - 10
    return [x, y] as [number, number]
  })
  // smooth curve using bezier
  const d = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`
    const [px, py] = pts[i - 1]
    const cpx = (px + x) / 2
    return `${acc} C ${cpx},${py} ${cpx},${y} ${x},${y}`
  }, "")
  const area = `${d} L ${w},${h} L 0,${h} Z`
  const weeks = ["W2", "W3", "W4", "W5", "W6", "W7", "W8"]
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" y1={h * t} x2={w} y2={h * t} stroke="#e5e7eb" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#areaGrad)" />
        <path d={d} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {weeks.map((wk) => <span key={wk} className="text-xs text-gray-400">{wk}</span>)}
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────
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
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-7">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src={logo} alt="F" className="w-6 h-6 object-contain" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Forgea</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ label, path, Icon, badge }) => {
          const active = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Level + XP */}
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
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            JA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Jordan Avery</p>
            <p className="text-xs text-gray-500 truncate">Final-year CS Student</p>
          </div>
          <button className="text-gray-500 hover:text-gray-300">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Everything right of sidebar */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* ── SHARED HEADER (full width) ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, Jordan 👋</h1>
            <p className="text-xs text-gray-500">Here's your career progress today</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search courses, projects..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <BellOutlineIcon />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              <PlusIcon />
              New Project
            </Link>
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              JA
            </div>
          </div>
        </div>

        {/* ── STAT CARDS — full width ── */}
        <div className="px-8 pt-6 pb-0 flex-shrink-0">
          <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Reputation Score", value: "780", delta: "+45", deltaColor: "text-green-600 bg-green-50", Icon: ReputationIcon, iconBg: "bg-teal-50" },
                { label: "Courses In Progress", value: "3", delta: "+1", deltaColor: "text-green-600 bg-green-50", Icon: BookOpenIcon, iconBg: "bg-purple-50" },
                { label: "Active Projects", value: "3", delta: null, deltaColor: "", Icon: FolderIcon, iconBg: "bg-green-50" },
                { label: "Learning Streak", value: "30 days", delta: "+5", deltaColor: "text-orange-500 bg-orange-50", Icon: FireIcon, iconBg: "bg-orange-50" },
              ].map(({ label, value, delta, deltaColor, Icon, iconBg }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                      <Icon />
                    </div>
                    {delta && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${deltaColor}`}>
                        <TrendUpSmIcon />{delta}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
          </div>
        </div>

        {/* ── CONTENT ROW: chart+sections | right panel ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* CENTER */}
          <div className="flex-1 min-w-0 overflow-y-auto px-8 py-5 space-y-5">

            {/* Area chart card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Learning Activity</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Hours studied over the last 8 weeks</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <TrendUpSmIcon />+18% vs last month
                </span>
              </div>
              <AreaChart />
            </div>

            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Continue Learning</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  View all <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    provider: "Stanford Online", level: "Advanced", levelColor: "text-purple-600 border-purple-300 bg-purple-50",
                    title: "Modern Data Engineering with Spark & Airflow",
                    instructor: "Dr. Elena Marković", rating: 4.8, reviews: "12.8k", hours: 32, prestige: 98,
                    date: "May 2026", tags: ["Spark", "Airflow", "ETL"], progress: 64, price: "$89",
                  },
                  {
                    provider: "Meta", level: "Intermediate", levelColor: "text-blue-600 border-blue-300 bg-blue-50",
                    title: "The Complete React & TypeScript Bootcamp",
                    instructor: "Sophie Chen", rating: 4.7, reviews: "54.3k", hours: 40, prestige: 96,
                    date: "May 2026", tags: ["React", "TypeScript"], progress: 42, price: "$74",
                  },
                ].map((c) => (
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
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><StarIcon /><span className="font-semibold text-gray-700">{c.rating}</span> ({c.reviews})</span>
                      <span className="flex items-center gap-1"><ClockIcon />{c.hours}h</span>
                      <span>🏅 {c.prestige} prestige</span>
                      <span>🔄 {c.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.tags.map((t) => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>)}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span><span className="font-semibold text-gray-700">{c.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-bold text-gray-900">{c.price}</span>
                      <button className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors">
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Suggested Projects</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  Browse all <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "EcoTrack — Carbon Footprint Analytics", type: "Data",
                    desc: "A data platform that ingests household energy data and visualizes carbon footprint trends with predictive insights and personalized reduction tips.",
                    tags: ["Python", "Airflow", "PostgreSQL", "Power BI"],
                    progress: 45, members: 3, maxMembers: 5, openRoles: 2,
                    member: { initials: "AR", name: "Aisha Rahman", role: "Data Engineer", color: "bg-emerald-500" },
                  },
                  {
                    name: "FitQuest — Gamified Fitness App", type: "Mobile",
                    desc: "A cross-platform mobile app that turns workouts into RPG-style quests with streaks, leaderboards, and social challenges.",
                    tags: ["Flutter", "Firebase", "Dart"],
                    progress: 30, members: 2, maxMembers: 4, openRoles: 2,
                    member: { initials: "ML", name: "Maya Lindberg", role: "Mobile Developer", color: "bg-pink-500" },
                  },
                ].map((p) => (
                  <div key={p.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Recruiting
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{p.type}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{p.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>)}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span><span className="font-semibold text-gray-700">{p.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1"><UsersIcon />{p.members}/{p.maxMembers} members</span>
                      <span className="text-green-600 font-semibold flex items-center gap-1"><UsersIcon />{p.openRoles} open roles</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${p.member.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {p.member.initials}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{p.member.name}</p>
                          <p className="text-xs text-gray-400">{p.member.role}</p>
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>{/* end center */}

        {/* ── RIGHT PANEL ── */}
        <div className="hidden xl:flex flex-col w-72 border-l border-gray-100 bg-gray-50 overflow-y-auto gap-0 px-4 py-5 space-y-4">

          {/* Your Path — gradient card with border radius */}
          <div className="rounded-xl overflow-hidden shadow-sm">
          <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", padding: "20px 20px 16px" }}>
            <p className="text-xs font-medium text-indigo-200 mb-0.5">Your Path</p>
            <h3 className="text-lg font-bold text-white mb-3">Web Development</h3>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-indigo-200">Employability readiness</span>
              <span className="text-xs font-bold text-white">74%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full bg-white" style={{ width: "74%" }} />
            </div>
          </div>

          <div className="bg-white px-5 py-5 flex flex-col gap-4">
            {/* Skill roadmap stages */}
            <div className="space-y-3">
              {[
                { n: 1, stage: "Beginner", done: true },
                { n: 2, stage: "Intermediate", done: true },
                { n: 3, stage: "Advanced", done: false, current: true },
                { n: 4, stage: "Professional", done: false },
              ].map(({ n, stage, done, current }) => (
                <div key={stage} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    done ? "bg-green-500" : current ? "bg-indigo-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {done ? <CheckCircleSolid /> : <span className={current ? "text-white" : ""}>{n}</span>}
                  </div>
                  <span className={`text-sm flex-1 ${done ? "text-gray-700 font-medium" : current ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                    {stage}
                  </span>
                  {current && <span className="text-xs text-indigo-500 font-semibold">In progress</span>}
                </div>
              ))}
            </div>

            <button className="w-full border border-gray-200 text-sm text-gray-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">
              View full roadmap
            </button>

          </div>{/* end bg-white skills section */}
          </div>{/* end rounded-xl Your Path card */}

          {/* Pending invitations card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">🗓️ Pending Invitations</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">Maya Lindberg</span> invited you to join{" "}
              <span className="font-semibold text-gray-900">FitQuest</span> as a Mobile Developer.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors">Accept</button>
              <button className="text-xs font-semibold text-gray-600 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors">Decline</button>
            </div>
          </div>

          {/* Recent achievements card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">✨ Recent Achievements</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "First Steps", Icon: AchFirstSteps },
                { label: "Team Player", Icon: AchTeamPlayer },
                { label: "Code Reviewer", Icon: AchCodeReviewer },
                { label: "Streak Master", Icon: AchStreakMaster },
                { label: "Top Collaborator", Icon: AchCollaborator },
                { label: "Polyglot", Icon: AchPolyglot },
              ].map(({ label, Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm"><Icon /></div>
                  <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Recommended For You</h3>
            <div className="space-y-3">
              {[
                { initial: "C", color: "bg-green-600", title: "Node.js & Backend API Mastery", provider: "Codecademy" },
                { initial: "MX", color: "bg-orange-500", title: "Full-Stack System Design", provider: "MIT xPRO" },
              ].map((r) => (
                <div key={r.title} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${r.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{r.initial}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>{/* end right panel */}

        </div>{/* end content row */}
      </div>{/* end everything right of sidebar */}
    </div>
  )
}
