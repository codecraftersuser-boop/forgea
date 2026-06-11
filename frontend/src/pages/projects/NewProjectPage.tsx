import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import SearchBar from "@/components/layout/SearchBar"
import { useAuthStore } from "@/store/authStore"
import { useUnreadCount } from "@/hooks/useNotifications"
import { useCreateProject } from "@/hooks/useProjects"

// ── Icons ─────────────────────────────────────────────────
function PlusIcon()      { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> }
function BellIcon()      { return <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> }
function ArrowLeftIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> }
function RocketIcon()    { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> }
function UsersIcon()     { return <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function PublishIcon()   { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> }
function XIcon()         { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> }

function nameInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function NewProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const unread = useUnreadCount()
  const createProject = useCreateProject()

  const [title, setTitle]           = useState("")
  const [description, setDescription] = useState("")
  const [careerPath, setCareerPath] = useState("web")
  const [teamSize, setTeamSize]     = useState(4)
  const [techInput, setTechInput]   = useState("")
  const [techStack, setTechStack]   = useState<string[]>([])
  const [roleInput, setRoleInput]   = useState("")
  const [roles, setRoles]           = useState<string[]>([])
  const [error, setError]           = useState<string | null>(null)

  const initials = user?.full_name ? nameInitials(user.full_name) : "?"

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

  const careerPathLabel: Record<string, string> = {
    web:    "Web Development",
    data:   "Data Engineering & Science",
    mobile: "Mobile Development",
    devops: "DevOps",
    design: "UI/UX Design",
  }

  function handlePublish() {
    if (!title.trim()) { setError("Project title is required."); return }
    if (!description.trim()) { setError("Description is required."); return }
    setError(null)
    createProject.mutate(
      { title: title.trim(), description: description.trim(), career_path: careerPath, team_size: teamSize, tech_stack: techStack, open_roles: roles },
      {
        onSuccess: (project: any) => navigate(`/my-projects/${project.id}`),
        onError: (e: any) => setError(e?.response?.data?.detail ?? "Failed to create project."),
      }
    )
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
            <SearchBar />
            <Link to="/notifications" className="relative">
              <BellIcon />
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

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Main form ── */}
          <main className="flex-[3] overflow-y-auto px-8 py-6">

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Project title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. EcoTrack — Carbon Footprint Analytics"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="What are you building, who is it for, and what makes it exciting to work on?"
                      rows={5}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400 resize-y" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Career path</label>
                      <select value={careerPath} onChange={e => setCareerPath(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white appearance-none">
                        <option value="web">Web Development</option>
                        <option value="data">Data Engineering &amp; Science</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="devops">DevOps</option>
                        <option value="design">UI/UX Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Target team size</label>
                      <input type="number" min={2} max={20} value={teamSize} onChange={e => setTeamSize(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
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
                  <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="Add a technology and press Enter"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400" />
                  <button onClick={addTech} className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors">
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
                  <input type="text" value={roleInput} onChange={e => setRoleInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addRole())}
                    placeholder="e.g. Frontend Developer"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400" />
                  <button onClick={addRole} className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors">
                    <PlusIcon /> Add
                  </button>
                </div>
              </div>

            </div>
          </main>

          {/* ── Right panel: Preview ── */}
          <aside className="flex-[2] bg-gray-50 border-l border-gray-100 overflow-y-auto flex-shrink-0 px-8 py-6 flex flex-col gap-4">

            <h3 className="text-base font-semibold text-gray-800">Preview</h3>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <span className="inline-block text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full mb-3">
                  {careerPathLabel[careerPath]?.split(" ")[0] ?? "Web"}
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

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              onClick={handlePublish}
              disabled={createProject.isLoading}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)" }}
            >
              <PublishIcon />
              {createProject.isLoading ? "Publishing…" : "Publish project"}
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
