export type CareerPath = "data" | "web" | "mobile"

export interface User {
  id: number
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  university?: string
  career_path?: CareerPath
  level: number
  xp: number
  reputation_score: number
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  skills: UserSkill[]
  certifications: Certification[]
  badges: Badge[]
}

export interface UserSkill {
  id: number
  name: string
  proficiency: number
  endorsement_count: number
  validated: boolean
}

export interface Certification {
  id: number
  title: string
  issuer: string
  issued_at: string
  credential_url?: string
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  earned_at: string
}

export interface Project {
  id: number
  title: string
  description: string
  career_path: CareerPath
  status: "recruiting" | "in_progress" | "completed"
  progress: number
  team_size: number
  owner: User
  members: ProjectMember[]
  tech_stack: string[]
  open_roles: ProjectRole[]
}

export interface ProjectMember {
  user: User
  role: string
  joined_at: string
}

export interface ProjectRole {
  id: number
  role: string
  is_filled: boolean
}

export interface Course {
  id: number
  title: string
  institution: string
  instructor: string
  career_path: CareerPath
  level: "beginner" | "intermediate" | "advanced" | "professional"
  price: number
  rating: number
  review_count: number
  duration_hours: number
  prestige_score: number
  external_url: string
  thumbnail_url?: string
  last_updated: string
  progress?: number
}

export interface Notification {
  id: number
  type: string
  message: string
  is_read: boolean
  action_url?: string
  created_at: string
}
