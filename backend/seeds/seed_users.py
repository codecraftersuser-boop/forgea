"""
Seed 10 realistic test users with full data:
  - profile, skills, certifications
  - badges earned
  - projects (owner + member relationships)
  - course enrollments with progress
  - notifications

Run from the backend directory:
    python -m seeds.seed_users
"""
from __future__ import annotations
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, CareerPath
from app.models.skill import UserSkill, Certification
from app.models.gamification import Badge, UserBadge
from app.models.project import Project, ProjectMember, ProjectTech, ProjectRole
from app.models.course import Course, UserCourse
from app.models.notification import Notification, NotificationType

# ── Helpers ──────────────────────────────────────────────────────────────────

def ago(days=0, hours=0) -> datetime:
    return datetime.utcnow() - timedelta(days=days, hours=hours)

# ── User definitions ──────────────────────────────────────────────────────────

USERS_DATA = [
    {
        "email": "alex.morgan@forgea.dev",
        "full_name": "Alex Morgan",
        "password": "Test1234",
        "bio": "Full-stack developer passionate about building scalable web apps. Open-source contributor and hackathon enthusiast.",
        "university": "MIT",
        "career_path": CareerPath.web,
        "level": 8,
        "xp": 3200,
        "reputation_score": 145,
        "github_url": "https://github.com/alexmorgan",
        "linkedin_url": "https://linkedin.com/in/alexmorgan",
        "portfolio_url": "https://alexmorgan.dev",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        "skills": [
            ("React", 90, 12, True),
            ("TypeScript", 85, 8, True),
            ("Node.js", 80, 6, True),
            ("PostgreSQL", 70, 4, False),
            ("Docker", 65, 3, False),
        ],
        "certifications": [
            ("AWS Certified Developer", "Amazon Web Services", ago(days=120), "https://aws.amazon.com/cert/dev"),
            ("Meta Front-End Developer", "Meta", ago(days=300), "https://coursera.org/meta-frontend"),
        ],
        "badges": ["Code Warrior", "Team Player", "First Project"],
    },
    {
        "email": "sofia.chen@forgea.dev",
        "full_name": "Sofia Chen",
        "password": "Test1234",
        "bio": "Data scientist with 2 years of experience in ML pipelines. Kaggle competition winner. Currently building AI-powered EdTech tools.",
        "university": "Stanford University",
        "career_path": CareerPath.data,
        "level": 10,
        "xp": 4800,
        "reputation_score": 230,
        "github_url": "https://github.com/sofiachen",
        "linkedin_url": "https://linkedin.com/in/sofiachen",
        "portfolio_url": "https://sofiachen.ai",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
        "skills": [
            ("Python", 95, 20, True),
            ("Machine Learning", 90, 15, True),
            ("TensorFlow", 85, 10, True),
            ("SQL", 80, 8, True),
            ("Data Visualization", 75, 6, True),
        ],
        "certifications": [
            ("TensorFlow Developer Certificate", "Google", ago(days=90), "https://tensorflow.org/certificate"),
            ("Deep Learning Specialization", "DeepLearning.AI", ago(days=200), "https://deeplearning.ai"),
            ("Kaggle ML Competition — Top 5%", "Kaggle", ago(days=60), "https://kaggle.com"),
        ],
        "badges": ["Data Pioneer", "Knowledge Seeker", "Top Contributor"],
    },
    {
        "email": "marcus.silva@forgea.dev",
        "full_name": "Marcus Silva",
        "password": "Test1234",
        "bio": "Mobile developer focused on cross-platform apps with Flutter. Love building clean UIs and smooth animations.",
        "university": "University of São Paulo",
        "career_path": CareerPath.mobile,
        "level": 6,
        "xp": 2100,
        "reputation_score": 88,
        "github_url": "https://github.com/marcussilva",
        "linkedin_url": "https://linkedin.com/in/marcussilva",
        "portfolio_url": None,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
        "skills": [
            ("Flutter", 88, 9, True),
            ("Dart", 85, 7, True),
            ("Firebase", 72, 5, False),
            ("Android", 65, 4, False),
            ("iOS/Swift", 50, 2, False),
        ],
        "certifications": [
            ("Google Associate Android Developer", "Google", ago(days=180), "https://developers.google.com/certification"),
        ],
        "badges": ["First Project", "Team Player"],
    },
    {
        "email": "priya.patel@forgea.dev",
        "full_name": "Priya Patel",
        "password": "Test1234",
        "bio": "Backend engineer specializing in microservices and cloud architecture. AWS enthusiast and clean code advocate.",
        "university": "IIT Bombay",
        "career_path": CareerPath.web,
        "level": 9,
        "xp": 3900,
        "reputation_score": 198,
        "github_url": "https://github.com/priyapatel",
        "linkedin_url": "https://linkedin.com/in/priyapatel",
        "portfolio_url": "https://priyapatel.io",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        "skills": [
            ("Python", 92, 14, True),
            ("FastAPI", 88, 10, True),
            ("AWS", 85, 8, True),
            ("Kubernetes", 75, 5, True),
            ("Redis", 70, 4, False),
        ],
        "certifications": [
            ("AWS Solutions Architect", "Amazon Web Services", ago(days=150), "https://aws.amazon.com/cert"),
            ("Certified Kubernetes Administrator", "CNCF", ago(days=80), "https://cncf.io/ck"),
        ],
        "badges": ["Code Warrior", "Knowledge Seeker"],
    },
    {
        "email": "james.okafor@forgea.dev",
        "full_name": "James Okafor",
        "password": "Test1234",
        "bio": "Frontend developer and UX enthusiast. Building accessible, beautiful web interfaces. React + Tailwind CSS is my stack.",
        "university": "University of Lagos",
        "career_path": CareerPath.web,
        "level": 5,
        "xp": 1600,
        "reputation_score": 62,
        "github_url": "https://github.com/jamesokafor",
        "linkedin_url": "https://linkedin.com/in/jamesokafor",
        "portfolio_url": None,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
        "skills": [
            ("React", 78, 6, True),
            ("CSS/Tailwind", 85, 8, True),
            ("JavaScript", 80, 7, True),
            ("Figma", 72, 5, False),
            ("Accessibility", 65, 3, False),
        ],
        "certifications": [
            ("freeCodeCamp Responsive Web Design", "freeCodeCamp", ago(days=400), "https://freecodecamp.org"),
        ],
        "badges": ["First Project"],
    },
    {
        "email": "luna.kim@forgea.dev",
        "full_name": "Luna Kim",
        "password": "Test1234",
        "bio": "Data engineer building reliable ETL pipelines at scale. dbt + Airflow + Spark. Currently learning MLOps.",
        "university": "Seoul National University",
        "career_path": CareerPath.data,
        "level": 7,
        "xp": 2700,
        "reputation_score": 119,
        "github_url": "https://github.com/lunakim",
        "linkedin_url": "https://linkedin.com/in/lunakim",
        "portfolio_url": "https://lunakim.tech",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
        "skills": [
            ("Apache Spark", 82, 7, True),
            ("dbt", 80, 6, True),
            ("Airflow", 78, 5, True),
            ("SQL", 90, 11, True),
            ("Python", 85, 9, True),
        ],
        "certifications": [
            ("dbt Analytics Engineering Certification", "dbt Labs", ago(days=100), "https://dbt.com/certification"),
            ("Apache Spark Developer", "Databricks", ago(days=220), "https://databricks.com"),
        ],
        "badges": ["Data Pioneer", "Knowledge Seeker"],
    },
    {
        "email": "carlos.reyes@forgea.dev",
        "full_name": "Carlos Reyes",
        "password": "Test1234",
        "bio": "iOS developer crafting delightful app experiences. Swift + SwiftUI. App Store published developer with 3 apps.",
        "university": "Universidad Nacional de Colombia",
        "career_path": CareerPath.mobile,
        "level": 7,
        "xp": 2500,
        "reputation_score": 104,
        "github_url": "https://github.com/carlosreyes",
        "linkedin_url": "https://linkedin.com/in/carlosreyes",
        "portfolio_url": "https://carlosreyes.dev",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
        "skills": [
            ("Swift", 90, 11, True),
            ("SwiftUI", 85, 8, True),
            ("Xcode", 88, 9, True),
            ("Core Data", 72, 4, False),
            ("Combine", 68, 3, False),
        ],
        "certifications": [
            ("Apple App Development with Swift", "Apple", ago(days=130), "https://developer.apple.com"),
        ],
        "badges": ["First Project", "Team Player", "Code Warrior"],
    },
    {
        "email": "aisha.hassan@forgea.dev",
        "full_name": "Aisha Hassan",
        "password": "Test1234",
        "bio": "ML researcher working on NLP and large language models. PhD student at Cambridge. Publishing papers and building tools.",
        "university": "University of Cambridge",
        "career_path": CareerPath.data,
        "level": 12,
        "xp": 6200,
        "reputation_score": 310,
        "github_url": "https://github.com/aishahassan",
        "linkedin_url": "https://linkedin.com/in/aishahassan",
        "portfolio_url": "https://aishahassan.ai",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
        "skills": [
            ("PyTorch", 95, 18, True),
            ("NLP / Transformers", 93, 16, True),
            ("Research / Publications", 88, 12, True),
            ("Python", 96, 20, True),
            ("Hugging Face", 90, 14, True),
        ],
        "certifications": [
            ("Deep Learning Specialization", "DeepLearning.AI", ago(days=365), "https://deeplearning.ai"),
            ("Natural Language Processing Specialization", "DeepLearning.AI", ago(days=250), "https://deeplearning.ai"),
            ("Machine Learning Specialization", "Stanford/Coursera", ago(days=500), "https://coursera.org"),
        ],
        "badges": ["Data Pioneer", "Top Contributor", "Knowledge Seeker", "Open Source Hero"],
    },
    {
        "email": "ryan.nakamura@forgea.dev",
        "full_name": "Ryan Nakamura",
        "password": "Test1234",
        "bio": "Full-stack developer with DevOps mindset. Kubernetes, CI/CD, and React. Building developer tools and internal platforms.",
        "university": "Waseda University",
        "career_path": CareerPath.web,
        "level": 8,
        "xp": 3400,
        "reputation_score": 162,
        "github_url": "https://github.com/ryannakamura",
        "linkedin_url": "https://linkedin.com/in/ryannakamura",
        "portfolio_url": None,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=ryan",
        "skills": [
            ("Kubernetes", 80, 7, True),
            ("React", 82, 8, True),
            ("Go", 75, 5, True),
            ("CI/CD", 78, 6, False),
            ("Terraform", 70, 4, False),
        ],
        "certifications": [
            ("Certified Kubernetes Administrator", "CNCF", ago(days=110), "https://cncf.io"),
            ("HashiCorp Terraform Associate", "HashiCorp", ago(days=200), "https://hashicorp.com"),
        ],
        "badges": ["Code Warrior", "Team Player"],
    },
    {
        "email": "nadia.volkov@forgea.dev",
        "full_name": "Nadia Volkov",
        "password": "Test1234",
        "bio": "Android developer and UI/UX designer hybrid. Kotlin + Jetpack Compose. Building apps that users love.",
        "university": "Moscow State University",
        "career_path": CareerPath.mobile,
        "level": 6,
        "xp": 1950,
        "reputation_score": 79,
        "github_url": "https://github.com/nadiavolkov",
        "linkedin_url": "https://linkedin.com/in/nadiavolkov",
        "portfolio_url": "https://nadiavolkov.design",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=nadia",
        "skills": [
            ("Kotlin", 85, 8, True),
            ("Jetpack Compose", 80, 7, True),
            ("Android SDK", 82, 9, True),
            ("Figma", 78, 6, False),
            ("Room Database", 65, 3, False),
        ],
        "certifications": [
            ("Associate Android Developer", "Google", ago(days=160), "https://developers.google.com"),
        ],
        "badges": ["First Project", "Team Player"],
    },
]

