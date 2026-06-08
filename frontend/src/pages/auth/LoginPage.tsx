import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import logo from "@/assets/logo.png"

// ─── Icons ───────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

// ─── Bullet check icon ────────────────────────────────
function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────
type Mode = "login" | "register"

// ─── Component ───────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>("login")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (mode === "register" && !form.name.trim()) errs.name = "El nombre es requerido"
    if (!form.email.trim()) errs.email = "El email es requerido"
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido"
    if (!form.password) errs.password = "La contraseña es requerida"
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres"
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    // TODO: conectar con Supabase Auth
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    if (mode === "register") navigate("/onboarding")
    else navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Hero ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <img src={logo} alt="Forgea" className="h-10 brightness-0 invert" />
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Forge real-world<br />experience.
              </h1>
              <ul className="space-y-3">
                {[
                  "Personalized learning roadmaps",
                  "Collaborate on real-world projects",
                  "Earn verified, peer-reviewed skills",
                  "Build a recruiter-ready portfolio",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-indigo-100">
                    <CheckIcon />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social proof */}
            <div className="border-t border-white/20 pt-6">
              <div className="flex items-center gap-3 mb-2">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {["bg-pink-400", "bg-yellow-400", "bg-green-400", "bg-blue-400"].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-indigo-600 ${color}`} />
                  ))}
                </div>
                <span className="text-sm text-indigo-100">
                  <span className="font-semibold text-white">40,000+</span> students
                </span>
              </div>
              <p className="text-sm text-indigo-200">
                Trusted by students at <span className="text-white font-medium">120+ universities</span> worldwide.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-indigo-300">© 2026 Forgea. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right: Form ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <img src={logo} alt="Forgea" className="h-9" />
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === "login"
                ? "Sign in to continue forging your career."
                : "Join 40,000+ students building real experience."}
            </p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="md" className="w-full" type="button">
              <GoogleIcon />
              Google
            </Button>
            <Button variant="outline" size="md" className="w-full" type="button">
              <GitHubIcon />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <Input
                label="Full name"
                name="name"
                type="text"
                placeholder="Jordan Avery"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
              />
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {mode === "login" && (
                <div className="mt-1.5 text-right">
                  <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>
                New to Forgea?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  )
}
