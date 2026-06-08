# Forgea — Architecture & Data Model

## Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Mockups already en React; TS reduce bugs |
| Styles | Tailwind CSS | Desarrollo rápido, fácil de mantener |
| State | Zustand | Ligero, sin boilerplate de Redux |
| Data fetching | React Query | Cache, loading states, refetch automático |
| Backend | FastAPI (Python) | Python familiar, auto-docs, alto rendimiento |
| ORM | SQLAlchemy 2 + Alembic | Type-safe, migraciones controladas |
| Base de datos | PostgreSQL 16 | Relacional, robusto, escala bien |
| Auth | Supabase Auth | Login social listo (Google + GitHub), JWT incluido |
| Deploy | Railway / Render | Gratis para empezar, escala con un click |
| Contenedores | Docker + docker-compose | Entorno reproducible en cualquier máquina |

---

## Estructura del monorepo

```
forgea/
├── frontend/              # React + TypeScript
│   └── src/
│       ├── components/    # UI reutilizables (ui/, layout/)
│       ├── pages/         # Una carpeta por vista
│       ├── hooks/         # Custom hooks
│       ├── store/         # Zustand stores
│       ├── services/      # Llamadas a la API
│       ├── types/         # Tipos TypeScript compartidos
│       └── utils/         # Helpers
│
├── backend/               # FastAPI (Python)
│   └── app/
│       ├── api/v1/routes/ # Endpoints REST por dominio
│       ├── core/          # Config, DB, seguridad
│       ├── models/        # Tablas SQLAlchemy
│       ├── schemas/       # Pydantic request/response
│       ├── services/      # Lógica de negocio
│       ├── repositories/  # Queries a la BD
│       └── utils/
│   ├── migrations/        # Alembic
│   └── tests/
│
├── infra/                 # Docker, Nginx
├── .github/workflows/     # CI/CD
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Modelo de datos

### User
| Campo | Tipo | Notas |
|---|---|---|
| id | int PK | |
| supabase_id | str unique | ID de Supabase Auth |
| email | str unique | |
| full_name | str | |
| career_path | enum | data / web / mobile |
| level | int | Calculado desde XP |
| xp | int | Se acumula con acciones |
| reputation_score | int | Basado en peer reviews |
| university, bio, github_url, linkedin_url, portfolio_url | str | Perfil público |

### Project
| Campo | Tipo | Notas |
|---|---|---|
| id | int PK | |
| title, description | str | |
| career_path | str | data / web / mobile |
| status | enum | recruiting / in_progress / completed |
| progress | int | 0–100% |
| team_size | int | Máximo de miembros |
| owner_id | FK → User | |

**Relaciones:** Project → ProjectMember (n:n con User), ProjectTech (stack), ProjectRole (roles abiertos)

### Course
| Campo | Tipo | Notas |
|---|---|---|
| id | int PK | |
| title, institution, instructor | str | |
| career_path, level | str | |
| price, rating, prestige_score | float/int | Para filtros y orden |
| duration_hours, review_count | int | |
| external_url | str | Link al curso externo |

**Relaciones:** Course → UserCourse (progreso por usuario)

### Gamification
- **Badge**: insignias con nombre, descripción, ícono y XP de recompensa
- **UserBadge**: qué badges tiene cada usuario y cuándo los ganó
- **UserSkill**: habilidades del usuario con % de proficiencia y endorsements

### Notification
| Tipo | Disparador |
|---|---|
| project_application | Alguien aplicó a un rol |
| project_accepted | El usuario fue aceptado |
| peer_review | Recibió una evaluación |
| course_recommendation | Nueva recomendación disponible |
| team_invitation | Invitación directa a un proyecto |
| project_completed | Proyecto marcado como completo |

---

## API Endpoints (v1)

```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/logout

GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/{id}
GET    /api/v1/users/leaderboard

GET    /api/v1/projects/
POST   /api/v1/projects/
GET    /api/v1/projects/{id}
PATCH  /api/v1/projects/{id}
POST   /api/v1/projects/{id}/apply
POST   /api/v1/projects/{id}/complete

GET    /api/v1/courses/
GET    /api/v1/courses/{id}
POST   /api/v1/courses/{id}/enroll
PATCH  /api/v1/courses/{id}/progress

GET    /api/v1/notifications/
PATCH  /api/v1/notifications/{id}/read
PATCH  /api/v1/notifications/read-all
```

---

## Decisiones de arquitectura

**¿Por qué monorepo?**
Con un equipo pequeño de startup, tener frontend y backend en el mismo repo simplifica la coordinación, los PRs y el CI/CD.

**¿Por qué Supabase Auth y no JWT propio?**
Login con Google y GitHub en minutos, sin manejar tokens, refresh, ni seguridad de contraseñas. Cuando escale, Supabase soporta millones de usuarios.

**¿Por qué no Django?**
Django es excelente pero asume server-side rendering. Con un frontend React separado, FastAPI encaja mejor: más liviano, async nativo, y documentación OpenAPI automática.

**¿Cómo escala?**
- Frontend: deploy en Vercel/Netlify (CDN global, gratis)
- Backend: Railway / Render → luego AWS ECS o Kubernetes
- BD: PostgreSQL en Railway → luego RDS con read replicas
- Cache: agregar Redis para sesiones y leaderboard cuando haya carga