# ── Projects to seed ─────────────────────────────────────────────────────────

PROJECTS_DATA = [
    {
        "title": "EduTrack — AI-powered Study Planner",
        "description": "A web app that uses machine learning to generate personalized weekly study plans based on your learning goals, available time, and past performance. Integrates with calendar APIs.",
        "career_path": "web",
        "status": "in_progress",
        "progress": 45,
        "team_size": 4,
        "tech_stack": ["React", "FastAPI", "PostgreSQL", "OpenAI API", "Docker"],
        "open_roles": ["Frontend Developer", "UI/UX Designer"],
        "owner_email": "alex.morgan@forgea.dev",
        "member_emails": [
            ("sofia.chen@forgea.dev", "Data Scientist"),
            ("james.okafor@forgea.dev", "Frontend Developer"),
        ],
    },
    {
        "title": "DataLens — Real-time Analytics Dashboard",
        "description": "Open-source dashboard builder for data teams. Drag-and-drop interface to create charts from SQL queries. Supports PostgreSQL, BigQuery, and Snowflake.",
        "career_path": "data",
        "status": "recruiting",
        "progress": 15,
        "team_size": 5,
        "tech_stack": ["React", "Python", "Apache Spark", "Airflow", "dbt"],
        "open_roles": ["Frontend Developer", "Backend Developer", "Data Engineer"],
        "owner_email": "luna.kim@forgea.dev",
        "member_emails": [
            ("sofia.chen@forgea.dev", "Data Scientist"),
        ],
    },
    {
        "title": "Lingo — Language Learning Mobile App",
        "description": "Cross-platform mobile app (Flutter) for learning programming languages through bite-sized interactive exercises and daily streaks. Gamified learning with XP and badges.",
        "career_path": "mobile",
        "status": "in_progress",
        "progress": 62,
        "team_size": 3,
        "tech_stack": ["Flutter", "Dart", "Firebase", "FastAPI"],
        "open_roles": ["Backend Developer"],
        "owner_email": "marcus.silva@forgea.dev",
        "member_emails": [
            ("nadia.volkov@forgea.dev", "UI/UX Designer"),
            ("carlos.reyes@forgea.dev", "Mobile Developer"),
        ],
    },
    {
        "title": "NLP Benchmark Hub",
        "description": "Community platform for tracking and comparing NLP model benchmarks. Researchers submit results, models are ranked by dataset. Built with FastAPI + React.",
        "career_path": "data",
        "status": "recruiting",
        "progress": 5,
        "team_size": 4,
        "tech_stack": ["FastAPI", "React", "PostgreSQL", "Hugging Face", "Docker"],
        "open_roles": ["Frontend Developer", "Backend Developer", "ML Engineer"],
        "owner_email": "aisha.hassan@forgea.dev",
        "member_emails": [],
    },
    {
        "title": "DevShip — Internal Developer Platform",
        "description": "Kubernetes-based internal platform for deploying microservices with zero config. Teams push code, platform handles CI/CD, autoscaling and monitoring.",
        "career_path": "web",
        "status": "in_progress",
        "progress": 78,
        "team_size": 4,
        "tech_stack": ["Go", "Kubernetes", "Terraform", "React", "Prometheus"],
        "open_roles": ["Frontend Developer"],
        "owner_email": "ryan.nakamura@forgea.dev",
        "member_emails": [
            ("priya.patel@forgea.dev", "Backend Developer"),
            ("alex.morgan@forgea.dev", "Frontend Developer"),
        ],
    },
    {
        "title": "HealthTrack iOS",
        "description": "SwiftUI health and fitness tracker that syncs with Apple Health. Features workout logging, sleep analysis, and personalized recommendations powered by CoreML.",
        "career_path": "mobile",
        "status": "completed",
        "progress": 100,
        "team_size": 3,
        "tech_stack": ["Swift", "SwiftUI", "CoreML", "HealthKit"],
        "open_roles": [],
        "owner_email": "carlos.reyes@forgea.dev",
        "member_emails": [
            ("nadia.volkov@forgea.dev", "UI/UX Designer"),
        ],
    },
]

