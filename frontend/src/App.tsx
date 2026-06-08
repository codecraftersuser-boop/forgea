import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Pages
import LoginPage from "@/pages/auth/LoginPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import OnboardingPage from "@/pages/onboarding/OnboardingPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import RoadmapPage from "@/pages/roadmap/RoadmapPage"
import ProjectsPage from "@/pages/projects/ProjectsPage"
import NewProjectPage from "@/pages/projects/NewProjectPage"
import ProfilePage from "@/pages/profile/ProfilePage"
import NotificationsPage from "@/pages/notifications/NotificationsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* App */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
