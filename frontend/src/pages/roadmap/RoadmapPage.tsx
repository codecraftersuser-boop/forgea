import { useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import { useAuthStore } from "@/store/authStore"
import { useCourses, useMyCourses, useEnrollCourse, useUpdateProgress } from "@/hooks/useCourses"
import { useUnreadCount } from "@/hooks/useNotifications"
import { STAGE_REQUIREMENTS } from "@/lib/roadmapStages"
import type { Course } from "@/types"

// ── Icons ─────────────────────────────────────────────────
function SearchIcon()      { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon()        { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function StarIcon()        { return <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> }
function ClockIcon()       { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg> }
function BriefcaseIcon()   { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function DataIcon()        { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> }
function CodeIcon()        { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }
function MobileIcon()      { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
function FilterIcon()      { return <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg> }
function ChevronDownIcon() { return <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> }
function CheckSolid()      { return <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> }
function BookIcon()        { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> }

const paths = [
  { id: "data",   label: "Data Engineering & Science", Icon: DataIcon },
  { id: "web",    label: "Web Development",            Icon: CodeIcon },
  { id: "mobile", label: "Mobile Development",         Icon: MobileIcon },
]

const filterTabs = ["All", "Beginner", "Intermediate", "Advanced", "Professional"]

const sortOptions = [
  { value: "rating",      label: "Community rating" },
  { value: "prestige",    label: "Prestige score" },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "duration",    label: "Duration" },
]

const pathDescriptions: Record<string, { title: string; desc: string; skills: string[]; careers: { role: string; range: string }[] }> = {
  data: {
    title: "Data Engineering & Science",
    desc: "Master data pipelines, machine learning and analytics. Build end-to-end systems that transform raw data into business insights.",
    skills: ["Python", "SQL", "Pandas", "Spark", "Airflow", "TensorFlow", "dbt", "Tableau"],
    careers: [
      { role: "Data Analyst",   range: "$65k–$105k" },
      { role: "Data Engineer",  range: "$85k–$135k" },
      { role: "Data Scientist", range: "$90k–$145k" },
      { role: "ML Engineer",    range: "$110k–$170k" },
    ],
  },
  web: {
    title: "Web Development",
    desc: "Become a full-stack engineer. Build responsive interfaces, scalable APIs, and production-grade applications used by millions.",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Next.js", "PostgreSQL", "Tailwind", "Docker"],
    careers: [
      { role: "Frontend Developer",  range: "$75k–$120k" },
      { role: "Backend Developer",   range: "$85k–$130k" },
      { role: "Full-Stack Engineer", range: "$90k–$145k" },
      { role: "DevOps Engineer",     range: "$100k–$160k" },
    ],
  },
  mobile: {
    title: "Mobile Development",
    desc: "Build polished cross-platform apps for iOS and Android. Deliver smooth, performant experiences to billions of mobile users.",
    skills: ["Dart", "Flutter", "React Native", "Swift", "Kotlin", "Firebase", "REST APIs", "App Store"],
    careers: [
      { role: "iOS Developer",    range: "$80k–$130k" },
      { role: "Android Developer",range: "$80k–$130k" },
      { role: "Flutter Developer",range: "$75k–$125k" },
      { role: "Mobile Architect", range: "$120k–$180k" },
    ],
  },
}


const levelBadgeColors: Record<string, string> = {
  beginner:     "text-green-600 border-green-300 bg-green-50",
  intermediate: "text-blue-600 border-blue-300 bg-blue-50",
  advanced:     "text-purple-600 border-purple-300 bg-purple-50",
  professional: "text-orange-600 border-orange-300 bg-orange-50",
}

function sortCourses(courses: Course[], sortBy: string): Course[] {
  return [...courses].sort((a, b) => {
    switch (sortBy) {
      case "rating":     return (b.rating ?? 0) - (a.rating ?? 0)
      case "prestige":   return (b.prestige_score ?? 0) - (a.prestige_score ?? 0)
      case "price_asc":  return (a.price ?? 0) - (b.price ?? 0)
      case "price_desc": return (b.price ?? 0) - (a.price ?? 0)
      case "duration":   return (a.duration_hours ?? 0) - (b.duration_hours ?? 0)
      default:           return 0
    }
  })
}

export default function RoadmapPage() {
  const { user } = useAuthStore()
  const unread = useUnreadCount()

  const defaultPath = user?.career_path ?? "web"
  const [activePath, setActivePath]       = useState<string>(defaultPath)
  const [activeFilter, setActiveFilter]   = useState("All")
  const [sortBy, setSortBy]               = useState("rating")
  const [showSortMenu, setShowSortMenu]   = useState(false)
  // key = "stageIdx-reqLabel", value = expanded
  const [expandedReq, setExpandedReq]     = useState<string | null>(null)

  const { data: allCourses = [], isLoading } = useCourses({
    career_path: activePath,
    level: activeFilter === "All" ? undefined : activeFilter.toLowerCase(),
    limit: 50,
  })
  // Separate fetch for progression panel — all levels, higher limit
  const { data: allPathCourses = [] } = useCourses({ career_path: activePath, limit: 100 })
  const { data: myCourses = [] } = useMyCourses()
  const enroll         = useEnrollCourse()
  const updateProgress = useUpdateProgress()

  const enrolledIds = new Set(myCourses.map((c) => c.id))
  const completedCourses   = myCourses.filter((c) => !!c.completed_at)
  const inProgressCourses  = myCourses.filter((c) => !c.completed_at)

  const sortedCourses = sortCourses(allCourses, sortBy)
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "Sort"

  const initials = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const pathInfo = pathDescriptions[activePath] ?? pathDescriptions.web

  // Tag-based progression
  const stageReqs = STAGE_REQUIREMENTS[activePath] ?? STAGE_REQUIREMENTS.web
  const completedTags = new Set(completedCourses.flatMap((c) => c.tags ?? []))
  const computedStages = stageReqs.map((stage) => {
    const reqsWithStatus = stage.reqs.map((req) => ({
      ...req,
      covered: req.tags.some((t) => completedTags.has(t)),
    }))
    const coveredCount = reqsWithStatus.filter((r) => r.covered).length
    const done = coveredCount === stage.reqs.length
    return { ...stage, reqs: reqsWithStatus, coveredCount, done }
  })
  const currentStageIdx = computedStages.findIndex((s) => !s.done)

  function MyCourseCard({ c, showComplete }: { c: Course; showComplete: boolean }) {
    const lvlLabel = c.level.charAt(0).toUpperCase() + c.level.slice(1)
    const isCompleting = updateProgress.isLoading
    const isCompleted = !showComplete

    return (
      <div className={`rounded-xl border p-5 flex flex-col gap-3 relative overflow-hidden ${
        isCompleted
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          : "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200"
      }`}>
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${isCompleted ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-indigo-400 to-blue-500"}`} />

        <div className="flex items-start justify-between gap-2 mt-1">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
              isCompleted ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"
            }`}>
              {c.institution[0]}
            </div>
            <span className="text-xs font-medium text-gray-500">{c.institution}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            isCompleted ? "text-green-700 border-green-300 bg-green-100" : "text-indigo-700 border-indigo-300 bg-indigo-100"
          }`}>{lvlLabel}</span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-snug">{c.title}</h3>
          {c.instructor && <p className="text-xs text-gray-500 mt-0.5">by {c.instructor}</p>}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          {c.rating > 0 && <span className="flex items-center gap-1"><StarIcon /><span className="font-semibold text-gray-700">{c.rating.toFixed(1)}</span></span>}
          {c.duration_hours > 0 && <span className="flex items-center gap-1"><ClockIcon />{c.duration_hours}h</span>}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 gap-2 border-t border-white/60">
          <a href={c.external_url} target="_blank" rel="noopener noreferrer"
            className={`text-sm font-semibold px-4 py-1.5 rounded-lg text-white transition-colors ${
              isCompleted ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}>
            Go to course
          </a>
          {showComplete && (
            <button
              onClick={() => updateProgress.mutate({ courseId: c.id, progress: 100 })}
              disabled={isCompleting}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isCompleting ? "Saving…" : "✓ Mark done"}
            </button>
          )}
          {isCompleted && c.completed_at && (
            <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              {new Date(c.completed_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>
    )
  }

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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">

          {/* ── My Courses section ── */}
          {myCourses.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <BookIcon />
                <h2 className="text-base font-bold text-gray-900">My Courses</h2>
                <span className="ml-auto text-xs text-gray-400">{completedCourses.length} completed · {inProgressCourses.length} in progress</span>
              </div>

              {inProgressCourses.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">In Progress</p>
                  <div className="grid grid-cols-3 gap-4">
                    {inProgressCourses.map((c) => <MyCourseCard key={c.id} c={c} showComplete={true} />)}
                  </div>
                </div>
              )}

              {completedCourses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Completed</p>
                  <div className="grid grid-cols-3 gap-4">
                    {completedCourses.map((c) => <MyCourseCard key={c.id} c={c} showComplete={false} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Path tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {paths.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActivePath(id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activePath === id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                }`}>
                <Icon />{label}
              </button>
            ))}
          </div>

          {/* Path description + career opportunities */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{pathInfo.title}</h2>
              <p className="text-sm text-gray-500 mb-5">{pathInfo.desc}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {pathInfo.skills.map((s) => (
                  <span key={s} className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BriefcaseIcon /> Career Opportunities
              </p>
              <div className="space-y-3">
                {pathInfo.careers.map(({ role, range }) => (
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">🎓 Roadmap Progression</h3>
              <span className="text-xs text-gray-400">Complete courses tagged with each technology to advance</span>
            </div>

            {completedCourses.length === 0 && (
              <div className="mb-4 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-700">Complete courses below and mark them as done to track your progression here.</p>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              {computedStages.map(({ stage, reqs, coveredCount, done }, idx) => {
                const isCurrent = idx === currentStageIdx || (currentStageIdx === -1 && idx === computedStages.length - 1)
                const isLocked = currentStageIdx !== -1 && idx > currentStageIdx
                const pct = reqs.length > 0 ? Math.round((coveredCount / reqs.length) * 100) : 0
                return (
                  <div key={stage} className={`rounded-xl border p-4 flex flex-col gap-3 transition-opacity ${
                    done    ? "border-green-200 bg-gradient-to-b from-green-50 to-white" :
                    isCurrent ? "border-indigo-200 bg-gradient-to-b from-indigo-50 to-white" :
                    "border-gray-100 bg-gray-50 opacity-50"
                  }`}>
                    {/* Stage header */}
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        done ? "bg-green-500 text-white" : isCurrent ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                      }`}>
                        {done ? <CheckSolid /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        done    ? "bg-green-100 text-green-700" :
                        isCurrent ? "bg-indigo-100 text-indigo-700" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {done ? "Complete" : isCurrent ? "In Progress" : "Locked"}
                      </span>
                    </div>

                    <p className={`text-sm font-bold ${done ? "text-green-900" : isCurrent ? "text-gray-900" : "text-gray-400"}`}>{stage}</p>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-gray-500">{coveredCount}/{reqs.length} technologies</span>
                        <span className={`font-bold ${done ? "text-green-600" : isCurrent ? "text-indigo-600" : "text-gray-400"}`}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${done ? "bg-green-500" : "bg-indigo-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Tech requirements */}
                    <div className="flex flex-col gap-1.5">
                      {reqs.map((req) => {
                        const reqKey = `${idx}-${req.label}`
                        const isExpanded = expandedReq === reqKey
                        // Find up to 3 matching courses (sorted by prestige)
                        const matchingCourses = !req.covered
                          ? allPathCourses
                              .filter((c) => req.tags.some((t) => (c.tags ?? []).includes(t)))
                              .sort((a, b) => b.prestige_score - a.prestige_score)
                              .slice(0, 3)
                          : []
                        return (
                          <div key={req.label}>
                            <button
                              onClick={() => !req.covered && setExpandedReq(isExpanded ? null : reqKey)}
                              disabled={req.covered}
                              className={`w-full flex items-center gap-2 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                                req.covered
                                  ? "bg-green-50 text-green-800 border-green-200 cursor-default"
                                  : isExpanded
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50"
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                req.covered ? "bg-green-500 text-white" : isExpanded ? "bg-indigo-400 text-white" : "bg-gray-200"
                              }`} style={{ fontSize: 8 }}>
                                {req.covered ? "✓" : isExpanded ? "−" : "+"}
                              </span>
                              <span className="flex-1 text-left">{req.label}</span>
                              {!req.covered && <span className="text-[10px] opacity-60">{matchingCourses.length} course{matchingCourses.length !== 1 ? "s" : ""}</span>}
                            </button>

                            {/* Expanded course suggestions */}
                            {isExpanded && matchingCourses.length > 0 && (
                              <div className="mt-1.5 ml-1 flex flex-col gap-1.5 pl-3 border-l-2 border-indigo-200">
                                {matchingCourses.map((c) => {
                                  const enrolled = enrolledIds.has(c.id)
                                  return (
                                    <div key={c.id} className="bg-white rounded-lg border border-gray-100 p-2.5 shadow-sm">
                                      <p className="text-[11px] font-semibold text-gray-800 leading-snug mb-1">{c.title}</p>
                                      <p className="text-[10px] text-gray-400 mb-2">{c.institution} · {c.duration_hours}h · {c.price === 0 ? "Free" : `$${c.price}`}</p>
                                      <div className="flex items-center gap-1.5">
                                        <a
                                          href={c.external_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[10px] font-semibold px-2 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                        >
                                          Ver curso
                                        </a>
                                        {!enrolled && (
                                          <button
                                            onClick={() => enroll.mutate(c.id)}
                                            disabled={enroll.isLoading}
                                            className="text-[10px] font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                          >
                                            Enroll
                                          </button>
                                        )}
                                        {enrolled && (
                                          <span className="text-[10px] font-semibold text-indigo-600">✓ Enrolled</span>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                            {isExpanded && matchingCourses.length === 0 && (
                              <p className="text-[11px] text-gray-400 mt-1 ml-5">No courses found for this technology yet.</p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {!done && isCurrent && coveredCount < reqs.length && (
                      <p className="text-[11px] text-indigo-500 font-medium">
                        👆 Click a requirement to see suggested courses
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filter + sort row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500"><FilterIcon /></div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                {filterTabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-800"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                {currentSortLabel} <ChevronDownIcon />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSortMenu(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course cards */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400">No courses found for this path and level.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 pb-6">
              {sortedCourses.map((c: Course) => {
                const enrolled    = enrolledIds.has(c.id)
                const myCourse    = myCourses.find((mc) => mc.id === c.id)
                const isCompleted = !!myCourse?.completed_at
                const lvlColor    = levelBadgeColors[c.level] ?? "text-gray-600 border-gray-200 bg-gray-50"
                const lvlLabel    = c.level.charAt(0).toUpperCase() + c.level.slice(1)
                const updatedDate = c.last_updated ? new Date(c.last_updated).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""
                return (
                  <div key={c.id} className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 ${isCompleted ? "border-green-200" : "border-gray-100"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          {c.institution[0]}
                        </div>
                        <span className="text-xs font-medium text-gray-500">{c.institution}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isCompleted && (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Completed
                          </span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${lvlColor}`}>{lvlLabel}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug">{c.title}</h3>
                      {c.instructor && <p className="text-xs text-gray-500 mt-0.5">by {c.instructor}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      {c.rating > 0 && <span className="flex items-center gap-1"><StarIcon /><span className="font-semibold text-gray-700">{c.rating.toFixed(1)}</span> ({c.review_count.toLocaleString()})</span>}
                      {c.duration_hours > 0 && <span className="flex items-center gap-1"><ClockIcon />{c.duration_hours}h</span>}
                      {c.prestige_score > 0 && <span>🏅 {c.prestige_score} prestige</span>}
                      {updatedDate && <span>🔄 {updatedDate}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className="text-base font-bold text-gray-900">{c.price === 0 ? "Free" : `$${c.price}`}</span>
                      {enrolled ? (
                        <a href={c.external_url} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                          Go to course
                        </a>
                      ) : (
                        <button
                          onClick={() => enroll.mutate(c.id)}
                          disabled={enroll.isLoading}
                          className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Enroll
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