# ── Course enrollments per user ───────────────────────────────────────────────

ENROLLMENTS = [
    # (user_email, course_title_contains, progress)
    ("alex.morgan@forgea.dev", "CS50's Web Programming", 100),
    ("alex.morgan@forgea.dev", "React Developer Roadmap", 75),
    ("alex.morgan@forgea.dev", "Node.js", 40),
    ("sofia.chen@forgea.dev", "Machine Learning Specialization", 100),
    ("sofia.chen@forgea.dev", "Deep Learning Specialization", 85),
    ("sofia.chen@forgea.dev", "Natural Language Processing", 60),
    ("sofia.chen@forgea.dev", "Data Analysis with Python", 100),
    ("marcus.silva@forgea.dev", "Flutter", 90),
    ("marcus.silva@forgea.dev", "Android Development", 55),
    ("priya.patel@forgea.dev", "Backend Developer Roadmap", 100),
    ("priya.patel@forgea.dev", "Python Roadmap", 80),
    ("priya.patel@forgea.dev", "Docker", 100),
    ("james.okafor@forgea.dev", "HTML Tutorial", 100),
    ("james.okafor@forgea.dev", "CSS Tutorial", 100),
    ("james.okafor@forgea.dev", "JavaScript Tutorial", 70),
    ("james.okafor@forgea.dev", "React Tutorial", 35),
    ("luna.kim@forgea.dev", "SQL", 100),
    ("luna.kim@forgea.dev", "Data Analyst Roadmap", 90),
    ("luna.kim@forgea.dev", "Pandas", 100),
    ("carlos.reyes@forgea.dev", "React Native", 80),
    ("carlos.reyes@forgea.dev", "Flutter", 45),
    ("aisha.hassan@forgea.dev", "Machine Learning Specialization", 100),
    ("aisha.hassan@forgea.dev", "Deep Learning Specialization", 100),
    ("aisha.hassan@forgea.dev", "Natural Language Processing Specialization", 100),
    ("aisha.hassan@forgea.dev", "AI for Everyone", 100),
    ("ryan.nakamura@forgea.dev", "Kubernetes", 100),
    ("ryan.nakamura@forgea.dev", "DevOps", 85),
    ("ryan.nakamura@forgea.dev", "System Design", 60),
    ("nadia.volkov@forgea.dev", "Kotlin", 85),
    ("nadia.volkov@forgea.dev", "Android App Development", 70),
    ("nadia.volkov@forgea.dev", "Flutter", 30),
]


