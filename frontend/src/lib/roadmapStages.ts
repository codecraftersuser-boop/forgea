export type TechReq = { label: string; tags: string[] }
export type StageRequirement = { stage: string; reqs: TechReq[] }

export const STAGE_REQUIREMENTS: Record<string, StageRequirement[]> = {
  web: [
    { stage: "Beginner", reqs: [
      { label: "HTML & CSS",         tags: ["html", "css", "responsive"] },
      { label: "JavaScript",         tags: ["javascript"] },
      { label: "Git",                tags: ["git"] },
    ]},
    { stage: "Intermediate", reqs: [
      { label: "React",              tags: ["react"] },
      { label: "Node.js / Backend",  tags: ["nodejs", "express", "django"] },
      { label: "SQL / Databases",    tags: ["sql", "mongodb"] },
    ]},
    { stage: "Advanced", reqs: [
      { label: "Testing",            tags: ["testing"] },
      { label: "System Design",      tags: ["system_design", "architecture"] },
      { label: "Modern Frameworks",  tags: ["nextjs", "ssr"] },
    ]},
    { stage: "Professional", reqs: [
      { label: "Cloud / DevOps",     tags: ["cloud", "aws", "devops"] },
      { label: "Containers",         tags: ["docker", "kubernetes"] },
      { label: "Microservices",      tags: ["microservices"] },
    ]},
  ],
  data: [
    { stage: "Beginner", reqs: [
      { label: "Python",             tags: ["python"] },
      { label: "Data Analysis",      tags: ["data_analysis", "pandas", "visualization", "numpy"] },
      { label: "ML Fundamentals",    tags: ["machine_learning", "data_science"] },
    ]},
    { stage: "Intermediate", reqs: [
      { label: "SQL",                tags: ["sql"] },
      { label: "Machine Learning",   tags: ["machine_learning", "sklearn", "feature_engineering"] },
      { label: "Statistics",         tags: ["statistics"] },
    ]},
    { stage: "Advanced", reqs: [
      { label: "Deep Learning",      tags: ["deep_learning", "tensorflow", "pytorch", "neural_networks"] },
      { label: "NLP / Vision",       tags: ["nlp", "computer_vision", "transformers"] },
      { label: "Data Pipelines",     tags: ["airflow", "data_pipelines", "data_engineering"] },
    ]},
    { stage: "Professional", reqs: [
      { label: "MLOps",              tags: ["mlops", "deployment"] },
      { label: "LLM / GenAI",        tags: ["llm", "generative_ai", "prompt_engineering"] },
      { label: "Data Engineering",   tags: ["data_engineering", "spark"] },
    ]},
  ],
  mobile: [
    { stage: "Beginner", reqs: [
      { label: "Mobile Platform",    tags: ["android", "ios", "flutter", "react_native"] },
      { label: "UI Fundamentals",    tags: ["compose", "swiftui", "dart", "javascript"] },
    ]},
    { stage: "Intermediate", reqs: [
      { label: "Platform Depth",     tags: ["android", "ios", "flutter", "react_native", "kotlin", "swift"] },
      { label: "Navigation & UI",    tags: ["architecture", "navigation", "jetpack", "uikit", "animation"] },
    ]},
    { stage: "Advanced", reqs: [
      { label: "Architecture",       tags: ["architecture", "state_management", "testing"] },
      { label: "Backend Integration",tags: ["firebase", "backend_integration"] },
    ]},
    { stage: "Professional", reqs: [
      { label: "Performance",        tags: ["performance", "optimization"] },
      { label: "Platform Mastery",   tags: ["certification", "accessibility", "interop"] },
    ]},
  ],
}

export function computeStages(careerPath: string, completedCourseTags: string[]) {
  const stageReqs = STAGE_REQUIREMENTS[careerPath] ?? STAGE_REQUIREMENTS.web
  const completedTags = new Set(completedCourseTags)
  const stages = stageReqs.map((stage) => {
    const reqs = stage.reqs.map((req) => ({
      ...req,
      covered: req.tags.some((t) => completedTags.has(t)),
    }))
    const coveredCount = reqs.filter((r) => r.covered).length
    const done = coveredCount === stage.reqs.length
    const pct = stage.reqs.length > 0 ? Math.round((coveredCount / stage.reqs.length) * 100) : 0
    return { stage: stage.stage, reqs, coveredCount, totalReqs: stage.reqs.length, done, pct }
  })
  const currentIdx = stages.findIndex((s) => !s.done)
  // Overall readiness: total covered reqs / total reqs across all stages
  const totalReqs = stages.reduce((s, st) => s + st.totalReqs, 0)
  const totalCovered = stages.reduce((s, st) => s + st.coveredCount, 0)
  const readiness = totalReqs > 0 ? Math.round((totalCovered / totalReqs) * 100) : 0
  return { stages, currentIdx, readiness }
}
