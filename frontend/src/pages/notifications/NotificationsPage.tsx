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

// ── Notification data ─────────────────────────────────────
type NotifType = "application" | "accepted" | "review" | "course" | "invite" | "completed"

interface Notif {
  id: number
  type: NotifType
  title: string
  body: string
  time: string
  unread?: boolean
  actions?: { label: string; primary?: boolean }[]
}

const notifications: Notif[] = [
  {
    id: 1,
    type: "application",
    title: "New application to EcoTrack",
    body: "Carlos Mendes applied for the Data Analyst role.",
    time: "5m ago",
    unread: true,
    actions: [
      { label: "Accept", primary: true },
      { label: "View profile" },
    ],
  },
  {
    id: 2,
    type: "accepted",
    title: "You're in! 🎉",
    body: "You were accepted into CampusHub as a Frontend Developer.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    type: "review",
    title: "New peer review",
    body: "Daniel Osei rated your collaboration 5.0 and endorsed React.",
    time: "1d ago",
    unread: true,
  },
  {
    id: 4,
    type: "course",
    title: "Recommended for you",
    body: "New course: 'Full-Stack System Design' matches your roadmap.",
    time: "1d ago",
  },
  {
    id: 5,
    type: "invite",
    title: "Team invitation",
    body: "Maya Lindberg invited you to join FitQuest as a Mobile Developer.",
    time: "2d ago",
    actions: [
      { label: "Join team", primary: true },
      { label: "Decline" },
    ],
  },
  {
    id: 6,
    type: "completed",
    title: "Project completed",
    body: "MediPredict was marked complete. Evaluate your teammates now.",
    time: "3d ago",
  },
]

// ── Notification icon per type ────────────────────────────
function NotifIcon({ type }: { type: NotifType }) {
  if (type === "application") return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-100">
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    </div>
  )
  if (type === "accepted") return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </div>
  )
  if (type === "review") return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-100">
      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
    </div>
  )
  if (type === "course") return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    </div>
  )
  if (type === "invite") return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    </div>
  )
  // completed
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    </div>
  )
}

// ── Leaderboard data ──────────────────────────────────────
const leaderboard = [
  { rank: 1, initials: "AR", name: "Aisha Rahman", track: "Data", xp: 9840, avatarBg: "bg-indigo-500", rankBg: "bg-indigo-600 text-white", highlight: false },
  { rank: 2, initials: "DO", name: "Daniel Osei", track: "Web", xp: 8720, avatarBg: "bg-purple-500", rankBg: "bg-purple-500 text-white", highlight: false },
  { rank: 3, initials: "ML", name: "Maya Lindberg", track: "Mobile", xp: 7510, avatarBg: "bg-pink-500", rankBg: "bg-pink-500 text-white", highlight: false },
  { rank: 4, initials: "JA", name: "Jordan Avery", track: "Web", xp: 6240, avatarBg: "bg-indigo-600", rankBg: "bg-gray-200 text-gray-600", highlight: true },
  { rank: 5, initials: "TR", name: "Tomás Rivera", track: "Web", xp: 5980, avatarBg: "bg-green-500", rankBg: "bg-gray-200 text-gray-600", highlight: false },
]

// ── Page ──────────────────────────────────────────────────
export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Everything right of sidebar */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* ── Shared Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Notifications</h1>
            <p className="text-xs text-gray-400">3 unread updates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search courses, projects..."
                className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
              />
            </div>
            <div className="relative">
              <BellOutlineIcon />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <Link
              to="/projects/new"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <PlusIcon />
              New Project
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all">
              JA
            </Link>
          </div>
        </div>

        {/* ── Body row ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Center / main ── */}
          <main className="flex-1 overflow-y-auto px-8 py-6">

            {/* Section label */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Recent activity</h2>
              <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Mark all read
              </button>
            </div>

            {/* Individual cards */}
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-4 px-5 py-4 rounded-xl border transition-colors ${
                    n.unread
                      ? "bg-indigo-50/70 border-indigo-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <NotifIcon type={n.type} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 inline-block" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>

                    {n.actions && (
                      <div className="flex gap-2 mt-3">
                        {n.actions.map((a) => (
                          <button
                            key={a.label}
                            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
                              a.primary
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* ── Right panel ── */}
          <aside className="w-[28rem] bg-gray-50 border-l border-gray-100 overflow-y-auto flex-shrink-0 px-6 py-6">

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                <h3 className="text-sm font-semibold text-gray-800">Leaderboard</h3>
              </div>

              <div className="divide-y divide-gray-50">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 px-5 py-3.5 ${entry.highlight ? "bg-indigo-50" : ""}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${entry.rankBg}`}>
                      {entry.rank}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${entry.avatarBg}`}>
                      {entry.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{entry.name}</p>
                      <p className="text-xs text-gray-400">{entry.track}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{entry.xp.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
