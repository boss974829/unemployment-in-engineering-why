import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Rows3, PanelLeft } from "lucide-react";
import {
  AFFILIATES,
  BRANCHES,
  CAMPUSES,
  CITIES,
  COMPANIES,
  DATA_AS_OF,
  FRESHER_WORD,
  SECTORS,
  SOURCES,
  TIERS,
  branchById,
  type Branch,
  type TierId,
} from "@/data/corpus";
import { changeGapIndex, explainSkill, gapLabel, paperLabel } from "@/lib/gap";
import { fetchLivePulse, liveScoreMap, type PulseResult } from "@/lib/live-pulse";
import { cn } from "@/lib/cn";

const CHAPTERS = [
  { id: "why", label: "Why" },
  { id: "country", label: "Country" },
  { id: "branch", label: "Branch" },
  { id: "syllabus", label: "Syllabus" },
  { id: "hiring", label: "Hiring" },
  { id: "colleges", label: "Colleges" },
  { id: "method", label: "Method" },
  { id: "live", label: "Live" },
  { id: "year", label: "This year" },
  { id: "portfolio", label: "Portfolio" },
] as const;

type LayoutMode = "horizon" | "stack";

type Portfolio = {
  name: string;
  college: string;
  line: string;
  proof: string;
  link: string;
};

const EMPTY: Portfolio = { name: "", college: "", line: "", proof: "", link: "" };
const STORE = "why-report-v1";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

function loadStore(): { tier: TierId; branchId: string; layout: LayoutMode; portfolio: Portfolio } | null {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return null;
    const data = JSON.parse(raw) as {
      tier?: TierId;
      branchId?: string;
      layout?: LayoutMode;
      portfolio?: Partial<Portfolio>;
    };
    return {
      tier: data.tier === "t1" || data.tier === "t2" || data.tier === "t3" ? data.tier : "t3",
      branchId: BRANCHES.some((branch) => branch.id === data.branchId) ? data.branchId! : "cse",
      layout: data.layout === "stack" ? "stack" : "horizon",
      portfolio: sanitize(data.portfolio ?? {}),
    };
  } catch {
    return null;
  }
}

function sanitize(input: Partial<Portfolio>): Portfolio {
  const clip = (value: unknown, max: number) =>
    typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
  return {
    name: clip(input.name, 80),
    college: clip(input.college, 120),
    line: clip(input.line, 280),
    proof: clip(input.proof, 180),
    link: clip(input.link, 200),
  };
}

function encodePortfolio(portfolio: Portfolio): string {
  const bytes = new TextEncoder().encode(JSON.stringify(portfolio));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodePortfolio(value: string): Portfolio | null {
  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object") return null;
    const portfolio = sanitize(parsed as Partial<Portfolio>);
    if (!portfolio.name) return null;
    return portfolio;
  } catch {
    return null;
  }
}

