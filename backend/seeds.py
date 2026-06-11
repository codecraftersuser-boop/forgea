"""
Seed script — creates 10 test users with full data:
  users, skills, certifications, badges, projects,
  project members, tech stack, roles, course enrollments,
  and notifications.

Run:
  docker exec forgea-backend-1 python /app/seeds.py
  -- or locally --
  DATABASE_URL=postgresql://forgea:forgea@localhost:5432/forgea_db python seeds.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://forgea:forgea@localhost:5432/forgea_db")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

import bcrypt
def _hash(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

from app.models.user        import User
from app.models.skill       import UserSkill, Certification
from app.models.gamification import Badge, UserBadge
from app.models.project     import Project, ProjectMember, ProjectTech, ProjectRole
from app.models.course      import Course, UserCourse
from app.models.notification import Notification, NotificationType

# ─────────────────────────────────────────────────────────────────────────────
# DATA
# ─────────────────────────────────────────────────────────────────────────────

USERS_DATA = [
    dict(full_name="Alex Rivera",    email="alex@forgea.dev",    career_path="web",    level=8,  xp=7800,  reputation_score=420,
         bio="Full-stack developer passionate about React and Node.js. Love building scalable web apps.",
         university="MIT", github_url="https://github.com/alexrivera", linkedin_url="https://linkedin.com/in/alexrivera",
         skills=[("React",95),("TypeScript",88),("Node.js",80),("PostgreSQL",70),("Docker",60)],
         certs=[("Meta Front-End Developer","Meta",2024),("AWS Cloud Practitioner","Amazon",2023)],
         badge_names=["First Project","Code Warrior","Team Player"]),

    dict(full_name="Sofia Chen",     email="sofia@forgea.dev",   career_path="data",   level=11, xp=13200, reputation_score=810,
         bio="Data scientist specializing in ML and NLP. Currently researching LLM fine-tuning techniques.",
         university="Stanford University", github_url="https://github.com/sofiachen", linkedin_url="https://linkedin.com/in/sofiachen",
         skills=[("Python",98),("Machine Learning",92),("TensorFlow",85),("SQL",90),("Pandas",95)],
         certs=[("TensorFlow Developer Certificate","Google",2024),("IBM Data Science","IBM",2023),("Deep Learning Specialization","DeepLearning.AI",2024)],
         badge_names=["First Project","Data Pioneer","Knowledge Seeker","Top Contributor"]),

    dict(full_name="Marcus Johnson",  email="marcus@forgea.dev",  career_path="mobile", level=6,  xp=4900,  reputation_score=280,
         bio="Mobile developer focused on React Native and Flutter. Building cross-platform apps.",
         university="Georgia Tech", github_url="https://github.com/marcusj",
         skills=[("React Native",85),("Flutter",70),("JavaScript",80),("Firebase",65),("Kotlin",50)],
         certs=[("Google Associate Android Developer","Google",2023)],
         badge_names=["First Project","Code Warrior"]),

    dict(full_name="Priya Patel",     email="priya@forgea.dev",   career_path="data",   level=9,  xp=9600,  reputation_score=560,
         bio="Data engineer building robust pipelines and analytics platforms. Fan of dbt and Airflow.",
         university="Carnegie Mellon University", github_url="https://github.com/priyap", linkedin_url="https://linkedin.com/in/priyapatel",
         skills=[("Python",90),("Apache Spark",80),("dbt",75),("Airflow",70),("PostgreSQL",85)],
         certs=[("Google Professional Data Engineer","Google",2024),("Databricks Certified","Databricks",2023)],
         badge_names=["Data Pioneer","Team Player","Knowledge Seeker"]),

    dict(full_name="Liam O'Brien",    email="liam@forgea.dev",    career_path="web",    level=5,  xp=3200,  reputation_score=190,
         bio="Backend developer learning FastAPI and microservices. Enjoy clean architecture.",
         university="University of Dublin", github_url="https://github.com/liamob",
         skills=[("Python",75),("FastAPI",70),("Docker",65),("Redis",55),("PostgreSQL",72)],
         certs=[("Python Institute PCEP","Python Institute",2023)],
         badge_names=["First Project"]),

    dict(full_name="Yuki Tanaka",     email="yuki@forgea.dev",    career_path="web",    level=12, xp=15800, reputation_score=940,
         bio="Senior frontend engineer & open-source contributor. Maintainer of 3 npm packages.",
         university="University of Tokyo", github_url="https://github.com/yukitanaka", linkedin_url="https://linkedin.com/in/yukitanaka",
         portfolio_url="https://yuki.dev",
         skills=[("Vue.js",95),("TypeScript",92),("CSS/Tailwind",90),("GraphQL",78),("Testing",82)],
         certs=[("Vue.js Certified Developer","Vue School",2024),("Google UX Design","Google",2023)],
         badge_names=["First Project","Code Warrior","Team Player","Top Contributor","Open Source Hero"]),

    dict(full_name="Isabella Morales", email="isabella@forgea.dev", career_path="mobile", level=7,  xp=6100,  reputation_score=350,
         bio="iOS developer with 3 years of experience. Swift enthusiast building elegant user experiences.",
         university="Universidad de Buenos Aires", github_url="https://github.com/imorales",
         skills=[("Swift",90),("SwiftUI",85),("Xcode",88),("Core Data",70),("UIKit",80)],
         certs=[("Apple Developer Academy","Apple",2022)],
         badge_names=["First Project","Code Warrior"]),

    dict(full_name="Kwame Asante",    email="kwame@forgea.dev",   career_path="data",   level=4,  xp=2100,  reputation_score=110,
         bio="Aspiring data analyst. Learning SQL, Python and data visualization. Open to collaboration!",
         university="University of Ghana",
         skills=[("SQL",65),("Python",55),("Tableau",60),("Excel",80)],
         certs=[],
         badge_names=["First Project"]),

    dict(full_name="Emma Larsson",    email="emma@forgea.dev",    career_path="web",    level=10, xp=11400, reputation_score=670,
         bio="DevOps and backend engineer. Infrastructure as Code evangelist. Kubernetes certified.",
         university="KTH Royal Institute", github_url="https://github.com/emlarsson", linkedin_url="https://linkedin.com/in/emmalarsson",
         skills=[("Kubernetes",88),("Terraform",82),("Go",75),("CI/CD",90),("AWS",80)],
         certs=[("CKA Kubernetes Administrator","CNCF",2024),("AWS Solutions Architect","Amazon",2023)],
         badge_names=["First Project","Code Warrior","Team Player","Knowledge Seeker"]),

    dict(full_name="Nieve Weyder",    email="nieve@forgea.dev",   career_path="web",    level=3,  xp=1200,  reputation_score=60,
         bio="Computer science student learning web development. Excited to build my first real-world project!",
         university="Universidad Nacional",
         skills=[("HTML/CSS",70),("JavaScript",55),("React",40)],
         certs=[("Responsive Web Design","freeCodeCamp",2024)],
         badge_names=["First Project"]),
]

BADGES_DATA = [
    dict(name="First Project",    description="Joined your first project on Forgea",       icon="🚀", xp_reward=50),
    dict(name="Code Warrior",     description="Completed 5 projects successfully",          icon="⚔️", xp_reward=200),
    dict(name="Team Player",      description="Collaborated with 10+ different teammates",  icon="🤝", xp_reward=150),
    dict(name="Data Pioneer",     description="Completed 3 data science projects",          icon="📊", xp_reward=180),
    dict(name="Knowledge Seeker", description="Completed 5 courses on Forgea",              icon="📚", xp_reward=100),
    dict(name="Top Contributor",  description="Ranked in the top 10 leaderboard",           icon="🏆", xp_reward=300),
    dict(name="Open Source Hero", description="Contributed to open-source projects",        icon="🌐", xp_reward=250),
]

PROJECTS_DATA = [
    dict(
        title="AI-Powered Resume Builder",
        description="Build a web app that uses LLMs to analyze job descriptions and generate tailored resumes. Stack: React + FastAPI + OpenAI API.",
        career_path="web", status="in_progress", progress=45, team_size=4,
        owner_email="alex@forgea.dev",
        members=[("sofia@forgea.dev","Data Scientist"),("liam@forgea.dev","Backend Developer")],
        tech=["React","FastAPI","OpenAI","PostgreSQL","Docker"],
        roles=[("Frontend Developer",False),("UI/UX Designer",True)],
    ),
    dict(
        title="Real-time Stock Market Dashboard",
        description="Data pipeline + interactive dashboard for real-time stock analysis using Python, Kafka, and React.",
        career_path="data", status="recruiting", progress=0, team_size=5,
        owner_email="sofia@forgea.dev",
        members=[("priya@forgea.dev","Data Engineer")],
        tech=["Python","Apache Kafka","React","Plotly","PostgreSQL"],
        roles=[("Backend Developer",False),("Data Engineer",True),("Frontend Developer",False)],
    ),
    dict(
        title="Cross-platform Fitness Tracker",
        description="Mobile app for iOS and Android that tracks workouts, nutrition, and sleep using React Native and Firebase.",
        career_path="mobile", status="in_progress", progress=60, team_size=3,
        owner_email="marcus@forgea.dev",
        members=[("isabella@forgea.dev","iOS Developer")],
        tech=["React Native","Firebase","TypeScript","Redux"],
        roles=[("UI/UX Designer",False)],
    ),
    dict(
        title="Open Source DevOps Toolkit",
        description="Collection of Terraform modules and Helm charts for deploying full-stack apps on Kubernetes. Documentation included.",
        career_path="web", status="in_progress", progress=30, team_size=4,
        owner_email="emma@forgea.dev",
        members=[("alex@forgea.dev","Backend Developer"),("liam@forgea.dev","Backend Developer")],
        tech=["Terraform","Kubernetes","Helm","Go","GitHub Actions"],
        roles=[("Frontend Developer",False),("Technical Writer",False)],
    ),
    dict(
        title="ML Model Monitoring Platform",
        description="Platform to track model drift, performance metrics, and data quality for production ML models.",
        career_path="data", status="completed", progress=100, team_size=4,
        owner_email="priya@forgea.dev",
        members=[("sofia@forgea.dev","Data Scientist"),("kwame@forgea.dev","Data Analyst")],
        tech=["Python","MLflow","Grafana","FastAPI","React"],
        roles=[],
    ),
    dict(
        title="E-commerce Component Library",
        description="Accessible, themeable React component library for e-commerce UIs with Storybook documentation.",
        career_path="web", status="recruiting", progress=0, team_size=3,
        owner_email="yuki@forgea.dev",
        members=[],
        tech=["React","TypeScript","Tailwind CSS","Storybook"],
        roles=[("Frontend Developer",False),("UI/UX Designer",False)],
    ),
    dict(
        title="Swift iOS Banking App",
        description="Feature-complete iOS banking prototype: accounts, transfers, biometric auth, and spending analytics.",
        career_path="mobile", status="in_progress", progress=70, team_size=3,
        owner_email="isabella@forgea.dev",
        members=[("marcus@forgea.dev","React Native Developer")],
        tech=["Swift","SwiftUI","Core Data","Face ID","Charts"],
        roles=[("UI/UX Designer",False)],
    ),
    dict(
        title="Climate Data Visualization Tool",
        description="Interactive map showing climate change data over the last 50 years. Built with D3.js and a Python data pipeline.",
        career_path="data", status="completed", progress=100, team_size=3,
        owner_email="kwame@forgea.dev",
        members=[("priya@forgea.dev","Data Engineer"),("yuki@forgea.dev","Frontend Developer")],
        tech=["Python","D3.js","FastAPI","PostgreSQL"],
        roles=[],
    ),
]

# ─────────────────────────────────────────────────────────────────────────────
# SEED FUNCTION
# ─────────────────────────────────────────────────────────────────────────────

def seed():
    with Session() as db:

        # ── 0. Clean existing seed data (safe re-run) ─────────────────────
        print("🧹 Cleaning previous seed data...")
        seed_emails = {u["email"] for u in USERS_DATA}
        existing = db.query(User).filter(User.email.in_(seed_emails)).all()
        for u in existing:
            db.delete(u)

        for b in db.query(Badge).all():
            db.delete(b)

        owned = db.query(Project).all()
        for p in owned:
            db.delete(p)
        db.commit()

        # ── 1. Badges ─────────────────────────────────────────────────────
        print("🏅 Creating badges...")
        badge_map: dict[str, Badge] = {}
        for b in BADGES_DATA:
            badge = Badge(**b)
            db.add(badge)
            db.flush()
            badge_map[b["name"]] = badge

        # ── 2. Users + skills + certs + badges ────────────────────────────
        print("👥 Creating 10 users...")
        user_map: dict[str, User] = {}

        for data in USERS_DATA:
            user = User(
                email=data["email"],
                full_name=data["full_name"],
                hashed_password=_hash("Forgea2026!"),
                career_path=data["career_path"],
                level=data["level"],
                xp=data["xp"],
                reputation_score=data["reputation_score"],
                bio=data.get("bio",""),
                university=data.get("university",""),
                github_url=data.get("github_url"),
                linkedin_url=data.get("linkedin_url"),
                portfolio_url=data.get("portfolio_url"),
            )
            db.add(user)
            db.flush()

            # Skills
            for name, proficiency in data.get("skills", []):
                db.add(UserSkill(
                    user_id=user.id, name=name,
                    proficiency=proficiency,
                    endorsement_count=max(0, int(proficiency / 10) - 2),
                    validated=proficiency >= 80,
                ))

            # Certifications
            for cert_title, issuer, year in data.get("certs", []):
                db.add(Certification(
                    user_id=user.id,
                    title=cert_title,
                    issuer=issuer,
                    issued_at=datetime(year, 6, 1),
                    credential_url=f"https://credentials.example.com/{user.id}-{year}",
                ))

            # Badges
            for badge_name in data.get("badge_names", []):
                if badge_name in badge_map:
                    db.add(UserBadge(user_id=user.id, badge_id=badge_map[badge_name].id,
                                     earned_at=datetime.utcnow() - timedelta(days=30)))

            user_map[data["email"]] = user

        db.flush()

        # ── 3. Course enrollments ─────────────────────────────────────────
        print("📚 Enrolling users in courses...")
        courses = db.query(Course).limit(20).all()
        if courses:
            enrollments = [
                ("alex@forgea.dev",    0, 80),   ("alex@forgea.dev",    1, 100),
                ("sofia@forgea.dev",   2, 100),  ("sofia@forgea.dev",   3, 60),
                ("marcus@forgea.dev",  4, 45),   ("priya@forgea.dev",   5, 90),
                ("priya@forgea.dev",   6, 100),  ("yuki@forgea.dev",    7, 30),
                ("emma@forgea.dev",    8, 75),   ("emma@forgea.dev",    9, 100),
                ("liam@forgea.dev",    10, 20),  ("isabella@forgea.dev",11, 55),
                ("kwame@forgea.dev",   12, 40),  ("nieve@forgea.dev",   13, 15),
            ]
            for email, course_idx, progress in enrollments:
                if email in user_map and course_idx < len(courses):
                    completed_at = datetime.utcnow() - timedelta(days=10) if progress == 100 else None
                    db.add(UserCourse(
                        user_id=user_map[email].id,
                        course_id=courses[course_idx].id,
                        progress=progress,
                        completed_at=completed_at,
                    ))

        db.flush()

        # ── 4. Projects ───────────────────────────────────────────────────
        print("🏗️  Creating 8 projects...")
        for pdata in PROJECTS_DATA:
            owner = user_map.get(pdata["owner_email"])
            if not owner:
                continue

            project = Project(
                title=pdata["title"],
                description=pdata["description"],
                career_path=pdata["career_path"],
                status=pdata["status"],
                progress=pdata["progress"],
                team_size=pdata["team_size"],
                owner_id=owner.id,
            )
            db.add(project)
            db.flush()

            # Owner as member
            db.add(ProjectMember(project_id=project.id, user_id=owner.id, role="Project Owner",
                                  joined_at=datetime.utcnow() - timedelta(days=60)))

            # Other members
            for member_email, role in pdata.get("members", []):
                member = user_map.get(member_email)
                if member:
                    db.add(ProjectMember(project_id=project.id, user_id=member.id, role=role,
                                          joined_at=datetime.utcnow() - timedelta(days=30)))

            # Tech stack
            for tech in pdata.get("tech", []):
                db.add(ProjectTech(project_id=project.id, name=tech))

            # Open roles
            for role_name, is_filled in pdata.get("roles", []):
                db.add(ProjectRole(project_id=project.id, role=role_name, is_filled=is_filled))

        db.flush()

        # ── 5. Notifications ──────────────────────────────────────────────
        print("🔔 Creating notifications...")
        notifs = [
            ("alex@forgea.dev",     NotificationType.project_application,
             "Sofia Chen applied for Frontend Developer in 'AI-Powered Resume Builder'",
             "/projects/1", False),
            ("alex@forgea.dev",     NotificationType.team_invitation,
             "You've been invited to join 'Open Source DevOps Toolkit'",
             "/projects/4", False),
            ("sofia@forgea.dev",    NotificationType.course_recommendation,
             "New course recommended: 'Advanced NLP with Transformers'",
             "/roadmap", True),
            ("sofia@forgea.dev",    NotificationType.project_accepted,
             "Your application to 'AI-Powered Resume Builder' was accepted! Welcome to the team 🎉",
             "/projects/1", False),
            ("marcus@forgea.dev",   NotificationType.peer_review,
             "Liam O'Brien left a peer review on your project 'Cross-platform Fitness Tracker'",
             "/projects/3", True),
            ("priya@forgea.dev",    NotificationType.project_completed,
             "🏆 Congratulations! 'ML Model Monitoring Platform' has been completed. +200 XP awarded",
             "/projects/5", False),
            ("yuki@forgea.dev",     NotificationType.project_application,
             "Emma Larsson applied for Frontend Developer in 'E-commerce Component Library'",
             "/projects/6", False),
            ("yuki@forgea.dev",     NotificationType.team_invitation,
             "You've been invited to join 'Climate Data Visualization Tool'",
             "/projects/8", True),
            ("emma@forgea.dev",     NotificationType.course_recommendation,
             "Based on your skills, we recommend: 'Kubernetes Advanced Patterns'",
             "/roadmap", False),
            ("isabella@forgea.dev", NotificationType.project_accepted,
             "Your application to 'Cross-platform Fitness Tracker' was accepted!",
             "/projects/3", True),
            ("kwame@forgea.dev",    NotificationType.project_completed,
             "🏆 'Climate Data Visualization Tool' is complete! +200 XP awarded",
             "/projects/8", False),
            ("nieve@forgea.dev",    NotificationType.course_recommendation,
             "Start your learning journey: 'Responsive Web Design' is perfect for you",
             "/roadmap", False),
            ("liam@forgea.dev",     NotificationType.peer_review,
             "Alex Rivera endorsed your Python skill",
             "/profile", True),
        ]

        for email, ntype, message, action_url, is_read in notifs:
            user = user_map.get(email)
            if user:
                db.add(Notification(
                    user_id=user.id,
                    type=ntype,
                    message=message,
                    is_read=is_read,
                    action_url=action_url,
                    created_at=datetime.utcnow() - timedelta(hours=2),
                ))

        db.commit()

    print()
    print("✅ Seed complete!")
    print("   10 users  — password for all: Forgea2026!")
    print("    7 badges")
    print("    8 projects")
    print("   13 notifications")
    print()
    print("Test accounts:")
    for u in USERS_DATA:
        print(f"   {u['email']:<28} {u['career_path']:<8} level {u['level']}")


if __name__ == "__main__":
    seed()
