import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "@/components/layout/ProtectedRoute"

// Pages
import LoginPage from "@/pages/auth/LoginPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"
import OnboardingPage from "@/pages/onboarding/OnboardingPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import RoadmapPage from "@/pages/roadmap/RoadmapPage"
import ProjectsPage from "@/pages/projects/ProjectsPage"
import NewProjectPage from "@/pages/projects/NewProjectPage"
import ProfilePage from "@/pages/profile/ProfilePage"
import NotificationsPage from "@/pages/notifications/NotificationsPage"
import MyProjectsPage from "@/pages/projects/MyProjectsPage"
import MyProjectDetailPage from "@/pages/projects/MyProjectDetailPage"
import ProjectDetailPage from "@/pages/projects/ProjectDetailPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protegidas */}
        <Route path="/dashboard"     element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/roadmap"       element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/projects"      element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/projects/new"  element={<ProtectedRoute><NewProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:id"  element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications"    element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/my-projects"      element={<ProtectedRoute><MyProjectsPage /></ProtectedRoute>} />
        <Route path="/my-projects/:id"  element={<ProtectedRoute><MyProjectDetailPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
