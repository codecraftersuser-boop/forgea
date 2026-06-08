import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import logo from "@/assets/logo.png"
import heroImage from "@/assets/login_image.jpg"

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

type Step = "form" | "sent"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("form")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError("El email es requerido"); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Email inválido"); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setStep("sent")
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT: Hero ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 rounded-full opacity-10 translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">

          <div className="flex flex-col gap-3">
            <div className="mb-6">
              <img src={logo} alt="Forgea" className="h-20 w-auto object-contain" />
            </div>
            <div className="w-1/3">
              <img
                src={heroImage}
                alt="Students growing their tech careers"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-6">
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

            <div className="border-t border-white/20 pt-5">
              <div className="flex items-center gap-3 mb-2">
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

          <p className="text-xs text-indigo-300 mt-6">© 2026 Forgea. All rights reserved.</p>
        </div>
      </div>

      {/* ── RIGHT ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Logo móvil */}
          <img src={logo} alt="Forgea" className="h-10 w-auto object-contain lg:hidden mb-6" />

          {step === "form" ? (
            <div className="space-y-6">
              <div>
                <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
                  <ArrowLeftIcon />
                  Back to sign in
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
                <p className="mt-1 text-sm text-gray-500">
                  No worries — enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError("") }}
                  error={error}
                  autoComplete="email"
                />

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Send reset link
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <MailIcon />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="mt-2 text-sm text-gray-500">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 text-left space-y-1">
                <p>• Check your spam folder if you don't see it.</p>
                <p>• The link expires in <span className="font-medium text-gray-700">15 minutes</span>.</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => { setStep("form"); setEmail("") }}
              >
                Try a different email
              </Button>

              <p className="text-sm text-gray-500">
                Back to{" "}
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
