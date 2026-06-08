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
function GitHubIcon() { return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> }
function LinkedInIcon() { return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }
function PencilIcon() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> }
function CertBadgeIcon() { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> }

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
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
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

// ── Skill bar ─────────────────────────────────────────────
function SkillBar({ name, pct }: { name: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-700">{name}</span>
          {/* Filled check-circle icon — blue, matching mockup */}
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-sm text-gray-500">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Circular progress ─────────────────────────────────────
function CircleProgress({ pct }: { pct: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#3b82f6" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="flex flex-col items-center justify-center z-10">
        <span className="text-2xl font-bold text-gray-900">{pct}%</span>
        <span className="text-xs text-gray-400">ready</span>
      </div>
    </div>
  )
}

// ── Achievement badges ────────────────────────────────────
const achievements = [
  { label: "First Steps", unlocked: true,
    icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { label: "Team Player", unlocked: true,
    icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: "Code Reviewer", unlocked: true,
    icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
  { label: "Streak Master", unlocked: true,
    icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
  { label: "Top Collaborator", unlocked: false,
    icon: <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { label: "Polyglot", unlocked: false,
    icon: <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> },
]

// ── Page ──────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* ── Shared Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">My Profile</h1>
            <p className="text-xs text-gray-400">Your portfolio and employability snapshot</p>
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

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Profile header card */}
          <div className="mx-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm">

            {/* Gradient section: avatar + name + buttons */}
            <div className="relative px-8 py-6 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)" }}>

              {/* Avatar + name side by side */}
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }}>
                  JA
                </div>
                {/* Name + subtitle + tags */}
                <div>
                  <h2 className="text-xl font-bold text-white">Jordan Avery</h2>
                  <p className="text-sm text-indigo-200 mt-0.5">Final-year CS Student · University of Manchester</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full">Web Development</span>
                    <span className="text-xs font-semibold bg-yellow-400 text-yellow-900 px-2.5 py-0.5 rounded-full">Level 7</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white border border-white/30 hover:border-white/60 bg-transparent px-3 py-1.5 rounded-lg transition-colors">
                  <GitHubIcon /> GitHub
                </button>
                <button className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white border border-white/30 hover:border-white/60 bg-transparent px-3 py-1.5 rounded-lg transition-colors">
                  <LinkedInIcon /> LinkedIn
                </button>
                <button className="flex items-center gap-1.5 text-sm font-medium bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <PencilIcon /> Edit profile
                </button>
              </div>
            </div>

            {/* White bio section */}
            <div className="bg-white px-8 py-5">
              <p className="text-sm text-gray-600 max-w-2xl">
                Aspiring <span className="font-medium text-gray-800">full-stack engineer</span> focused on building accessible, scalable web products. Open to internship and collaborative project opportunities.
              </p>
            </div>

          </div>

          {/* ── Two-column content ── */}
          <div className="flex gap-5 px-6 py-5 items-start">

            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-5">Skills</h3>
                <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                  <SkillBar name="React" pct={88} />
                  <SkillBar name="TypeScript" pct={82} />
                  <SkillBar name="Node.js" pct={70} />
                  <SkillBar name="PostgreSQL" pct={64} />
                  <SkillBar name="Tailwind CSS" pct={90} />
                  <SkillBar name="Docker" pct={48} />
                </div>
              </div>

              {/* Project Experience */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Project Experience</h3>
                <div className="space-y-3">
                  {[
                    { letter: "E", name: "EcoTrack — Carbon Footprint Analytics", tags: "Python · Airflow · PostgreSQL", pct: 45 },
                    { letter: "W", name: "CampusHub — Student Marketplace", tags: "React · Node.js · PostgreSQL", pct: 72 },
                    { letter: "M", name: "FitQuest — Gamified Fitness App", tags: "Flutter · Firebase · Dart", pct: 30 },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-indigo-50 text-indigo-500">
                        {p.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.tags}</p>
                      </div>
                      <span className="text-sm font-bold text-green-600 flex-shrink-0">{p.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="text-base font-semibold text-gray-800">Certifications</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Meta Front-End Developer", issuer: "Meta", year: "2025" },
                    { name: "Responsive Web Design", issuer: "freeCodeCamp", year: "2024" },
                    { name: "Git & GitHub Professional", issuer: "GitHub", year: "2025" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.issuer} · {c.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right panel */}
            <div className="w-72 flex-shrink-0 space-y-4">

              {/* Employability Readiness */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex justify-center my-2">
                  <CircleProgress pct={74} />
                </div>
                <p className="text-sm font-bold text-gray-800 text-center mt-2">Employability Readiness</p>
                <p className="text-xs text-gray-400 text-center mt-1 leading-relaxed">Based on courses, projects, certifications, and peer reviews.</p>
              </div>

              {/* Reputation score */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">780</p>
                    <p className="text-xs text-gray-400">Reputation score</p>
                  </div>
                </div>
              </div>

              {/* Endorsements */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-800">Endorsements</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { skill: "React", peers: 24 },
                    { skill: "TypeScript", peers: 18 },
                    { skill: "UI Design", peers: 11 },
                  ].map((e) => (
                    <div key={e.skill} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{e.skill}</span>
                      <span className="text-sm text-gray-400">{e.peers} peers</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Achievement Badges</h3>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-1.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        a.unlocked
                          ? "shadow-sm"
                          : "bg-gray-100"
                      }`} style={a.unlocked ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" } : {}}>
                        {a.icon}
                      </div>
                      <span className="text-xs text-gray-500 text-center leading-tight">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
