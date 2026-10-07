import { createServerFn } from "@tanstack/react-start";

export type PulseSkill = { id: string; label: string; hits: number; score: number };

export type PulseResult = {
  ok: boolean;
  fetchedAt: string;
  sampleSize: number;
  sources: { name: string; count: number; error?: string }[];
  skills: PulseSkill[];
  titles: { title: string; company: string; where: string }[];
  note: string;
};

type RawJob = { title: string; company: string; where: string; text: string };

const TAXONOMY: { id: string; label: string; re: RegExp }[] = [
  { id: "python", label: "Python", re: /\bpython\b/i },
  { id: "dsa", label: "Algorithms", re: /\b(algorithms?|data structures?|leetcode)\b/i },
  { id: "sql", label: "SQL", re: /\b(sql|postgres|mysql)\b/i },
  { id: "git", label: "Git", re: /\bgit\b/i },
  { id: "web", label: "Modern web", re: /\b(react|typescript|next\.?js)\b/i },
  { id: "cloud", label: "Cloud", re: /\b(aws|azure|gcp|google cloud|cloud)\b/i },
  { id: "docker", label: "Containers", re: /\b(docker|kubernetes|k8s)\b/i },
  { id: "system-design", label: "System design", re: /\b(system design|distributed systems?)\b/i },
  { id: "llm", label: "LLMs and retrieval", re: /\b(llm|rag|langchain|generative ai|gpt|openai)\b/i },
  { id: "testing", label: "Testing", re: /\b(unit tests?|pytest|jest|test automation)\b/i },
  { id: "cyber", label: "Security", re: /\b(cyber|appsec|owasp|devsecops)\b/i },
  { id: "data-eng", label: "Data pipelines", re: /\b(airflow|spark|dbt|data engineer|etl)\b/i },
  { id: "ml", label: "Machine learning", re: /\b(machine learning|scikit|xgboost)\b/i },
  { id: "dl", label: "Deep learning", re: /\b(deep learning|pytorch|tensorflow)\b/i },
  { id: "mlops", label: "Model ops", re: /\b(mlops|model monitoring|kubeflow)\b/i },
  { id: "verilog", label: "Verilog", re: /\b(verilog|systemverilog|rtl|fpga)\b/i },
  { id: "embedded", label: "Embedded C", re: /\b(embedded|firmware|microcontroller|stm32|rtos)\b/i },
  { id: "cpp", label: "C / C++", re: /\b(c\+\+|embedded c)\b/i },
  { id: "pcb", label: "PCB", re: /\b(pcb|altium|kicad)\b/i },
  { id: "riscv", label: "RISC-V", re: /\brisc-?v\b/i },
  { id: "linux", label: "Linux", re: /\blinux\b/i },
  { id: "power", label: "Power systems", re: /\b(power systems?|protection relay|switchgear)\b/i },
  { id: "drives", label: "Power electronics", re: /\b(power electronics|inverter|sic|igbt)\b/i },
  { id: "renewables", label: "Renewables", re: /\b(renewable|solar|wind farm|bess)\b/i },
  { id: "plc", label: "PLC", re: /\b(plc|scada|ladder logic)\b/i },
  { id: "gdnt", label: "GD&T", re: /\b(gd&t|geometric dimensioning)\b/i },
  { id: "cad", label: "CAD", re: /\b(solidworks|catia|nx |autocad|cad)\b/i },
  { id: "fea", label: "FEA", re: /\b(fea|finite element|ansys)\b/i },
  { id: "ev", label: "EV systems", re: /\b(ev powertrain|electric vehicle|battery thermal)\b/i },
  { id: "bim", label: "BIM", re: /\b(bim|revit|navisworks)\b/i },
  { id: "struct-soft", label: "Structural tools", re: /\b(etabs|staad|sap2000)\b/i },
  { id: "aspen", label: "Process simulation", re: /\b(aspen|hysys)\b/i },
  { id: "cfd", label: "CFD", re: /\b(cfd|fluent|openfoam)\b/i },
  { id: "battery", label: "Batteries", re: /\b(battery|cell chemistry|gigafactory)\b/i },
];

