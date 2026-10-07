import type { Skill, TierId } from "@/data/corpus";
import { TIERS } from "@/data/corpus";

/**
 * Change Gap Index.
 *
 * Measures how far a written syllabus, after a tier delivery discount,
 * sits from hiring demand. It does not invent a placement rate.
 *
 * paper    = syllabus depth / 3          (0 absent … 1 core and examined)
 * taught   = paper × tier delivery       (a PDF is not a lab)
 * missing  = 1 − taught
 * heat     = 0.65 + 0.35 × recency       (skills that moved in 24 months weigh more)
 * demand   = anchor, or 0.7×anchor + 0.3×live when the live feed saw the skill
 * gap      = (demand/100) × missing × heat
 * CGI      = 100 × Σ(gap × demand) / Σ(demand)
 *
 * National ratios (candidates per job, employability, placement) are never
 * overwritten by the live feed. That lock is the accuracy rule.
 */
export type SkillExplain = {
  paper: number;
  delivery: number;
  taught: number;
  missing: number;
  heat: number;
  anchor: number;
  demand: number;
  gap: number;
  blended: boolean;
};

export function explainSkill(skill: Skill, tier: TierId, liveScore?: number): SkillExplain {
  const paper = skill.paper / 3;
  const delivery = TIERS[tier].delivery;
  const taught = paper * delivery;
  const missing = 1 - taught;
  const heat = 0.65 + 0.35 * skill.recency;
  const blended = typeof liveScore === "number";
  const demand = blended ? Math.round(0.7 * skill.demand + 0.3 * liveScore) : skill.demand;
  const gap = (demand / 100) * missing * heat;
  return { paper, delivery, taught, missing, heat, anchor: skill.demand, demand, gap, blended };
}

export function changeGapIndex(
  skills: Skill[],
  tier: TierId,
  live?: Record<string, number>,
): number {
  let num = 0;
  let den = 0;
  for (const skill of skills) {
    const explained = explainSkill(skill, tier, live?.[skill.id]);
    num += explained.gap * explained.demand;
    den += explained.demand;
  }
  if (den === 0) return 0;
  return Math.round((100 * num) / den);
}

export function gapLabel(index: number): "Narrow" | "Open" | "Wide" | "Severe" {
  if (index < 36) return "Narrow";
  if (index < 56) return "Open";
  if (index < 76) return "Wide";
  return "Severe";
}

export function paperLabel(paper: 0 | 1 | 2 | 3): string {
  if (paper === 0) return "Absent";
  if (paper === 1) return "Named once";
  if (paper === 2) return "Elective or thin lab";
  return "Core, examined";
}
