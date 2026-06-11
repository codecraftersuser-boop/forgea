import { Link } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import { useAuthStore } from "@/store/authStore"
import { useMyCourses, useCourseActivity } from "@/hooks/useCourses"
import { useProjects } from "@/hooks/useProjects"
import { useUnreadCount } from "@/hooks/useNotifications"
import { computeStages } from "@/lib/roadmapStages"
import type { WeeklyActivity } from "@/services/coursesService"

// ── Icons ─────────────────────────────────────────────────
function SearchIcon()       { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon()         { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon()  { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function StarIcon()         { return <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> }
function ClockIcon()        { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg> }
function UsersIcon()        { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function TrendUpSmIcon()    { return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> }
function CheckCircleSolid() { return <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> }
function ReputationIcon()   { return <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> }
function BookOpenIcon()     { return <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> }
function FolderIcon()       { return <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg> }
function FireIcon()         { return <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> }
function AchFirstSteps()    { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> }
function AchTeamPlayer()    { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function AchCodeReviewer()  { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }
function AchStreakMaster()  { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> }
function AchCollaborator()  { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> }
function AchPolyglot()      { return <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> }

// ── Area Chart ────────────────────────────────────────────
function AreaChart({ weeks }: { weeks: WeeklyActivity[] }) {
  const w = 800; const h = 160
  const values = weeks.map((wk) => wk.enrollments + wk.completions)
  const hasActivity = values.some((v) => v > 0)

  if (!hasActivity) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
        <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4.5-4.5 3 3 4.5-6 3 3" />
        </svg>
        <p className="text-sm">No activity yet — enroll in a course to start tracking</p>
      </div>
    )
  }

  const max = Math.max(...values, 1)
  const pts = values.map((v, i) => {
    const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2
    const y = h - (v / max) * (h - 24) - 12
    return [x, y] as [number, number]
  })
  const linePath = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`
    const [px, py] = pts[i - 1]
    const cpx = (px + x) / 2
    return `${acc} C ${cpx},${py} ${cpx},${y} ${x},${y}`
  }, "")
  const areaPath = `${linePath} L ${w},${h} L 0,${h} Z`

  // Bar data for completions overlay
  const barW = w / values.length - 4

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" />Enrolled</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-400 opacity-70 inline-block rounded-sm" />Completed</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" y1={h * t} x2={w} y2={h * t} stroke="#e5e7eb" strokeWidth="1" />
        ))}
        {/* Completion bars */}
        {weeks.map((wk, i) => {
          const barH = (wk.completions / max) * (h - 24)
          const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2
          return barH > 0 ? (
            <rect
              key={i}
              x={x - barW / 2}
              y={h - barH}
              width={barW}
              height={barH}
              fill="#4ade80"
              opacity={0.4}
              rx={3}
            />
          ) : null
        })}
        {/* Enrollment area + line */}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {pts.map(([x, y], i) => (
          values[i] > 0 && <circle key={i} cx={x} cy={y} r="4" fill="#6366f1" stroke="white" strokeWidth="2" />
        ))}
      </svg>
      {/* X axis labels + tooltips */}
      <div className="flex justify-between px-1 mt-1">
        {weeks.map((wk) => (
          <div key={wk.label} className="flex flex-col items-center gap-0.5 group relative">
            <span className="text-xs text-gray-400">{wk.label}</span>
            {/* Tooltip on hover */}
            {(wk.enrollments > 0 || wk.completions > 0) && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {wk.enrollments > 0 && <div>+{wk.enrollments} enrolled</div>}
                {wk.completions > 0 && <div>✓ {wk.completions} completed</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const levelColors = ["bg-blue-500","bg-purple-500","bg-pink-500","bg-emerald-500","bg-teal-500","bg-orange-500","bg-indigo-600","bg-red-500"]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: myCourses = [] } = useMyCourses()
  const { data: projects = [] } = useProjects()
  const { data: activityWeeks = [] } = useCourseActivity()
  const unread = useUnreadCount()

  const firstName = user?.full_name?.split(" ")[0] ?? "there"
  const initials  = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  // Stats
  const inProgressCourses = myCourses
  const activeProjects    = projects.filter((p) => p.status === "in_progress" || p.status === "recruiting")
  const pathLabel: Record<string, string> = { data: "Data Engineering", web: "Web Development", mobile: "Mobile Development" }

  // Tag-based progression
  const completedCourses = myCourses.filter((c) => !!c.completed_at)
  const completedCourseTags = completedCourses.flatMap((c) => c.tags ?? [])
  const { stages, currentIdx, readiness } = computeStages(user?.career_path ?? "web", completedCourseTags)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName} 👋</h1>
            <p className="text-xs text-gray-500">Here's your career progress today</p>
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

        {/* ── Stat Cards ── */}
        <div className="px-8 pt-6 pb-0 flex-shrink-0">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Reputation Score",    value: String(user?.reputation_score ?? 0),       delta: "+45", deltaColor: "text-green-600 bg-green-50",  Icon: ReputationIcon, iconBg: "bg-teal-50"   },
              { label: "Enrolled Courses",     value: String(myCourses.length),                   delta: null,  deltaColor: "",                            Icon: BookOpenIcon,   iconBg: "bg-purple-50" },
              { label: "Active Projects",     value: String(activeProjects.length),              delta: null,  deltaColor: "",                            Icon: FolderIcon,     iconBg: "bg-green-50"  },
              { label: "Total XP",            value: (user?.xp ?? 0).toLocaleString(),           delta: null,  deltaColor: "",                            Icon: FireIcon,       iconBg: "bg-orange-50" },
            ].map(({ label, value, delta, deltaColor, Icon, iconBg }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}><Icon /></div>
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

        {/* ── Content Row ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* CENTER */}
          <div className="flex-1 min-w-0 overflow-y-auto px-8 py-5 space-y-5">

            {/* Area chart */}
            {(() => {
              const totalEnrolled   = activityWeeks.reduce((s, w) => s + w.enrollments, 0)
              const totalCompleted  = activityWeeks.reduce((s, w) => s + w.completions, 0)
              // Compare last 4 weeks vs prior 4 weeks for the trend badge
              const recent = activityWeeks.slice(4).reduce((s, w) => s + w.enrollments + w.completions, 0)
              const prior  = activityWeeks.slice(0, 4).reduce((s, w) => s + w.enrollments + w.completions, 0)
              const trendPct = prior > 0 ? Math.round(((recent - prior) / prior) * 100) : null
              return (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Learning Activity</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Course enrollments &amp; completions — last 8 weeks
                        {totalEnrolled > 0 && (
                          <span className="ml-2 text-gray-700 font-medium">
                            {totalEnrolled} enrolled · {totalCompleted} completed
                          </span>
                        )}
                      </p>
                    </div>
                    {trendPct !== null && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        trendPct >= 0 ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                      }`}>
                        <TrendUpSmIcon />{trendPct >= 0 ? "+" : ""}{trendPct}% vs prev 4 weeks
                      </span>
                    )}
                  </div>
                  <AreaChart weeks={activityWeeks} />
                </div>
              )
            })()}

            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">My Courses</h2>
                <Link to="/roadmap" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">View all →</Link>
              </div>
              {inProgressCourses.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-sm text-gray-500">No courses enrolled yet.</p>
                  <Link to="/roadmap" className="mt-2 inline-block text-sm text-indigo-600 font-medium hover:underline">Browse courses →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {inProgressCourses.slice(0, 4).map((c) => {
                    const levelColors: Record<string, string> = {
                      beginner:     "text-green-600 border-green-300 bg-green-50",
                      intermediate: "text-blue-600 border-blue-300 bg-blue-50",
                      advanced:     "text-purple-600 border-purple-300 bg-purple-50",
                      professional: "text-orange-600 border-orange-300 bg-orange-50",
                    }
                    const lvlColor = levelColors[c.level] ?? "text-gray-600 border-gray-200 bg-gray-50"
                    const lvlLabel = c.level.charAt(0).toUpperCase() + c.level.slice(1)
                    return (
                      <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                              {c.institution[0]}
                            </div>
                            <span className="text-xs font-medium text-gray-500">{c.institution}</span>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${lvlColor}`}>{lvlLabel}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">{c.title}</h3>
                          {c.instructor && <p className="text-xs text-gray-500 mt-0.5">by {c.instructor}</p>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {c.rating > 0 && <span className="flex items-center gap-1"><StarIcon /><span className="font-semibold text-gray-700">{c.rating.toFixed(1)}</span></span>}
                          {c.duration_hours > 0 && <span className="flex items-center gap-1"><ClockIcon />{c.duration_hours}h</span>}
                          {c.prestige_score > 0 && <span>🏅 {c.prestige_score} prestige</span>}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-bold text-gray-900">{c.price === 0 ? "Free" : `$${c.price}`}</span>
                          <a href={c.external_url} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors">
                            Go to course
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Suggested Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Suggested Projects</h2>
                <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">Browse all →</Link>
              </div>
              {projects.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-sm text-gray-500">No projects available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {projects.filter((p) => p.status === "recruiting").slice(0, 2).map((p, idx) => {
                    const avatarColors = levelColors
                    const memberCount = p.members?.length ?? 0
                    const openCount   = p.open_roles?.filter((r) => !r.is_filled).length ?? 0
                    const lead        = p.members?.[0]?.user ?? p.owner
                    const leadInitials = lead?.full_name
                      ? lead.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
                      : "?"
                    const leadRole = p.members?.[0]?.role ?? "Owner"
                    return (
                      <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Recruiting
                          </span>
                          <span className="text-xs text-gray-400 font-medium capitalize">{p.career_path}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{p.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.tech_stack?.map((t: string) => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{t}</span>)}
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
                          <span className="flex items-center gap-1"><UsersIcon />{memberCount}/{p.team_size} members</span>
                          {openCount > 0 && <span className="text-green-600 font-semibold flex items-center gap-1"><UsersIcon />{openCount} open roles</span>}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                              {leadInitials}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">{lead?.full_name ?? "Unknown"}</p>
                              <p className="text-xs text-gray-400">{leadRole}</p>
                            </div>
                          </div>
                          <Link to={`/projects/${p.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View →</Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>{/* end center */}

          {/* ── RIGHT PANEL ── */}
          <div className="hidden xl:flex flex-col w-72 border-l border-gray-100 bg-gray-50 overflow-y-auto gap-0 px-4 py-5 space-y-4">

            {/* Your Path */}
            <div className="rounded-xl overflow-hidden shadow-sm">
              <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", padding: "20px 20px 16px" }}>
                <p className="text-xs font-medium text-indigo-200 mb-0.5">Your Path</p>
                <h3 className="text-lg font-bold text-white mb-3">
                  {pathLabel[user?.career_path ?? ""] ?? "Not set"}
                </h3>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-indigo-200">Employability readiness</span>
                  <span className="text-xs font-bold text-white">{readiness}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <div className="h-full rounded-full bg-white" style={{ width: `${readiness}%` }} />
                </div>
              </div>
              <div className="bg-white px-5 py-5 flex flex-col gap-4">
                <div className="space-y-2">
                  {stages.map(({ stage, done, pct, coveredCount, totalReqs }, idx) => {
                    const isCurrent = idx === currentIdx
                    const isLocked  = currentIdx !== -1 && idx > currentIdx
                    return (
                      <div key={stage}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            done ? "bg-green-500" : isCurrent ? "bg-indigo-600" : "bg-gray-100 text-gray-400"
                          }`}>
                            {done ? <CheckCircleSolid /> : <span className={isCurrent ? "text-white" : ""}>{idx + 1}</span>}
                          </div>
                          <span className={`text-sm flex-1 ${done ? "text-gray-700 font-medium" : isCurrent ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                            {stage}
                          </span>
                          {isCurrent && (
                            <span className="text-xs text-indigo-500 font-semibold">
                              {coveredCount}/{totalReqs}
                            </span>
                          )}
                          {done && <span className="text-xs text-green-500 font-semibold">✓</span>}
                        </div>
                        {isCurrent && (
                          <div className="ml-10 mt-1">
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <Link to="/roadmap" className="w-full border border-gray-200 text-sm text-gray-600 font-medium py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors text-center block">
                  View full roadmap
                </Link>
              </div>
            </div>

            {/* Recent achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">✨ Recent Achievements</h3>
              {user?.badges && user.badges.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {user.badges.slice(0, 8).map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center gap-1.5">
                      <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm text-white text-lg">
                        {badge.icon}
                      </div>
                      <span className="text-xs text-gray-500 text-center leading-tight">{badge.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "First Steps",       Icon: AchFirstSteps },
                    { label: "Team Player",        Icon: AchTeamPlayer },
                    { label: "Code Reviewer",      Icon: AchCodeReviewer },
                    { label: "Streak Master",      Icon: AchStreakMaster },
                    { label: "Top Collaborator",   Icon: AchCollaborator },
                    { label: "Polyglot",           Icon: AchPolyglot },
                  ].map(({ label, Icon }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm"><Icon /></div>
                      <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Recommended For You</h3>
              {myCourses.length === 0 ? (
                <p className="text-xs text-gray-400">Enroll in courses to get recommendations.</p>
              ) : (
                <div className="space-y-3">
                  {myCourses.slice(0, 2).map((r) => (
                    <a key={r.id} href={r.external_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                        {r.institution[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 leading-tight">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.institution}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>{/* end right panel */}

        </div>{/* end content row */}
      </div>
    </div>
  )
}