export function ReportApp() {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const installRef = useRef<InstallEvent | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("horizon");
  const [tier, setTier] = useState<TierId>("t3");
  const [branchId, setBranchId] = useState("cse");
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState<PulseResult | null>(null);
  const [pulseState, setPulseState] = useState<"loading" | "ready" | "down">("loading");
  const [portfolio, setPortfolio] = useState<Portfolio>(EMPTY);
  const [sharedView, setSharedView] = useState<Portfolio | null>(null);
  const [installOpen, setInstallOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  const branch = branchById(branchId);
  const live = useMemo(() => liveScoreMap(pulse), [pulse]);
  const cgi = changeGapIndex(branch.skills, tier, live);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const fromHash = hash.get("folio");
    const decoded = fromHash ? decodePortfolio(fromHash) : null;
    if (decoded) setSharedView(decoded);
    const stored = loadStore();
    if (stored) {
      setTier(stored.tier);
      setBranchId(stored.branchId);
      setLayout(stored.layout);
      setPortfolio(stored.portfolio);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORE, JSON.stringify({ tier, branchId, layout, portfolio }));
  }, [ready, tier, branchId, layout, portfolio]);

  useEffect(() => {
    let cancelled = false;
    fetchLivePulse()
      .then((result) => {
        if (cancelled) return;
        setPulse(result);
        setPulseState(result.ok ? "ready" : "down");
      })
      .catch(() => {
        if (!cancelled) setPulseState("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      installRef.current = event as InstallEvent;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    const root = trackRef.current;
    if (!root || layout !== "stack") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const index = Number((best.target as HTMLElement).dataset.chapter);
        if (!Number.isNaN(index)) setActive(index);
      },
      { root, threshold: [0.6] },
    );
    root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [layout]);

  useEffect(() => {
    const root = trackRef.current;
    if (!root || layout !== "horizon") return;
    let locked = false;
    const onWheel = (event: WheelEvent) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 8) return;
      const scroller = (event.target as HTMLElement | null)?.closest("[data-scroll-y]") as HTMLElement | null;
      if (scroller && !horizontal) {
        const room = event.deltaY > 0
          ? scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2
          : scroller.scrollTop > 2;
        if (room) return;
      }
      event.preventDefault();
      if (locked) return;
      locked = true;
      const direction = delta > 0 ? 1 : -1;
      setActive((current) => Math.max(0, Math.min(CHAPTERS.length - 1, current + direction)));
      window.setTimeout(() => {
        locked = false;
      }, 450);
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [layout]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        return;
      }
      if (event.key === "ArrowRight") go(Math.min(CHAPTERS.length - 1, active + 1));
      if (event.key === "ArrowLeft") go(Math.max(0, active - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, layout]);

  function go(index: number) {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    setActive(next);
    if (layout !== "stack") return;
    const node = trackRef.current?.querySelector(`[data-chapter="${next}"]`);
    node?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  function install() {
    setInstallOpen(true);
  }

  async function sharePortfolio() {
    const page = sharedView ?? portfolio;
    if (!page.name) return;
    const url = `${window.location.origin}${window.location.pathname}#folio=${encodePortfolio(page)}`;
    const text = `${page.name} — on the report Unemployment in Engineering, Why?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: page.name, text, url });
        return;
      }
    } catch {
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const shownCgi = cgi;

  return (
    <div className="flex h-dvh w-full min-w-0 max-w-full flex-col overflow-hidden bg-bg text-fg">
      <header className="w-full min-w-0 shrink-0 border-b border-line bg-elevated/80 backdrop-blur-xl">
        <div className="flex h-14 min-w-0 items-center gap-3 px-4 md:px-6">
          <p className="text-sm font-semibold tracking-tight">Why</p>
          <p className="hidden min-w-0 truncate text-xs text-muted sm:block">
            Unemployment in engineering · {branch.short} · {TIERS[tier].short}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="tier">
              College tier
            </label>
            <select
              id="tier"
              value={tier}
              onChange={(event) => setTier(event.target.value as TierId)}
              className="h-11 rounded-full border border-line bg-elevated px-3 text-sm md:hidden"
            >
              {(Object.keys(TIERS) as TierId[]).map((id) => (
                <option key={id} value={id}>
                  {TIERS[id].label}
                </option>
              ))}
            </select>
            <div className="hidden items-center rounded-full bg-subtle p-1 md:flex">
              {(Object.keys(TIERS) as TierId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTier(id)}
                  className={cn(
                    "h-9 rounded-full px-3 text-xs font-medium",
                    tier === id ? "bg-elevated text-fg shadow-sm" : "text-muted",
                  )}
                >
                  {TIERS[id].short}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLayout((mode) => (mode === "horizon" ? "stack" : "horizon"))}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-subtle px-4 text-xs font-medium"
            >
              {layout === "horizon" ? <Rows3 size={16} /> : <PanelLeft size={16} />}
              <span className="hidden sm:inline">{layout === "horizon" ? "Read down" : "Read across"}</span>
            </button>
            <button
              type="button"
              onClick={() => void install()}
              className="inline-flex h-11 items-center rounded-full bg-accent px-4 text-xs font-medium text-accent-fg"
            >
              {canInstall ? "Install" : "App"}
            </button>
          </div>
        </div>
        <div className="flex min-w-0 gap-1 overflow-x-auto px-2 md:justify-center md:px-6">
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              aria-current={active === index ? "page" : undefined}
              onClick={() => go(index)}
              className={cn(
                "h-11 shrink-0 border-b-2 px-3 text-xs font-medium",
                active === index ? "border-accent text-accent" : "border-transparent text-muted",
              )}
            >
              {chapter.label}
            </button>
          ))}
        </div>
      </header>

      <div
        ref={trackRef}
        className={cn(
          "relative min-h-0 w-full min-w-0 max-w-full flex-1 overflow-hidden",
          layout === "stack" && "overflow-y-auto overflow-x-hidden snap-y snap-mandatory",
        )}
        onPointerDown={(event) => {
          touchRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = touchRef.current;
          touchRef.current = null;
          if (!start || layout !== "horizon") return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
          go(active + (dx < 0 ? 1 : -1));
        }}
      >
        <Pane index={0} active={active} layout={layout}>
          <Opening go={go} />
        </Pane>
        <Pane index={1} active={active} layout={layout}>
          <Country />
        </Pane>
        <Pane index={2} active={active} layout={layout}>
          <BranchPane
            branch={branch}
            tier={tier}
            cgi={cgi}
            onPick={setBranchId}
            blended={Boolean(live)}
          />
        </Pane>
        <Pane index={3} active={active} layout={layout}>
          <Syllabus branch={branch} tier={tier} live={live} />
        </Pane>
        <Pane index={4} active={active} layout={layout}>
          <Hiring branch={branch} />
        </Pane>
        <Pane index={5} active={active} layout={layout}>
          <Colleges tier={tier} />
        </Pane>
        <Pane index={6} active={active} layout={layout}>
          <Method branch={branch} tier={tier} live={live} cgi={cgi} />
        </Pane>
        <Pane index={7} active={active} layout={layout}>
          <Live pulse={pulse} state={pulseState} />
        </Pane>
        <Pane index={8} active={active} layout={layout}>
          <ThisYear branch={branch} />
        </Pane>
        <Pane index={9} active={active} layout={layout}>
          <PortfolioPane
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            sharedView={sharedView}
            onClearShared={() => {
              setSharedView(null);
              window.history.replaceState(null, "", window.location.pathname);
            }}
            onShare={() => void sharePortfolio()}
            copied={copied}
            branch={branch}
          />
        </Pane>
      </div>

      <div className="flex h-14 shrink-0 items-center justify-between border-t border-line bg-elevated/80 px-4 text-xs text-muted backdrop-blur-xl md:px-6">
        <span className="flex items-center gap-4 tabular-nums">
          <span>
            {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
          <a
            href="https://github.com/boss974829/unemployment-in-engineering-why#readme"
            className="font-medium text-accent"
          >
            README
          </a>
        </span>
        <span className="hidden sm:inline">
          {layout === "horizon" ? "Sideways, one chapter at a time" : "Down the same chapters"} · {DATA_AS_OF}
        </span>
        <span className="flex gap-2">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-subtle text-fg" onClick={() => go(Math.max(0, active - 1))} aria-label="Previous chapter">
            <ArrowLeft size={16} />
          </button>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-subtle text-fg" onClick={() => go(Math.min(CHAPTERS.length - 1, active + 1))} aria-label="Next chapter">
            <ArrowRight size={16} />
          </button>
        </span>
      </div>

      {installOpen ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-fg/40 p-4 backdrop-blur-sm md:items-center" role="dialog" aria-modal="true" aria-labelledby="install-title">
          <div className="sheet w-full max-w-lg rounded-xl bg-elevated p-6">
            <h2 id="install-title" className="font-display text-3xl text-balance">
              Put it on the phone
            </h2>
            <p className="mt-3 text-sm text-pretty text-muted">
              Open this in Chrome. A file saved from WhatsApp or another app will not install. Tap the button. If Chrome warns you, choose Download anyway, then tap Open on why-engineering-1.3.apk. If the phone blocks it, allow Install unknown apps for Chrome and open the file again. The app is named Why Engineering.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://boss974829.github.io/unemployment-in-engineering-why/why-engineering-1.3.apk"
                target="_blank"
                rel="noopener"
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-fg"
              >
                Download the APK
              </a>
              <a
                href="https://github.com/boss974829/unemployment-in-engineering-why#readme"
                className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-accent"
              >
                README
              </a>
              <button type="button" className="h-11 rounded-full bg-subtle px-5 text-sm font-medium" onClick={() => setInstallOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <span className="sr-only">Gap index {shownCgi}</span>
    </div>
  );
}

function Pane({
  index,
  active,
  layout,
  children,
}: {
  index: number;
  active: number;
  layout: LayoutMode;
  children: ReactNode;
}) {
  const slide = layout === "horizon";
  return (
    <section
      data-chapter={index}
      inert={slide && index !== active ? true : undefined}
      className={cn(
        slide ? "chapter-slide absolute inset-0" : "h-full w-full shrink-0 snap-start",
      )}
      style={slide ? { transform: `translateX(${(index - active) * 100}%)` } : undefined}
    >
      <div data-scroll-y className="pane-scroll h-full min-w-0 overflow-y-auto">
        {children}
      </div>
    </section>
  );
}

function Opening({ go }: { go: (index: number) => void }) {
  const figures = [
    ["5.9", "Engineers per open job", "foundit, August 2026. 39.59 lakh candidates, 6.68 lakh jobs."],
    ["9.5", "If you have under three years", "Same snapshot. Freshers are 45% of candidates and 28% of openings."],
    ["15,000", "Entry-level tech seats", "Of 1.23 lakh active tech openings. Xpheno, October 2026."],
    ["72%", "Of undergraduate curricula", "Employers called them misaligned with the work. India Skills Report 2026."],
  ];
  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <p className="text-xs font-semibold text-accent">Report · {DATA_AS_OF}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl text-balance md:text-7xl">
          Unemployment in engineering. Why?
        </h1>
        <p className="mt-5 max-w-xl text-lg text-pretty text-muted md:text-xl">
          The degree kept its timetable. The job changed. This is the distance between what Indian colleges still examine and what companies hired for this year — by branch, by tier, without the story a senior told you in a corridor.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => go(2)} className="h-11 rounded-full bg-accent px-5 text-sm font-medium text-accent-fg">
            Start with your branch
          </button>
          <button type="button" onClick={() => go(1)} className="h-11 rounded-full px-5 text-sm font-medium text-accent">
            The country first
          </button>
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 md:grid-cols-4 md:p-6">
        {figures.map(([value, label, note]) => (
          <article key={label} className="flex flex-col justify-between gap-8 rounded-xl bg-elevated p-5">
            <p className="font-display text-4xl tabular-nums md:text-5xl">{value}</p>
            <div>
              <h2 className="text-sm font-semibold">{label}</h2>
              <p className="mt-2 text-sm text-pretty text-faint">{note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Country() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-5 md:p-8">
      <header className="max-w-3xl">
        <h2 className="font-display text-4xl text-balance md:text-5xl">The country is not short of engineers. It is short of the engineer the requisition describes.</h2>
        <p className="mt-3 text-pretty text-muted">
          Employability rose. Placement did not become a right. Read the words as different measurements, because mixing them is how rumours start.
        </p>
      </header>
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        <Fact value="56.35%" label="India, employable" note="Up from 54.81%. Anyone the test scored ready. Not engineers alone. ISR 2026." />
        <Fact value="70.15%" label="BE / BTech, employable" note="Down a point from 71.5% in 2025. CS 80%, IT 78%. A test, not an offer letter." />
        <Fact value="47.7%" label="Placed, earlier cohorts" note="About 1.64 million of 3.43 million UG enrolments, 2019–20 to 2022–23. Higher study is inside the rest. ThePrint, from AICTE." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-line bg-elevated p-5">
          <h3 className="font-display text-2xl">What moved in 2026</h3>
          <ul className="mt-4 list-none space-y-3 pl-0 text-sm text-pretty text-muted">
            <li>AI and ML hiring on Naukri, September: +20%. Hiring of people with 0–3 years: +1%.</li>
            <li>IT services openings at an 18-month high, and still mostly mid-senior. Entry tech roles were 15,000.</li>
            <li>64% of employers called AI, data, or security skills premium no matter the college. 31% still leaned on an IIT or IIM tag.</li>
            <li>Women’s employability passed men’s, 54% to 51.5%, for the first time in five years of this series.</li>
            <li>Services firms are cutting the old bulk package and raising the digital one. TCS talked about 25,000 campus hires in FY27, with the higher band growing.</li>
          </ul>
        </article>
        <article className="rounded-xl border border-line bg-elevated p-5">
          <h3 className="font-display text-2xl">Where the jobs sit</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {SECTORS.map((sector) => (
              <li key={sector.name} className="border-b border-line pb-3 last:border-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{sector.name}</span>
                  <span className="shrink-0 tabular-nums text-muted">{sector.share}</span>
                </div>
                <p className="mt-1 text-pretty text-faint">{sector.note}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <article className="rounded-xl border border-line p-5">
        <h3 className="text-sm font-medium">Do not treat these as the same number</h3>
        <div className="mt-3 grid gap-3 text-sm text-muted md:grid-cols-3">
          <p className="text-pretty"><span className="text-fg">Employability.</span> Share of test-takers above a cut-off. A person can be employable and unemployed.</p>
          <p className="text-pretty"><span className="text-fg">Campus placement.</span> Offers divided by a cohort the college counted. It misses off-campus jobs and higher study, and it misses people the cell never registered.</p>
          <p className="text-pretty"><span className="text-fg">Candidates per job.</span> Active profiles against active postings on one platform in August 2026. A market snapshot, not the labour force.</p>
        </div>
      </article>
      <SourceList />
    </div>
  );
}

function Fact({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <article className="bg-elevated p-5">
      <p className="font-display text-4xl tabular-nums">{value}</p>
      <h3 className="mt-3 text-sm font-medium">{label}</h3>
      <p className="mt-2 text-sm text-pretty text-faint">{note}</p>
    </article>
  );
}

function BranchPane({
  branch,
  tier,
  cgi,
  onPick,
  blended,
}: {
  branch: Branch;
  tier: TierId;
  cgi: number;
  onPick: (id: string) => void;
  blended: boolean;
}) {
  const tone = cgi >= 56 ? "danger" : cgi < 36 ? "ok" : "neutral";
  return (
    <div className="grid min-h-full md:h-full md:grid-cols-[280px_minmax(0,1fr)]">
      <div data-scroll-y className="pane-scroll border-b border-line md:h-full md:overflow-y-auto md:border-r md:border-b-0">
        {BRANCHES.map((item) => {
          const selected = item.id === branch.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item.id)}
              className={cn(
                "flex h-14 w-full items-center justify-between gap-3 border-b border-line px-4 text-left text-sm",
                selected ? "bg-subtle font-medium" : "text-fg",
              )}
            >
              <span className="truncate">{item.name}</span>
              <span className="shrink-0 tabular-nums text-faint">{item.short}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-5 p-5 md:p-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm text-faint">{branch.family} · scored at {TIERS[tier].label}</p>
            <h2 className="mt-2 font-display text-4xl text-balance md:text-5xl">{branch.name}</h2>
          </div>
          <div className="min-w-36">
            <p className="font-display text-5xl tabular-nums leading-none">{cgi}</p>
            <p className="mt-2 text-sm">
              <Mark tone={tone}>{gapLabel(cgi)} gap</Mark>
              {blended ? <span className="ml-2 text-faint">Live blend on</span> : null}
            </p>
          </div>
        </header>
        <p className="max-w-3xl text-pretty text-muted">{branch.pressure}</p>
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          <Mini label="Employability" value={branch.employability == null ? "Not published" : `${branch.employability}%`} note={branch.employabilityNote} />
          <Mini label="Placement" value={branch.placement == null ? "Not published" : `${branch.placement}%`} note={branch.placementNote} />
          <Mini label="Candidates per job" value={branch.candidatesPerJob == null ? "Not published" : String(branch.candidatesPerJob)} note={branch.candidatesNote} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-line p-5">
            <h3 className="text-sm font-medium text-faint">What seniors still say</h3>
            <p className="mt-3 font-display text-2xl text-balance">{branch.myth}</p>
          </article>
          <article className="rounded-xl border border-line bg-elevated p-5">
            <h3 className="text-sm font-medium text-faint">What the hiring record says</h3>
            <p className="mt-3 text-pretty text-muted">{branch.market}</p>
          </article>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="bg-elevated p-4">
      <h3 className="text-sm text-faint">{label}</h3>
      <p className="mt-2 font-display text-2xl text-balance">{value}</p>
      <p className="mt-2 text-sm text-pretty text-faint">{note}</p>
    </article>
  );
}

function Syllabus({ branch, tier, live }: { branch: Branch; tier: TierId; live?: Record<string, number> }) {
  const rows = branch.skills
    .map((skill) => ({ skill, explained: explainSkill(skill, tier, live?.[skill.id]) }))
    .sort((a, b) => b.explained.gap - a.explained.gap);
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 md:p-8">
      <header className="max-w-3xl">
        <p className="text-sm text-faint">{branch.short} · {TIERS[tier].label} delivery {Math.round(TIERS[tier].delivery * 100)}%</p>
        <h2 className="mt-2 font-display text-4xl text-balance">On the paper, and on the requisition</h2>
        <p className="mt-3 text-pretty text-muted">{TIERS[tier].blurb}</p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        {branch.legacy.map((item) => (
          <article key={item.name} className="rounded-xl border border-line p-4">
            <h3 className="text-sm font-medium">Still eating the timetable</h3>
            <p className="mt-2 font-display text-xl text-balance">{item.name}</p>
            <p className="mt-2 text-sm text-pretty text-muted">{item.why}</p>
          </article>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        {rows.map(({ skill, explained }) => (
          <article key={skill.id} className="grid gap-3 border-b border-line p-4 last:border-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <h3 className="text-sm font-medium">{skill.name}</h3>
              <p className="mt-1 text-sm text-pretty text-faint">{skill.note}</p>
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex justify-between text-xs text-faint">
                <span>Gap {Math.round(explained.gap * 100)}</span>
                <span>Demand {explained.demand}{explained.blended ? " · blended" : ""}</span>
              </div>
              <Meter value={explained.gap * 100} />
            </div>
            <p className="text-sm text-muted md:text-right">{paperLabel(skill.paper)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Hiring({ branch }: { branch: Branch }) {
  const mine = COMPANIES.filter((company) => company.branches.includes(branch.id));
  const sectors = SECTORS.filter((sector) => sector.branches.includes(branch.id));
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 md:p-8">
      <header className="max-w-3xl">
        <p className="text-sm text-faint">{branch.short}</p>
        <h2 className="mt-2 font-display text-4xl text-balance">Who hires this branch, and on what terms</h2>
        <p className="mt-3 text-pretty text-muted">
          Volume means a campus day still exists. Selective means they visit fewer colleges and read the project. Specialist means the intake is small and the test is the work. Exam means the placement cell is the wrong calendar.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {sectors.map((sector) => (
          <article key={sector.name} className="rounded-xl border border-line p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-medium">{sector.name}</h3>
              <span className="text-sm tabular-nums text-muted">{sector.share}</span>
            </div>
            <p className="mt-2 text-sm text-pretty text-faint">
              Filled from {sector.branches.map((id) => branchById(id).short).join(", ")}.
            </p>
          </article>
        ))}
      </div>
      <div className="grid gap-3">
        {mine.map((company) => (
          <article key={company.name} className="rounded-xl border border-line bg-elevated p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl">{company.name}</h3>
              <Mark>{FRESHER_WORD[company.fresher]}</Mark>
            </div>
            <p className="mt-1 text-sm text-faint">{company.sector}</p>
            <p className="mt-3 text-sm text-pretty text-muted">{company.tests}</p>
            <p className="mt-2 text-sm text-pretty">{company.trend}</p>
          </article>
        ))}
        {mine.length === 0 ? <p className="text-sm text-muted">No company in this list names the branch. Look at the sector cards, then the exam path.</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {CITIES.map((city) => (
          <article key={city.name} className="rounded-xl border border-line p-4">
            <p className="font-display text-3xl tabular-nums">{city.share}</p>
            <h3 className="mt-2 text-sm font-medium">{city.name}</h3>
            <p className="mt-1 text-sm text-pretty text-faint">{city.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Colleges({ tier }: { tier: TierId }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TierId | "all">("all");
  const list = CAMPUSES.filter((campus) => {
    const hay = `${campus.name} ${campus.place} ${campus.system}`.toLowerCase();
    if (filter !== "all" && campus.tier !== filter) return false;
    return hay.includes(query.trim().toLowerCase());
  });
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 md:p-8">
      <header className="max-w-3xl">
        <h2 className="font-display text-4xl text-balance">The PDF is not the college</h2>
        <p className="mt-3 text-pretty text-muted">
          Tier here is a hiring-market signal, not a judgement of intellect. The gap index you are browsing uses {TIERS[tier].label}. Two colleges on one affiliating university can share a syllabus and not share a lab.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        {(Object.keys(TIERS) as TierId[]).map((id) => (
          <article key={id} className={cn("rounded-xl bg-elevated p-4", id === tier ? "ring-2 ring-accent" : "")}>
            <h3 className="text-sm font-medium">{TIERS[id].label}</h3>
            <p className="mt-2 text-sm text-pretty text-muted">{TIERS[id].blurb}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {AFFILIATES.map((item) => (
          <article key={item.name} className="rounded-xl bg-elevated p-4">
            <h3 className="font-medium">{item.name}</h3>
            <p className="mt-2 text-sm text-pretty text-muted">{item.fact}</p>
          </article>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="campus-search">Search colleges</label>
        <input
          id="campus-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a college or city"
          className="h-11 flex-1 rounded-full border border-line bg-elevated px-4 text-sm"
        />
        <div className="flex rounded-full bg-subtle p-1">
          {(["all", "t1", "t2", "t3"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn("h-9 rounded-full px-3 text-sm font-medium", filter === id ? "bg-elevated text-fg shadow-sm" : "text-muted")}
            >
              {id === "all" ? "All" : TIERS[id].short}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        {list.map((campus) => (
          <article key={campus.name} className="grid gap-2 border-b border-line p-4 last:border-0 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <h3 className="font-medium">{campus.name}</h3>
              <p className="mt-1 text-sm text-pretty text-muted">{campus.note}</p>
            </div>
            <p className="text-sm text-faint md:text-right">
              {TIERS[campus.tier].short} · {campus.system}
              <span className="block">{campus.place}</span>
            </p>
          </article>
        ))}
        {list.length === 0 ? <p className="p-4 text-sm text-muted">Nothing matches. Try the city, or clear the tier.</p> : null}
      </div>
    </div>
  );
}

function Method({
  branch,
  tier,
  live,
  cgi,
}: {
  branch: Branch;
  tier: TierId;
  live?: Record<string, number>;
  cgi: number;
}) {
  const focus = [...branch.skills].sort((a, b) => {
    return explainSkill(b, tier, live?.[b.id]).gap - explainSkill(a, tier, live?.[a.id]).gap;
  })[0];
  const explained = explainSkill(focus, tier, live?.[focus.id]);
  const steps = [
    ["Paper", explained.paper.toFixed(2), "Syllabus depth divided by 3."],
    ["Delivery", explained.delivery.toFixed(2), `${TIERS[tier].label} coefficient. A model, not a ranking of your campus.`],
    ["Taught", explained.taught.toFixed(2), "Paper times delivery."],
    ["Missing", explained.missing.toFixed(2), "One minus taught."],
    ["Heat", explained.heat.toFixed(2), "0.65 plus 0.35 times how fast the skill moved."],
    ["Demand", String(explained.demand), explained.blended ? "70% anchor, 30% live word-frequency." : "Anchor only. The feed has not moved this skill."],
  ];
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 md:p-8">
      <header className="max-w-3xl">
        <h2 className="font-display text-4xl text-balance">Change Gap Index</h2>
        <p className="mt-3 text-pretty text-muted">
          One number, every term visible. It does not claim to be a government statistic. It is a way to stop a corridor story from outranking a syllabus.
        </p>
      </header>
      <pre className="max-w-full overflow-x-auto rounded-xl border border-line bg-elevated p-4 font-mono text-xs leading-relaxed text-muted">
{`gap   = (demand / 100) × missing × heat
CGI   = 100 × Σ (gap × demand) / Σ demand
live  = only if the word appears ≥ 2 times
blend = 0.7 × anchor + 0.3 × live
lock  = employability, placement, candidates per job never move`}
      </pre>
      <article className="rounded-xl border border-line p-5">
        <p className="text-sm text-faint">Worked on the widest skill in {branch.short}</p>
        <h3 className="mt-2 font-display text-3xl text-balance">{focus.name}</h3>
        <p className="mt-2 text-sm text-pretty text-muted">{focus.note}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map(([label, value, note]) => (
            <div key={label}>
              <p className="text-sm text-faint">{label}</p>
              <p className="font-display text-3xl tabular-nums">{value}</p>
              <p className="mt-1 text-sm text-pretty text-muted">{note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">
          This skill’s gap is <span className="tabular-nums">{explained.gap.toFixed(2)}</span>. The branch index is <span className="tabular-nums">{cgi}</span>, {gapLabel(cgi).toLowerCase()}.
        </p>
      </article>
      <p className="max-w-3xl text-sm text-pretty text-muted">
        Paper scores are an editorial reading of typical affiliating schemes — VTU 2022 and 2025, AKTU’s NEP papers, the AICTE model — not a crawl of every PDF. Clubs and internships sit outside the number. They are how a student beats it. The tier coefficient is the same for every campus in the band on purpose: this report will not pretend to have inspected your Tuesday lab.
      </p>
    </div>
  );
}

function Live({ pulse, state }: { pulse: PulseResult | null; state: "loading" | "ready" | "down" }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 md:p-8">
      <header className="max-w-3xl">
        <h2 className="font-display text-4xl text-balance">What the open web is saying right now</h2>
        <p className="mt-3 text-pretty text-muted">
          {state === "loading" ? "Reading Remotive and Jobicy." : pulse?.note}
        </p>
      </header>
      {state === "loading" ? <p className="text-sm text-faint">One moment. If the feeds fail, the rest of the report stays as published.</p> : null}
      {pulse ? (
        <>
          <div className="flex flex-wrap gap-2 text-sm text-muted">
            <Mark>{pulse.ok ? `${pulse.sampleSize} postings` : "Feed down"}</Mark>
            <span className="self-center">{new Date(pulse.fetchedAt).toLocaleString()}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {pulse.sources.map((source) => (
              <p key={source.name} className="rounded-lg border border-line px-3 py-3 text-sm">
                <span className="font-medium">{source.name}</span>
                <span className="mt-1 block text-faint">
                  {source.error ? `No answer (${source.error})` : `${source.count} kept`}
                </span>
              </p>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-line">
            {pulse.skills.slice(0, 12).map((skill) => (
              <div key={skill.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{skill.label}</span>
                    <span className="tabular-nums text-faint">{skill.hits}</span>
                  </div>
                  <Meter value={skill.score} />
                </div>
              </div>
            ))}
            {pulse.skills.length === 0 ? <p className="p-4 text-sm text-muted">No skill word cleared the bar of two mentions.</p> : null}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {pulse.titles.map((job) => (
              <article key={`${job.company}-${job.title}`} className="rounded-xl border border-line p-4">
                <h3 className="text-sm font-medium text-pretty">{job.title}</h3>
                <p className="mt-2 text-sm text-faint">{job.company}{job.where ? ` · ${job.where}` : ""}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ThisYear({ branch }: { branch: Branch }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 md:p-8">
      <header className="max-w-3xl">
        <p className="text-sm text-faint">{branch.short}</p>
        <h2 className="mt-2 font-display text-4xl text-balance">Four moves. Not a new personality.</h2>
        <p className="mt-3 text-pretty text-muted">
          The dangerous advice is not lazy. It is last year’s advice, repeated by someone who was hired under last year’s requisition. Keep what still works. Drop what only worked because companies were buying headcount.
        </p>
      </header>
      <ol className="grid gap-3 md:grid-cols-2">
        {branch.semester.map((step, index) => (
          <li key={step} className="rounded-xl border border-line p-5">
            <p className="font-display text-4xl tabular-nums text-faint">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-3 text-pretty">{step}</p>
          </li>
        ))}
      </ol>
      <article className="rounded-xl bg-elevated p-5">
        <h3 className="font-display text-2xl text-balance">The thing to stop doing</h3>
        <p className="mt-3 max-w-3xl font-display text-2xl text-balance text-muted">{branch.myth}</p>
      </article>
    </div>
  );
}

function PortfolioPane({
  portfolio,
  setPortfolio,
  sharedView,
  onClearShared,
  onShare,
  copied,
  branch,
}: {
  portfolio: Portfolio;
  setPortfolio: (portfolio: Portfolio) => void;
  sharedView: Portfolio | null;
  onClearShared: () => void;
  onShare: () => void;
  copied: boolean;
  branch: Branch;
}) {
  const shown = sharedView ?? portfolio;
  const filled = Boolean(shown.name);
  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-5 md:grid-cols-2 md:p-8">
      <div>
        <p className="text-sm text-faint">Last page</p>
        <h2 className="mt-2 font-display text-4xl text-balance">The report is the portfolio. Put your name on it.</h2>
        <p className="mt-3 text-pretty text-muted">
          No account. What you type stays on this phone until you share a link. The link carries the card, not a login. Friends open the same report and land on your page.
        </p>
        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onShare();
          }}
        >
          <Field label="Name" value={portfolio.name} onChange={(name) => setPortfolio({ ...portfolio, name })} />
          <Field label="College" value={portfolio.college} onChange={(college) => setPortfolio({ ...portfolio, college })} />
          <Field label="One line" value={portfolio.line} onChange={(line) => setPortfolio({ ...portfolio, line })} />
          <Field label="One thing you can defend" value={portfolio.proof} onChange={(proof) => setPortfolio({ ...portfolio, proof })} />
          <Field label="Link" value={portfolio.link} onChange={(link) => setPortfolio({ ...portfolio, link })} />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="h-11 rounded-full bg-accent px-5 text-sm font-medium text-accent-fg" disabled={!portfolio.name && !sharedView?.name}>
              {copied ? "Link copied" : "Share this page"}
            </button>
            {sharedView ? (
              <button type="button" className="h-11 rounded-full px-5 text-sm font-medium text-accent" onClick={onClearShared}>
                Back to my draft
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <article className="flex flex-col justify-between rounded-xl border border-line bg-elevated p-5">
        <div>
          <p className="text-sm text-faint">{sharedView ? "Shared page" : "Your page"} · {branch.short}</p>
          <h3 className="mt-4 font-display text-4xl text-balance">{filled ? shown.name : "Your name"}</h3>
          <p className="mt-2 text-sm text-muted">{shown.college || "College, unstated"}</p>
          <p className="mt-5 text-pretty">{shown.line || "A line about the work, not about the dream."}</p>
          <p className="mt-4 text-sm text-pretty text-muted">{shown.proof || "Name one build a stranger can ask you about for ten minutes."}</p>
        </div>
        <div className="mt-8 border-t border-line pt-4 text-sm text-faint">
          {shown.link ? <p className="mb-2 break-all text-fg">{shown.link}</p> : null}
          <p>Unemployment in Engineering, Why? · Record through {DATA_AS_OF}</p>
          <p className="mt-1">Change Gap Index on the anchors, with a capped live blend. Sources are on the country page.</p>
        </div>
      </article>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="grid gap-1 text-sm" htmlFor={id}>
      <span className="text-faint">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-line bg-elevated px-3"
      />
    </label>
  );
}

function Mark({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "danger" | "ok" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full bg-subtle px-3 text-xs font-medium",
        tone === "danger" && "text-danger",
        tone === "ok" && "text-ok",
        tone === "neutral" && "text-muted",
      )}
    >
      {children}
    </span>
  );
}

function Meter({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="h-1 overflow-hidden rounded-full bg-subtle">
      <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
    </div>
  );
}

function SourceList() {
  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-medium">Sources, so you can argue with this</h3>
      {SOURCES.map((source) => (
        <article key={source.title} className="border-t border-line pt-3">
          <h4 className="text-sm font-medium">{source.title}</h4>
          <p className="text-xs text-faint">{source.when}</p>
          <p className="mt-1 text-sm text-pretty text-muted">{source.used}</p>
        </article>
      ))}
    </div>
  );
}
