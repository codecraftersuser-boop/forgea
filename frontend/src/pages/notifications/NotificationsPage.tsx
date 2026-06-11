import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import { useAuthStore } from "@/store/authStore"
import { useNotifications, useMarkRead, useMarkAllRead, useUnreadCount } from "@/hooks/useNotifications"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useQueryClient } from "react-query"
import api from "@/services/api"
import type { Notification } from "@/types"

// ── Icons ──────────────────────────────────────────────────────────────────────
function SearchIcon()      { return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function PlusIcon()        { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellOutlineIcon() { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function CheckIcon()       { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> }

// ── Notification icons ─────────────────────────────────────────────────────────
function IconApplication() {
  return <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"><svg className="w-[18px] h-[18px] text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
}
function IconAccepted() {
  return <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><svg className="w-[18px] h-[18px] text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
}
function IconReview() {
  return <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0"><svg className="w-[18px] h-[18px] text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>
}
function IconCourse() {
  return <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><svg className="w-[18px] h-[18px] text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
}
function IconInvite() {
  return <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><svg className="w-[18px] h-[18px] text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
}
function IconCompleted() {
  return <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><svg className="w-[18px] h-[18px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></div>
}

function notifIcon(type: string) {
  if (type === "project_application")   return <IconApplication />
  if (type === "project_accepted")      return <IconAccepted />
  if (type === "peer_review")           return <IconReview />
  if (type === "course_recommendation") return <IconCourse />
  if (type === "team_invitation")       return <IconInvite />
  return <IconCompleted />
}

function notifTitle(type: string) {
  const map: Record<string, string> = {
    project_application:    "New application",
    project_accepted:       "Application accepted 🎉",
    peer_review:            "New peer review",
    course_recommendation:  "Recommended for you",
    team_invitation:        "Team invitation",
    project_completed:      "Project completed",
  }
  return map[type] ?? "Notification"
}

function timeAgo(isoDate: string) {
  const s = isoDate.endsWith("Z") || isoDate.includes("+") ? isoDate : isoDate + "Z"
  const diff = Math.max(0, Date.now() - new Date(s).getTime())
  if (diff < 60_000) return "just now"
  const mins = Math.floor(diff / 60_000)
  if (mins < 60)     return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)      return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function parseUrl(url: string | null | undefined) {
  if (!url) return {}
  const [path, qs] = url.split("?")
  const p = Object.fromEntries(new URLSearchParams(qs ?? ""))
  const parts = path.split("/").filter(Boolean)
  return {
    projectId:   parts[1] ? Number(parts[1]) : undefined,
    applicantId: p.applicant_id ? Number(p.applicant_id) : undefined,
    roleId:      p.role_id      ? Number(p.role_id)      : undefined,
  }
}

// ── Profile modal ──────────────────────────────────────────────────────────────
function ProfileModal({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/v1/users/${userId}`)
      .then((r) => setProfile(r.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [userId])

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"
  const track = profile?.career_path
    ? profile.career_path.charAt(0).toUpperCase() + profile.career_path.slice(1)
    : "—"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-80 mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">{initials}</div>
          <div>
            <p className="text-white font-bold text-base leading-tight">{profile?.full_name ?? "Loading…"}</p>
            <p className="text-indigo-200 text-xs mt-0.5">{track} · Level {profile?.level ?? "—"}</p>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
        ) : (
          <div className="px-6 py-4 space-y-3">
            {profile?.bio && <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>}
            {profile?.university && <p className="text-xs text-gray-500">🎓 {profile.university}</p>}
            <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-t border-gray-100">
              <span>XP</span><span className="font-bold text-indigo-600">{(profile?.xp ?? 0).toLocaleString()}</span>
            </div>
            {profile?.skills?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.slice(0, 6).map((s: any) => (
                    <span key={s.id} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={onClose} className="w-full mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-2 transition-colors">Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

type HandledMap = Record<number, "accepted" | "declined">

// ── Action buttons ─────────────────────────────────────────────────────────────
function NotifActions({
  n,
  handled,
  onHandle,
}: {
  n: Notification
  handled: HandledMap
  onHandle: (ids: number[], status: "accepted" | "declined") => void
}) {
  const qc = useQueryClient()
  const markRead = useMarkRead()
  const [busy, setBusy]               = useState<string | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  const { projectId, applicantId, roleId } = parseUrl(n.action_url)

  // Mark all notifications that share same project+applicant+role as handled
  function markHandled(status: "accepted" | "declined", extraIds: number[] = []) {
    onHandle([n.id, ...extraIds], status)
  }

  async function accept() {
    setBusy("accept")
    setError(null)
    try {
      if (n.type === "project_application") {
        await api.post(`/api/v1/projects/${projectId}/accept-application`, { user_id: applicantId, role_id: roleId })
      } else if (n.type === "team_invitation") {
        await api.post(`/api/v1/projects/${projectId}/accept-invite`, { role_id: roleId })
      }
      await markRead.mutateAsync(n.id)
      qc.invalidateQueries("notifications")
      markHandled("accepted")
    } catch (e: any) {
      const detail: string = e?.response?.data?.detail ?? "Something went wrong."
      if (e?.response?.status === 409 && detail.toLowerCase().includes("already")) {
        await markRead.mutateAsync(n.id)
        qc.invalidateQueries("notifications")
        markHandled("accepted")
      } else {
        setError(detail)
      }
    } finally {
      setBusy(null)
    }
  }

  async function decline() {
    setBusy("decline")
    setError(null)
    try {
      await markRead.mutateAsync(n.id)
      qc.invalidateQueries("notifications")
      markHandled("declined")
    } finally {
      setBusy(null)
    }
  }

  // ── After action ──────────────────────────────────────────
  const resolvedStatus = handled[n.id]
  if (resolvedStatus === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg mt-3">
        <CheckIcon /> Accepted
      </span>
    )
  }
  if (resolvedStatus === "declined") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg mt-3">
        Declined
      </span>
    )
  }
  // Already handled in a previous session (is_read=true but no local record)
  if (n.is_read) {
    const isInvite = n.type === "team_invitation"
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg mt-3">
        <CheckIcon /> {isInvite ? "Accepted" : "Handled"}
      </span>
    )
  }

  // ── New application ────────────────────────────────────────
  if (n.type === "project_application") {
    const canAccept = !!(projectId && applicantId && roleId)
    return (
      <>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <div className="flex gap-2 mt-3">
          <button
            onClick={accept}
            disabled={busy === "accept" || !canAccept}
            className="text-sm font-semibold px-5 py-1.5 rounded-full text-white transition-opacity disabled:opacity-40"
            style={{ background: "#6d28d9" }}
          >
            {busy === "accept" ? "Accepting…" : "Accept"}
          </button>
          <button
            onClick={decline}
            disabled={busy === "decline"}
            className="text-sm font-semibold px-5 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-60"
          >
            {busy === "decline" ? "…" : "Decline"}
          </button>
          <button
            onClick={() => applicantId && setShowProfile(true)}
            disabled={!applicantId}
            className="text-sm font-semibold px-5 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-40"
          >
            View profile
          </button>
        </div>
        {showProfile && applicantId && <ProfileModal userId={applicantId} onClose={() => setShowProfile(false)} />}
      </>
    )
  }

  // ── Team invitation ────────────────────────────────────────
  if (n.type === "team_invitation") {
    const canAccept = !!(projectId && roleId)
    return (
      <>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <div className="flex gap-2 mt-3">
        <button
          onClick={accept}
          disabled={busy === "accept" || !canAccept}
          className="text-sm font-semibold px-5 py-1.5 rounded-full text-white transition-opacity disabled:opacity-40"
          style={{ background: "#6d28d9" }}
        >
          {busy === "accept" ? "Joining…" : "Accept"}
        </button>
        <button
          onClick={decline}
          disabled={busy === "decline"}
          className="text-sm font-semibold px-5 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-60"
        >
          {busy === "decline" ? "…" : "Decline"}
        </button>
        {projectId && (
          <button
            onClick={() => window.location.assign(`/projects/${projectId}?invited_role_id=${roleId}`)}
            className="text-sm font-semibold px-5 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white transition-colors"
          >
            View project
          </button>
        )}
      </div>
      </>
    )
  }

  return null
}

// ── Leaderboard constants ──────────────────────────────────────────────────────
const AVATAR_COLORS = ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-teal-500", "bg-blue-500"]
const RANK_COLORS   = ["bg-indigo-600 text-white", "bg-purple-500 text-white", "bg-pink-500 text-white", "bg-gray-200 text-gray-600", "bg-gray-200 text-gray-600"]

// ── Page ───────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { user } = useAuthStore()
  const unreadBadge = useUnreadCount()
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead    = useMarkRead()
  const markAllRead = useMarkAllRead()
  const { data: leaderboard = [] } = useLeaderboard(5)

  // Auto-mark all as read when the page is visited
  useEffect(() => {
    if (notifications.length > 0 && notifications.some((n: Notification) => !n.is_read)) {
      markAllRead.mutate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications.length])

  const [handledMap, setHandledMap] = useState<HandledMap>(() => {
    try { return JSON.parse(localStorage.getItem("notif_handled_v4") ?? "{}") } catch { return {} }
  })

  function handleAction(ids: number[], status: "accepted" | "declined") {
    const { applicantId, roleId } = parseUrl(
      notifications.find((n: Notification) => ids.includes(n.id))?.action_url
    )
    const firstNotif = notifications.find((n: Notification) => ids.includes(n.id))
    const { projectId: pid } = parseUrl(firstNotif?.action_url)

    const siblingIds = notifications
      .filter((n: Notification) => {
        const p = parseUrl(n.action_url)
        if (n.type !== firstNotif?.type) return false
        // project_application: match applicant + role
        if (applicantId && roleId) return p.applicantId === applicantId && p.roleId === roleId
        // team_invitation: match project + role
        if (roleId && pid) return p.projectId === pid && p.roleId === roleId
        return false
      })
      .map((n: Notification) => n.id)

    const allIds = Array.from(new Set([...ids, ...siblingIds]))
    setHandledMap((prev) => {
      const next = { ...prev }
      allIds.forEach((id) => { next[id] = status })
      localStorage.setItem("notif_handled_v4", JSON.stringify(next))
      return next
    })
  }

  const unreadCount = notifications.filter((n: Notification) => !n.is_read).length
  const initials = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Notifications</h1>
            <p className="text-xs text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><SearchIcon /></span>
              <input type="text" placeholder="Search courses, projects..." className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64" />
            </div>
            <div className="relative">
              <BellOutlineIcon />
              {unreadBadge > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
            </div>
            <Link to="/projects/new" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              <PlusIcon />New Project
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all">
              {initials}
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Recent activity</h2>
              {unreadCount > 0 && (
                <button onClick={() => markAllRead.mutate()} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  <CheckIcon />Mark all read
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">No notifications yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((n: Notification) => (
                  <div
                    key={n.id}
                    onClick={() => { if (!n.is_read) markRead.mutate(n.id) }}
                    className={`flex gap-4 px-5 py-5 rounded-2xl border transition-colors cursor-pointer ${
                      !n.is_read ? "border-transparent hover:brightness-95" : "bg-white border-gray-100 hover:bg-gray-50"
                    }`}
                    style={!n.is_read ? { background: "#edeafe" } : {}}
                  >
                    {notifIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">{notifTitle(n.type)}</p>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 leading-snug">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                      <div onClick={(e) => e.stopPropagation()}>
                        <NotifActions n={n} handled={handledMap} onHandle={handleAction} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Leaderboard */}
          <aside className="w-72 bg-white border-l border-gray-100 overflow-y-auto flex-shrink-0 px-5 py-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
              <h3 className="text-base font-bold text-gray-900">Leaderboard</h3>
            </div>
            <div className="flex flex-col gap-1">
              {leaderboard.map((entry: any, idx: number) => {
                const isMe = entry.id === user?.id
                const ei = entry.full_name ? entry.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) : "?"
                const track = entry.career_path ? entry.career_path.charAt(0).toUpperCase() + entry.career_path.slice(1) : "—"
                return (
                  <div key={entry.id} className={`flex items-center gap-3 px-3 py-3 rounded-xl ${isMe ? "bg-indigo-50" : ""}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${RANK_COLORS[idx] ?? "bg-gray-200 text-gray-600"}`}>{idx + 1}</span>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>{ei}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{entry.full_name}{isMe ? " (you)" : ""}</p>
                      <p className="text-xs text-gray-400">{track}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{(entry.xp ?? 0).toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
