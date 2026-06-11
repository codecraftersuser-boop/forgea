import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { searchService } from "@/services/searchService"

function SearchIcon() {
  return <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
}

const levelColors: Record<string, string> = {
  beginner:     "text-green-600 bg-green-50",
  intermediate: "text-blue-600 bg-blue-50",
  advanced:     "text-purple-600 bg-purple-50",
  professional: "text-orange-600 bg-orange-50",
}

const statusColors: Record<string, string> = {
  recruiting:  "text-green-600 bg-green-50",
  in_progress: "text-blue-600 bg-blue-50",
  completed:   "text-gray-500 bg-gray-100",
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Debounce input 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  const { data, isLoading } = useQuery(
    ["search", debounced],
    () => searchService.search(debounced),
    { enabled: debounced.length >= 2, keepPreviousData: true, staleTime: 30_000 }
  )

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const hasResults = data && (data.courses.length > 0 || data.projects.length > 0)
  const showDropdown = open && debounced.length >= 2

  function closeAndReset() {
    setOpen(false)
    setQuery("")
  }

  return (
    <div ref={wrapperRef} className="relative hidden sm:block">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><SearchIcon /></span>
      <input
        type="text"
        placeholder="Search courses, projects..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false) }}
        className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56"
      />

      {showDropdown && (
        <div className="absolute top-full mt-1.5 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {isLoading && !data && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching…</div>
          )}

          {data && !hasResults && (
            <div className="px-4 py-3 text-sm text-gray-400">No results for "{debounced}"</div>
          )}

          {data && data.courses.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">📚 Courses</p>
              {data.courses.map((c) => (
                <a
                  key={c.id}
                  href={c.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAndReset}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400 truncate">{c.institution}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 capitalize ${levelColors[c.level] ?? "text-gray-500 bg-gray-100"}`}>
                    {c.level}
                  </span>
                </a>
              ))}
            </div>
          )}

          {data && data.projects.length > 0 && (
            <div className="border-t border-gray-100">
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">📁 Projects</p>
              {data.projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { closeAndReset(); navigate(`/projects/${p.id}`) }}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{p.career_path}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 capitalize ${statusColors[p.status] ?? "text-gray-500 bg-gray-100"}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
