import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import logo from "@/assets/logo.png"
import heroImage from "@/assets/login_image.jpg"
import { authService } from "@/services/authService"

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

type Step = "form" | "success" | "invalid"

// Requisitos de contraseña
function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <ul className="mt-2 space-y-1">
      {rules.map((r) => (
        <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.ok ? "text-green-600" : "text-gray-400"}`}>
          <svg className={`w-3.5 h-3.5 flex-shrink-0 ${r.ok ? "text-green-500" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {r.label}
        </li>
      ))}
    </ul>
  )
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [step, setStep] = useState<Step>(token ? "form" : "invalid")
  const [form, setForm] = useState({ password: "", confirm: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.password) errs.password = "Password is required"
    else if (form.password.length < 8) errs.password = "At least 8 characters"
    else if (!/[A-Z]/.test(form.password)) errs.password = "Include at least one uppercase letter"
    else if (!/[0-9]/.test(form.password)) errs.password = "Include at least one number"
    if (!form.confirm) errs.confirm = "Please confirm your password"
    else if (form.password !== form.confirm) errs.confirm = "Passwords don't match"
    return errs
  }

  const [serverError, setServerError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setServerError("")
    try {
      await authService.resetPassword({ token: token!, password: form.password })
      setStep("success")
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? ""
      if (detail.includes("expired")) {
        setStep("invalid")
      } else if (detail.includes("already used")) {
        setServerError("This reset link has already been used. Please request a new one.")
      } else {
        setServerError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
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
              <img src={heroImage} alt="Students" className="w-full h-auto object-contain rounded-xl" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold leading-tight mb-4">Forge real-world<br />experience.</h1>
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

          <img src={logo} alt="Forgea" className="h-10 w-auto object-contain lg:hidden mb-6" />

          {/* ── Token inválido / expirado ── */}
          {step === "invalid" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Link invalid or expired</h2>
                <p className="mt-2 text-sm text-gray-500">
                  This reset link is no longer valid. Reset links expire after <span className="font-medium text-gray-700">15 minutes</span>.
                </p>
              </div>
              <Link to="/forgot-password">
                <Button type="button" variant="primary" size="lg" className="w-full">
                  Request a new link
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Back to{" "}
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── Formulario nueva contraseña ── */}
          {step === "form" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nueva contraseña */}
                <div>
                  <div className="relative">
                    <Input
                      label="New password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: "" })) }}
                      error={errors.password}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon show={showPwd} />
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>

                {/* Confirmar contraseña */}
                <div className="relative">
                  <Input
                    label="Confirm password"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) => { setForm(p => ({ ...p, confirm: e.target.value })); setErrors(p => ({ ...p, confirm: "" })) }}
                    error={errors.confirm}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>

                {serverError && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{serverError}</span>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
                  Reset password
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500">
                Back to{" "}
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── Éxito ── */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Password updated!</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Your password has been changed successfully. You can now sign in with your new password.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Go to sign in
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