function strip(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .slice(0, 1800);
}

async function pull(url: string, name: string): Promise<{ name: string; jobs: RawJob[]; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "WhyReport/1.0 (syllabus gap index; educational)",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return { name, jobs: [], error: `${response.status}` };
    }
    const body: unknown = await response.json();
    const jobs = normalize(body).slice(0, 80);
    return { name, jobs };
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return { name, jobs: [], error: message.slice(0, 140) };
  }
}

function normalize(body: unknown): RawJob[] {
  if (!body || typeof body !== "object") return [];
  const record = body as { jobs?: unknown };
  if (!Array.isArray(record.jobs)) return [];
  const jobs: RawJob[] = [];
  for (const item of record.jobs) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const title = String(row.title ?? row.jobTitle ?? "").trim();
    if (!title) continue;
    const company = String(row.company_name ?? row.companyName ?? "Company").trim();
    const where = String(
      row.candidate_required_location ?? row.jobGeo ?? row.category ?? "",
    ).trim();
    const tags = Array.isArray(row.tags) ? row.tags.join(" ") : "";
    const desc = strip(String(row.description ?? row.jobDescription ?? row.jobExcerpt ?? ""));
    jobs.push({ title, company, where: where.slice(0, 80), text: `${title} ${tags} ${desc}` });
  }
  return jobs;
}

export const fetchLivePulse = createServerFn({ method: "GET" }).handler(async (): Promise<PulseResult> => {
  const pulls = await Promise.all([
    pull("https://remotive.com/api/remote-jobs?category=software-dev", "Remotive · software"),
    pull("https://remotive.com/api/remote-jobs?search=embedded", "Remotive · embedded"),
    pull("https://remotive.com/api/remote-jobs?search=mechanical%20engineer", "Remotive · mechanical"),
    pull("https://jobicy.com/api/v2/remote-jobs?count=50&tag=engineering", "Jobicy · engineering"),
  ]);

  const seen = new Set<string>();
  const jobs: RawJob[] = [];
  for (const result of pulls) {
    for (const job of result.jobs) {
      const key = `${job.company}|${job.title}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push(job);
    }
  }

  const hits = new Map<string, number>();
  for (const skill of TAXONOMY) hits.set(skill.id, 0);
  for (const job of jobs) {
    for (const skill of TAXONOMY) {
      if (skill.re.test(job.text)) hits.set(skill.id, (hits.get(skill.id) ?? 0) + 1);
    }
  }
  const maxHit = Math.max(1, ...TAXONOMY.map((skill) => hits.get(skill.id) ?? 0));
  const skills: PulseSkill[] = TAXONOMY.map((skill) => {
    const count = hits.get(skill.id) ?? 0;
    return {
      id: skill.id,
      label: skill.label,
      hits: count,
      score: Math.round((100 * count) / maxHit),
    };
  })
    .filter((skill) => skill.hits >= 2)
    .sort((a, b) => b.hits - a.hits);

  const titles = jobs.slice(0, 8).map((job) => ({
    title: job.title.slice(0, 110),
    company: job.company.slice(0, 60),
    where: job.where,
  }));

  const sampleSize = jobs.length;
  return {
    ok: sampleSize > 0,
    fetchedAt: new Date().toISOString(),
    sampleSize,
    sources: pulls.map((result) => ({
      name: result.name,
      count: result.jobs.length,
      error: result.error,
    })),
    skills,
    titles,
    note:
      sampleSize > 0
        ? "Open web postings from Remotive and Jobicy, read this session. This is a global remote sample, not India’s campus census. It may move a skill’s weight by at most 30%, and only if the word appears at least twice. National ratios on the other pages stay locked to the published reports."
        : "The live feeds did not answer. Skill weights stay on the published anchors. Nothing on the country page was guessed to fill the hole.",
  };
});

export function liveScoreMap(pulse: PulseResult | null): Record<string, number> | undefined {
  if (!pulse?.ok) return undefined;
  const map: Record<string, number> = {};
  for (const skill of pulse.skills) {
    if (skill.hits >= 2) map[skill.id] = skill.score;
  }
  return map;
}