def seed(db: Session) -> None:
    print("🌱 Seeding test users...")

    # Fetch existing badges by name
    badge_map: dict[str, Badge] = {b.name: b for b in db.query(Badge).all()}

    # Fetch courses for enrollments
    courses_list = db.query(Course).all()

    user_map: dict[str, User] = {}

    # ── 1. Create users ──────────────────────────────────────────────────────
    for u in USERS_DATA:
        if db.query(User).filter(User.email == u["email"]).first():
            print(f"  ⚠  {u['email']} already exists, skipping")
            continue

        user = User(
            email=u["email"],
            full_name=u["full_name"],
            hashed_password=hash_password(u["password"]),
            bio=u["bio"],
            university=u["university"],
            career_path=u["career_path"],
            level=u["level"],
            xp=u["xp"],
            reputation_score=u["reputation_score"],
            github_url=u["github_url"],
            linkedin_url=u["linkedin_url"],
            portfolio_url=u["portfolio_url"],
            avatar_url=u["avatar_url"],
        )
        db.add(user)
        db.flush()

        # Skills
        for name, proficiency, endorsements, validated in u["skills"]:
            db.add(UserSkill(
                user_id=user.id,
                name=name,
                proficiency=proficiency,
                endorsement_count=endorsements,
                validated=validated,
            ))

        # Certifications
        for title, issuer, issued_at, url in u["certifications"]:
            db.add(Certification(
                user_id=user.id,
                title=title,
                issuer=issuer,
                issued_at=issued_at,
                credential_url=url,
            ))

        # Badges
        for badge_name in u["badges"]:
            if badge_name in badge_map:
                db.add(UserBadge(
                    user_id=user.id,
                    badge_id=badge_map[badge_name].id,
                    earned_at=ago(days=30),
                ))

        user_map[user.email] = user
        print(f"  ✓ Created {user.full_name} ({user.career_path.value})")

    db.flush()

    # Re-fetch to ensure all users including pre-existing ones are in map
    for u_obj in db.query(User).all():
        if u_obj.email not in user_map:
            user_map[u_obj.email] = u_obj

    # ── 2. Create projects ───────────────────────────────────────────────────
    print("\n🚀 Seeding projects...")
    project_map: dict[str, Project] = {}

    for p in PROJECTS_DATA:
        owner = user_map.get(p["owner_email"])
        if not owner:
            continue
        if db.query(Project).filter(Project.title == p["title"]).first():
            print(f"  ⚠  Project '{p['title']}' already exists, skipping")
            continue

        project = Project(
            title=p["title"],
            description=p["description"],
            career_path=p["career_path"],
            status=p["status"],
            progress=p["progress"],
            team_size=p["team_size"],
            owner_id=owner.id,
        )
        db.add(project)
        db.flush()

        # Tech stack
        for tech in p["tech_stack"]:
            db.add(ProjectTech(project_id=project.id, name=tech))

        # Open roles
        from app.models.project import RoleType
        role_name_map = {r.value: r for r in RoleType}
        for role_name in p["open_roles"]:
            role_enum = role_name_map.get(role_name)
            if role_enum:
                db.add(ProjectRole(project_id=project.id, role=role_enum, is_filled=False))

        # Owner as member
        db.add(ProjectMember(project_id=project.id, user_id=owner.id, role="Owner", joined_at=ago(days=60)))

        # Other members
        for member_email, role in p["member_emails"]:
            member = user_map.get(member_email)
            if member:
                db.add(ProjectMember(
                    project_id=project.id,
                    user_id=member.id,
                    role=role,
                    joined_at=ago(days=45),
                ))

        project_map[p["title"]] = project
        print(f"  ✓ Project '{p['title']}' ({p['status']})")

    db.flush()

    # ── 3. Course enrollments ────────────────────────────────────────────────
    print("\n📚 Seeding enrollments...")
    enrolled = 0
    for user_email, title_contains, progress in ENROLLMENTS:
        user = user_map.get(user_email)
        if not user:
            continue
        course = next((c for c in courses_list if title_contains.lower() in c.title.lower()), None)
        if not course:
            continue
        exists = db.query(UserCourse).filter(
            UserCourse.user_id == user.id,
            UserCourse.course_id == course.id,
        ).first()
        if exists:
            continue
        completed_at = ago(days=10) if progress == 100 else None
        db.add(UserCourse(
            user_id=user.id,
            course_id=course.id,
            progress=progress,
            completed_at=completed_at,
        ))
        enrolled += 1

    print(f"  ✓ {enrolled} enrollments created")

    # ── 4. Notifications ────────────────────────────────────────────────────
    print("\n🔔 Seeding notifications...")
    notif_data = [
        ("alex.morgan@forgea.dev",   NotificationType.project_application, "Sofia Chen applied for Data Scientist in 'EduTrack'",             "/projects/1", True,  ago(hours=3)),
        ("alex.morgan@forgea.dev",   NotificationType.peer_review,         "James Okafor left a code review on your last commit",             "/projects/1", False, ago(hours=1)),
        ("alex.morgan@forgea.dev",   NotificationType.course_recommendation,"New course: 'Advanced TypeScript' matches your roadmap",          "/roadmap",    False, ago(hours=5)),
        ("sofia.chen@forgea.dev",    NotificationType.project_accepted,     "You've been accepted to 'EduTrack' as Data Scientist",            "/projects/1", True,  ago(hours=10)),
        ("sofia.chen@forgea.dev",    NotificationType.team_invitation,      "Luna Kim invited you to join 'DataLens'",                         "/projects/2", False, ago(hours=2)),
        ("marcus.silva@forgea.dev",  NotificationType.project_application,  "Nadia Volkov applied for UI/UX Designer in 'Lingo'",              "/projects/3", True,  ago(days=1)),
        ("marcus.silva@forgea.dev",  NotificationType.course_recommendation,"Complete 'Firebase for Flutter' to level up your skills",         "/roadmap",    False, ago(hours=6)),
        ("luna.kim@forgea.dev",      NotificationType.project_application,  "Sofia Chen applied for Data Scientist in 'DataLens'",             "/projects/2", False, ago(hours=4)),
        ("aisha.hassan@forgea.dev",  NotificationType.peer_review,          "Your NLP paper got 3 new endorsements from the community",        "/profile",    False, ago(hours=2)),
        ("aisha.hassan@forgea.dev",  NotificationType.course_recommendation,"'LLM Fine-tuning Masterclass' is trending in your field",         "/roadmap",    False, ago(days=1)),
        ("ryan.nakamura@forgea.dev", NotificationType.project_accepted,     "Priya Patel joined 'DevShip' as Backend Developer",               "/projects/5", True,  ago(days=2)),
        ("ryan.nakamura@forgea.dev", NotificationType.project_application,  "Alex Morgan applied for Frontend Developer in 'DevShip'",         "/projects/5", True,  ago(days=3)),
        ("priya.patel@forgea.dev",   NotificationType.project_accepted,     "You've been accepted to 'DevShip' as Backend Developer",          "/projects/5", True,  ago(days=2)),
        ("james.okafor@forgea.dev",  NotificationType.project_accepted,     "You've been accepted to 'EduTrack' as Frontend Developer",        "/projects/1", True,  ago(days=5)),
        ("james.okafor@forgea.dev",  NotificationType.course_recommendation,"Your progress on React is at 35% — keep going!",                  "/roadmap",    False, ago(hours=8)),
        ("carlos.reyes@forgea.dev",  NotificationType.project_completed,    "'HealthTrack iOS' has been completed! +200 XP",                   "/projects/6", True,  ago(days=7)),
        ("nadia.volkov@forgea.dev",  NotificationType.project_accepted,     "You've been accepted to 'Lingo' as UI/UX Designer",               "/projects/3", True,  ago(days=4)),
        ("nadia.volkov@forgea.dev",  NotificationType.project_completed,    "'HealthTrack iOS' has been completed! +200 XP",                   "/projects/6", True,  ago(days=7)),
    ]

    for user_email, ntype, message, action_url, is_read, created_at in notif_data:
        user = user_map.get(user_email)
        if not user:
            continue
        db.add(Notification(
            user_id=user.id,
            type=ntype,
            message=message,
            is_read=is_read,
            action_url=action_url,
            created_at=created_at,
        ))

    print(f"  ✓ {len(notif_data)} notifications created")

    db.commit()
    print("\n✅ Seed complete!")
    print("\n📋 Test credentials (all passwords: Test1234):")
    print("-" * 50)
    for u in USERS_DATA:
        print(f"  {u['email']:35s} | {u['career_path'].value:6s} | lvl {u['level']}")


if __name__ == "__main__":
    db: Session = SessionLocal()
    try:
        seed(db)
    except Exception as e:
        db.rollback()
        print(f"\n❌ Seed failed: {e}")
        raise
    finally:
        db.close()
