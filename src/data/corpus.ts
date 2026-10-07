export type TierId = "t1" | "t2" | "t3";
export type FresherMode = "volume" | "selective" | "specialist" | "exam";

export type Skill = {
  id: string;
  name: string;
  /** Editorial anchor 0–100. Hiring weight for a fresher in this branch, 2025–26. */
  demand: number;
  /** 0–1. How fast the skill moved in the last 24 months. */
  recency: number;
  /** Depth on a typical affiliating-university paper. */
  paper: 0 | 1 | 2 | 3;
  note: string;
};

export type Legacy = { name: string; why: string };

export type Branch = {
  id: string;
  name: string;
  short: string;
  family: string;
  employability: number | null;
  employabilityNote: string;
  placement: number | null;
  placementNote: string;
  candidatesPerJob: number | null;
  candidatesNote: string;
  pressure: string;
  myth: string;
  market: string;
  semester: string[];
  legacy: Legacy[];
  skills: Skill[];
};

export type Company = {
  name: string;
  sector: string;
  fresher: FresherMode;
  branches: string[];
  tests: string;
  trend: string;
};

export type Campus = {
  name: string;
  system: string;
  tier: TierId;
  place: string;
  note: string;
};

export type Source = { title: string; when: string; used: string };

export const DATA_AS_OF = "7 October 2026";

export const TIERS: Record<
  TierId,
  { label: string; short: string; delivery: number; blurb: string }
> = {
  t1: {
    label: "Tier 1",
    short: "T1",
    delivery: 0.82,
    blurb:
      "IITs, IISc, IIIT Hyderabad, BITS Pilani, and the old NITs that still run real electives. The PDF is mostly taught. The gap that remains is what no Indian syllabus examines yet: shipped AI systems, release-quality drawings, silicon that actually simulates.",
  },
  t2: {
    label: "Tier 2",
    short: "T2",
    delivery: 0.55,
    blurb:
      "Newer NITs and IIITs, DTU, NSUT, Jadavpur, strong state colleges, and the better deemed universities. Scheme is often current. Labs and internships are uneven, so about half the written skill survives contact with a recruiter.",
  },
  t3: {
    label: "Tier 3",
    short: "T3",
    delivery: 0.3,
    blurb:
      "The majority: private colleges on AKTU, VTU, JNTU, Anna, Mumbai, GTU, MAKAUT, RGPV and the rest. Same university PDF as a stronger campus, a fraction of the practice. This is the default, because it is where most students actually sit.",
  },
};

export const SOURCES: Source[] = [
  {
    title: "India Skills Report 2026",
    when: "ETS, CII, AICTE, AIU, Taggd · released 11 Nov 2025",
    used: "Employability: India 56.35%, BE/BTech 70.15%, CS 80%, IT 78%. Women 54%, men 51.5%. GET on 1 lakh+ candidates, 1,000+ employers. AI/ML and data-science postings cited above 600% growth. 72% of undergraduate curricula judged misaligned, and 64% of employers treating AI skills as premium regardless of college, are from later reporting of the same study.",
  },
  {
    title: "India Skills Report domain cut",
    when: "Reported with ISR figures through Aug 2026",
    used: "Instrumentation 77%, ECE 75%, Mechanical 63% employability. CS and IT match the 2026 report. Other branches were not given a domain percentage in these sources, so this report does not invent one.",
  },
  {
    title: "foundit Engineers’ Day snapshot",
    when: "August 2026 postings · published 15 Sep 2026",
    used: "39.59 lakh active engineering candidates, 6.68 lakh jobs, 5.9 per job. Under 3 years: 9.5 per job. Those candidates are 45% of supply and 28% of openings. Auto 1.2 per job, production/industrial 1.4, ECE/telecom 10.9, electronics & instrumentation 11.5. Jobs: IT/software/GCC 33%, manufacturing 15%, construction 13%, electronics + auto/EV + energy 26%. Bengaluru 19%.",
  },
  {
    title: "Xpheno Active Tech Jobs Outlook",
    when: "October 2026",
    used: "1.23 lakh active tech openings, an 18-month high (+17% year on year). Mid-senior 68,000 (55%). Entry-level 15,000 (+15% year on year, −6% from September). IT services 66,000 (+57% year on year).",
  },
  {
    title: "Naukri JobSpeak",
    when: "September 2026",
    used: "White-collar hiring +1% year on year. AI/ML +20%. Experience 0–3 years +1%. IT services −4%. Auto +11%. Telecom −12%. Education −18%.",
  },
  {
    title: "AICTE placement and intake",
    when: "2024–25, via secondary reports of AICTE (Sep–Oct 2025)",
    used: "Reported placement: CSE 94.46%, Mechanical 66.48% (88,954 of about 1.33 lakh), Civil 41.88% (43,620 of about 1.04 lakh), Electrical 58.58% (38,100 of 65,028), Chemical 59.28%. BTech seat fill rose from 53.73% (2020–21) to 75.07% (2024–25). Denominator is the counted cohort, not every student alive. Treat as secondary.",
  },
  {
    title: "ThePrint on AICTE seats",
    when: "7 Mar 2025",
    used: "2019–20 to 2022–23: about 3.43 million undergraduate engineering enrolments, 1.64 million placements (47.7%). Across diploma, UG and PG the placement share was 41.4%. Many who are unplaced continue to higher study. Vacant seats remain large.",
  },
  {
    title: "Business Standard, TeamLease, TCS",
    when: "22 Jul 2026",
    used: "Campus hiring tilting to AI, cyber, cloud, data. HirePro: differential-skill offers already 30–40% of campus hiring, expected 45–55% in FY27. TCS campus intent about 25,000 for FY27, with Prime/Digital (roughly ₹7–12 lakh at cited colleges) rising from about 40% of offers. TeamLease: AI demand 6–6.5 lakh versus a pool near 4.2 lakh.",
  },
  {
    title: "AISHE via Lok Sabha",
    when: "Unstarred question 3543, answered 10 Aug 2026",
    used: "Engineering enrolment, all levels, 62,17,351 in 2023–24. Graduate worker-population ratio is a different statistic from campus placement. They are not interchangeable.",
  },
  {
    title: "Syllabus reading",
    when: "VTU 2022 and 2025 schemes, AKTU NEP 2025–26, AICTE model",
    used: "Paper-coverage scores are an editorial coding of typical affiliating schemes, not a scrape of every college PDF. VTU’s 2025 scheme adds AI across branches only for new admissions. A student already in year 3 during 2026 is usually still on the older scheme. AKTU’s later-year CSE papers now name AI, cloud, IoT and security. Naming is not a shipped system.",
  },
];

const s = (
  id: string,
  name: string,
  demand: number,
  recency: number,
  paper: 0 | 1 | 2 | 3,
  note: string,
): Skill => ({ id, name, demand, recency, paper, note });

export const BRANCHES: Branch[] = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    short: "CSE",
    family: "Software",
    employability: 80,
    employabilityNote: "India Skills Report 2026. Employability is a test score, not a job offer.",
    placement: 94.46,
    placementNote: "AICTE 2024–25 as reported in secondary coverage. Highest among large branches. Denominator is the counted cohort.",
    candidatesPerJob: null,
    candidatesNote: "foundit did not publish a CSE-only ratio. CSE sits inside the 33% of engineering jobs that are IT, software and GCCs, and inside the 9.5 fresher ratio.",
    pressure:
      "The branch looks safe on a placement brochure and crowded at the door. Mass hiring of anyone who can clear a coding round is shrinking. The seats that grew pay more and ask for something the 2018 syllabus does not examine.",
    myth: "Finish the syllabus, do the senior’s DSA sheet, and the placement cell will do the rest.",
    market:
      "Services firms still visit, but the offer they are proud of is Prime or Digital, not the old 3.5 lakh bulk seat. Product companies and GCCs want a thing you shipped, plus data and AI literacy. AI now drafts the easy code, so the easy fresher job is the one disappearing.",
    semester: [
      "Keep DSA. Stop pretending it is the whole job. Add one tested service: auth, a database with real queries, and a readme a stranger can run.",
      "Put Git, Linux, and a test suite on that service. These are still missing from most papers and visible in almost every posting.",
      "Build one small AI feature you can defend: retrieval over your own notes, an evaluation set, a failure case. Not a chatbot screenshot.",
      "Apply where the work matches the build — GCCs, product teams, the digital track of services — not only the company your senior joined in 2019.",
    ],
    legacy: [
      { name: "A full cycle of engineering chemistry", why: "Eats the year you should have spent in a repository." },
      { name: "Graphics as a first-year gate", why: "Useful for other branches. For CSE it is mostly an attendance subject." },
      { name: "Software engineering as theory", why: "UML diagrams without a pull request. Recruiters do not hire the diagram." },
    ],
    skills: [
      s("dsa", "Data structures & algorithms", 78, 0.35, 3, "Still the mass filter. Necessary. No longer sufficient, because models draft the easy problems."),
      s("python", "Python as a working language", 84, 0.7, 2, "Often one course. Labs in many colleges still orbit C and Java."),
      s("sql", "SQL on messy data", 80, 0.4, 2, "Normalization is taught. Query plans, indexes, and dirty extracts usually are not."),
      s("git", "Git and a shared repository", 70, 0.3, 1, "Named in passing. Rarely the way a lab is submitted."),
      s("web", "A modern web stack", 68, 0.55, 1, "HTML, or an old JSP elective. Not TypeScript, not a maintained interface."),
      s("cloud", "Cloud deployment", 77, 0.75, 2, "AKTU and newer schemes name AWS or OpenStack. Most students have never paid a bill or read a log."),
      s("docker", "Containers", 66, 0.65, 0, "Absent from the core of most affiliating schemes."),
      s("system-design", "Small system design", 74, 0.6, 1, "A chapter inside software engineering. Not a design you can defend on a whiteboard."),
      s("llm", "LLMs, retrieval, evaluation", 90, 0.98, 1, "The fastest-moving demand. New schemes say “generative AI”. Almost nobody is examined on a system that fails honestly."),
      s("testing", "Tests and debugging", 62, 0.45, 1, "A unit in a theory paper. Not a habit."),
      s("cyber", "Application security", 64, 0.55, 2, "A cryptography course is not the same as securing a login."),
      s("data-eng", "Data pipelines", 72, 0.7, 1, "Warehouses, quality, and batch jobs are hiring language. Syllabi still say “big data” and stop."),
    ],
  },
  {
    id: "it",
    name: "Information Technology",
    short: "IT",
    family: "Software",
    employability: 78,
    employabilityNote: "India Skills Report 2026.",
    placement: null,
    placementNote: "Often clubbed with CSE in college brochures. AICTE’s separate IT figure was not in the 2024–25 secondary cut used here.",
    candidatesPerJob: null,
    candidatesNote: "Counted inside IT, software and GCC demand, not as its own foundit ratio.",
    pressure:
      "Recruiters rarely distinguish IT from CSE at the gate. Students do, and then study a thinner version of the same subjects. The market does not reward the thinner version.",
    myth: "IT is CSE with less maths, so it is the easier way into the same companies.",
    market:
      "Same doors as CSE: services’ digital track, GCCs, product companies. The filter moved from “which branch” to “what can you run”. An IT student who ships beats a CSE student who only cleared internals.",
    semester: [
      "Treat the branch label as irrelevant. Match the CSE build: one service, one database, one test suite.",
      "Take networks and OS seriously. They are the part of the IT paper that still shows up in interviews.",
      "Add cloud logs and a small AI feature. That is the premium track, including at services firms.",
      "Do not wait for a separate “IT placement”. Sit the same drives, with proof.",
    ],
    legacy: [
      { name: "Duplicate web electives from 2012", why: "PHP form mailers still appear where a deployment should be." },
      { name: "Office-tool labs", why: "Spreadsheet certificates are not a skill signal in 2026." },
      { name: "Theory of information systems", why: "Case studies with no artifact." },
    ],
    skills: [
      s("dsa", "Data structures & algorithms", 76, 0.35, 3, "Same filter as CSE, sometimes taught with less depth."),
      s("web", "A modern web stack", 74, 0.55, 2, "IT schemes lean here, usually a generation behind the posting."),
      s("sql", "SQL on messy data", 82, 0.4, 2, "Closer to the branch’s promise. Still more theory than extract."),
      s("python", "Python as a working language", 80, 0.7, 2, "Present, rarely the language of every lab."),
      s("cloud", "Cloud deployment", 78, 0.75, 2, "Named in newer schemes. Uneven labs."),
      s("git", "Git and a shared repository", 70, 0.3, 1, "Still not how work is submitted."),
      s("cyber", "Application security", 66, 0.55, 2, "Security papers exist. Appsec practice usually does not."),
      s("llm", "LLMs, retrieval, evaluation", 86, 0.98, 1, "Same national demand, same absence of a graded build."),
      s("linux", "Linux as a daily tool", 60, 0.25, 1, "A lab OS, not a working environment."),
      s("data-eng", "Data pipelines", 70, 0.7, 1, "IT should own this. Most schemes only introduce it."),
    ],
  },
  {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    short: "AI/ML",
    family: "Software",
    employability: null,
    employabilityNote: "No separate ISR employability percentage. AI/ML role postings were reported up more than 600% in the 2026 skills report, which is demand, not a pass rate.",
    placement: null,
    placementNote: "Too new, and too often merged into CSE, for a clean AICTE branch rate in the sources used here.",
    candidatesPerJob: null,
    candidatesNote: "Not separated by foundit. The role is hot. The degree name is not a shortcut past the fresher ratio.",
    pressure:
      "Colleges opened the branch because the word fills seats. Hiring grew because companies need people who can evaluate a model, not because they need another transcript that says AIML.",
    myth: "The branch name is the skill. A Keras lab on MNIST is a career.",
    market:
      "Naukri’s September 2026 read: AI/ML hiring +20% while fresher hiring overall was +1%. The growth is real and mostly not entry-level. What gets a fresher in is proof of data work plus one evaluated model, often hired under CSE.",
    semester: [
      "Stop training on Iris and MNIST. Use a dirty public dataset and write down where it lies.",
      "Ship a retrieval or classification pipeline with a baseline, a metric, and a case it gets wrong.",
      "Learn SQL and Python packaging. Most “AI roles” for freshers are data roles with a model at the end.",
      "Read the failure. Interviews in 2026 ask what the system should not do. Syllabi rarely do.",
    ],
    legacy: [
      { name: "Toy datasets as the whole lab", why: "Clean tables teach none of the job." },
      { name: "Prolog and search as the core of AI", why: "History, not the posting." },
      { name: "A survey paper called a project", why: "No weights, no metric, no owner." },
    ],
    skills: [
      s("python", "Python as a working language", 92, 0.7, 3, "The one skill this branch usually does teach."),
      s("ml", "Classical machine learning", 80, 0.45, 3, "On the paper. Often without a baseline discipline."),
      s("dl", "Deep learning beyond a demo", 74, 0.6, 2, "A CNN lab. Rarely training cost, data leakage, or fine-tuning."),
      s("llm", "LLMs, retrieval, evaluation", 94, 0.98, 1, "The demand that created the branch. Still barely examined."),
      s("sql", "SQL on messy data", 84, 0.4, 1, "Under-taught relative to how AI jobs actually start."),
      s("data-eng", "Data pipelines", 86, 0.75, 1, "The unglamorous majority of the work."),
      s("mlops", "Deployment and monitoring", 70, 0.85, 0, "Almost absent outside a few electives."),
      s("dsa", "Data structures & algorithms", 68, 0.35, 2, "Students skip it because the branch name feels like an exemption. The interview does not agree."),
      s("testing", "Evaluation as a habit", 76, 0.7, 1, "Accuracy on a holdout is taught. Slice metrics and error analysis usually are not."),
    ],
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    short: "ECE",
    family: "Silicon and signals",
    employability: 75,
    employabilityNote: "Domain figure reported with India Skills Report coverage, 2025–26.",
    placement: null,
    placementNote: "Not separated in the AICTE 2024–25 secondary cut used here. Often worse in practice than CSE on the same campus.",
    candidatesPerJob: 10.9,
    candidatesNote: "foundit, August 2026, electronics & communication / telecom. Among the most crowded specialisms.",
    pressure:
      "A 75% employability score and 10.9 candidates per job can both be true. The test says many can work. The market does not have a telecom seat for each of them. Semiconductor and firmware seats exist, and they ask for a board and a waveform, not a unit on amplitude modulation.",
    myth: "If coding placements fail, core ECE companies will hire on the strength of the syllabus.",
    market:
      "Qualcomm, TI, Intel, Micron, Samsung, NXP and the new Indian packaging and assembly plants hire. They hire few, and they hire Verilog, C on a real chip, and computer architecture. IT services hire ECE too, but as software trainees. The crowded telecom posting is the one seniors still describe as the core job.",
    semester: [
      "Pick silicon or software and go deep. Hovering between them is how the year disappears.",
      "If silicon: one RTL block in Verilog that simulates clean, plus C on a cheap modern board. Retire the 8085 as your only proof.",
      "If software: the same shipped service as CSE, and say plainly that you are crossing.",
      "Follow the semiconductor plants and design centers, not only the mass software drive.",
    ],
    legacy: [
      { name: "8085 and 8086 as the microprocessor", why: "A museum kit. The job is ARM, RISC-V, or an FPGA." },
      { name: "Analog communication without a signal you captured", why: "Theory that never met noise." },
      { name: "Simulink screenshots as projects", why: "No constraint, no board, no measurement." },
    ],
    skills: [
      s("verilog", "Verilog / SystemVerilog", 84, 0.7, 2, "A HDL lab in better schemes. Rarely a block someone else can review."),
      s("embedded", "C on a modern microcontroller", 88, 0.6, 2, "8051 kits still stand in for this."),
      s("cpp", "C and C++", 72, 0.4, 2, "Syntax is taught. Memory and peripherals are the interview."),
      s("signals", "Signals that meet hardware", 48, 0.25, 3, "Heavily examined, lighter in fresher hiring than students expect."),
      s("pcb", "PCB design", 58, 0.5, 1, "A workshop week, not a board you would order."),
      s("riscv", "RISC-V or a modern core", 50, 0.8, 0, "Moving quickly in India-linked design work. Absent on most papers."),
      s("linux", "Embedded Linux", 64, 0.5, 1, "Named. Not booted."),
      s("python", "Python for tools and test", 60, 0.65, 1, "Automation around the lab. Rarely taught to ECE."),
      s("dsa", "Data structures, if crossing to software", 70, 0.35, 2, "Enough to suffer in an IT drive, often not enough to clear it."),
    ],
  },
  {
    id: "eee",
    name: "Electrical & Electronics",
    short: "EEE",
    family: "Power and machines",
    employability: null,
    employabilityNote: "No clean ISR domain percentage separate from ECE and instrumentation.",
    placement: 58.58,
    placementNote: "AICTE 2024–25 electrical, as reported: 38,100 of 65,028.",
    candidatesPerJob: null,
    candidatesNote: "Power and renewables sit inside the 26% bloc of electronics, auto/EV and energy jobs. No standalone ratio published.",
    pressure:
      "Core electrical did not die. The syllabus many colleges still finish is the grid of twenty years ago, while hiring leans to drives, renewables, protection, and EV power electronics.",
    myth: "Electrical has no future, so learn web development in the last semester.",
    market:
      "ABB, Siemens, Schneider, NTPC, and manufacturing plants hire people who can talk protection, a drive, and a drawing. EV programmes hire power-electronics graduates who have simulated a converter, not only derived it. A last-semester coding crash helps almost nobody.",
    semester: [
      "Build or simulate one converter and one protection problem with numbers from a datasheet.",
      "Add a renewable lab you can explain: inverter, battery, or a plant single-line.",
      "Learn enough Python to plot measurements. Do not abandon the branch for a framework tutorial.",
      "Sit both core drives and the exam calendar (GATE, PSU) with a choice made by October, not by panic.",
    ],
    legacy: [
      { name: "Machines lab as a ritual", why: "No measurement discipline, no comparison to a datasheet." },
      { name: "Power systems only as numericals", why: "The plant wants a diagram and a fault story." },
      { name: "A token MATLAB assignment", why: "Plots with no question attached." },
    ],
    skills: [
      s("power", "Power systems and protection", 64, 0.35, 3, "Core of the paper. Hiring wants it applied, not only solved."),
      s("drives", "Drives and power electronics", 80, 0.75, 2, "The EV-adjacent skill. Often one subject, thin lab."),
      s("renewables", "Renewables and storage", 76, 0.8, 1, "A unit, sometimes an elective. Not a plant."),
      s("plc", "PLC and industrial control", 70, 0.5, 1, "What factories ask. What colleges postpone."),
      s("controls", "Control systems", 58, 0.3, 3, "Well examined. Rarely tied to a drive or a loop you tuned."),
      s("matlab", "MATLAB used on real numbers", 42, 0.15, 2, "Present, low recency. Still a PSU and core-company habit."),
      s("python", "Python for measurement", 52, 0.6, 1, "Almost absent, increasingly assumed."),
      s("cad-elec", "Electrical CAD and drawings", 60, 0.4, 1, "AutoCAD electrical or an equivalent is a job skill, not a first-year drawing sheet."),
    ],
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    short: "Mech",
    family: "Machines and plants",
    employability: 63,
    employabilityNote: "Domain figure reported with India Skills Report coverage, 2025–26.",
    placement: 66.48,
    placementNote: "AICTE 2024–25: 88,954 placed out of about 1.33 lakh.",
    candidatesPerJob: null,
    candidatesNote: "Manufacturing is 15% of engineering jobs. Auto, the neighbour, is the least crowded specialism at about 1.2. Mechanical itself was not given a separate ratio.",
    pressure:
      "The branch is large, so absolute hires are large, and the rate is only ordinary. Students were told core is dead. Core changed shape: GD&T, a release drawing, EV hardware, and a plant that collects data.",
    myth: "Mechanical is finished. Learn Python and escape, or wait for a PSU.",
    market:
      "Tata Motors, Mahindra, Maruti, TVS, L&T, Bosch, Siemens, and the EV firms hire manufacturing and design. Auto hiring on Naukri was +11% in September 2026. They do not hire the thermodynamics topper who has never released a drawing.",
    semester: [
      "Take one part from sketch to a drawing that states GD&T. Have someone who works in a plant mark it.",
      "Do one FEA with a mesh you can justify, or don’t put FEA on the résumé.",
      "Learn the EV neighbour: battery thermal, a motor mount, or a manufacturing step. Auto is where the ratio is kind.",
      "Add Python only as a tool for test data. Do not burn the year on a web framework.",
    ],
    legacy: [
      { name: "Plate and sheet drawing", why: "Hours on views. Minutes on the tolerances a vendor needs." },
      { name: "Machine tools as the whole of manufacturing", why: "The shop floor also has sensors, fixtures, and a quality plan." },
      { name: "Theory of machines as an end", why: "Kinematics without a mechanism you built or measured." },
    ],
    skills: [
      s("gdnt", "GD&T and release drawings", 82, 0.35, 1, "The skill design offices actually check. A thin slice of the graphics course."),
      s("cad", "CAD to a manufacturable model", 76, 0.4, 2, "A software lab. Not a model someone can machine."),
      s("fea", "FEA with a stated assumption", 68, 0.45, 1, "A demo in the final year."),
      s("ev", "EV hardware and thermal", 78, 0.85, 0, "Barely on older schemes. This is where auto hiring moved."),
      s("plc", "PLC and shop-floor data", 66, 0.55, 1, "Industry 4.0 in a seminar. Not in the lab timetable."),
      s("mfg", "Manufacturing and quality", 60, 0.3, 3, "Heavily taught, in a dialect plants have half-left."),
      s("thermo", "Applied thermal systems", 46, 0.2, 3, "Deep on the paper, narrower in fresher seats."),
      s("python", "Python for test and quality data", 48, 0.55, 0, "Absent, and now a differentiator rather than a defection."),
    ],
  },
  {
    id: "civil",
    name: "Civil Engineering",
    short: "Civil",
    family: "Built world",
    employability: null,
    employabilityNote: "No ISR domain percentage in the sources used here.",
    placement: 41.88,
    placementNote: "AICTE 2024–25: 43,620 of about 1.04 lakh. The weakest large-branch rate in that cut.",
    candidatesPerJob: null,
    candidatesNote: "Construction, engineering and real estate are 13% of engineering jobs (foundit). Supply of civil graduates is larger than that share feels like on campus.",
    pressure:
      "Infrastructure work is not a rumour. Campus placement is still poor because contractors hire people who can model, estimate, and stand on a site. The paper mostly checks theory under exam conditions.",
    myth: "Civil means government or nothing. Private work disappeared.",
    market:
      "L&T, Tata Projects, Afcons, Shapoorji, the large developers, and design firms hire. BIM and a competent ETABS or STAAD model decide more than a distinction in fluid mechanics. Site roles pay less at the start and exist in volume the placement cell never counts.",
    semester: [
      "Finish one structure in software and by hand, and explain the difference.",
      "Learn BIM well enough to produce a coordinated model, not a rendered picture.",
      "Do a quantity and a short method statement for a real element. Cost is the language of the employer.",
      "If the goal is a PSU, start GATE early. If the goal is a contractor, spend the summer on a site, not on a coding playlist.",
    ],
    legacy: [
      { name: "Chain surveying as a major lab", why: "The site uses a total station, GNSS, or a drone." },
      { name: "Manual drawings with no model", why: "Coordination is the job. Ink is not." },
      { name: "Concrete technology as recipe memory", why: "Mix design without a site constraint." },
    ],
    skills: [
      s("bim", "BIM", 84, 0.7, 1, "The clearest syllabus hole in a branch that otherwise looks complete."),
      s("struct-soft", "ETABS, STAAD, or an equivalent", 78, 0.4, 1, "A crash workshop. Not a model you would stamp."),
      s("qty", "Quantities, contracts, cost", 74, 0.3, 2, "Taught as theory. The office wants a sheet that ties out."),
      s("struct", "Structural analysis", 56, 0.2, 3, "The paper’s centre. Necessary, not the hire by itself."),
      s("geotech", "Geotechnical judgement", 44, 0.2, 3, "Deep coursework, specialist hiring."),
      s("gis", "GIS, GNSS, modern survey", 62, 0.65, 1, "A unit beside older surveying labs."),
      s("codes", "Working to the code", 70, 0.25, 2, "Clauses are assigned. Applying them to a member is the work."),
      s("site", "Site method and safety", 68, 0.4, 1, "Under-taught relative to where the jobs are."),
    ],
  },
  {
    id: "chem",
    name: "Chemical Engineering",
    short: "Chemical",
    family: "Process",
    employability: null,
    employabilityNote: "No ISR domain percentage in the sources used here.",
    placement: 59.28,
    placementNote: "AICTE 2024–25, as reported in secondary coverage.",
    candidatesPerJob: null,
    candidatesNote: "Not separated by foundit. Process roles sit inside manufacturing and energy.",
    pressure:
      "A mid placement rate hides a sharp filter. Plants hire few freshers, and they hire the ones who can run a simulation and talk safety. A distinction in mass transfer, alone, does not open the gate.",
    myth: "Chemical leads to a refinery by default, or it leads nowhere.",
    market:
      "Reliance, IOCL, ONGC and the private process firms still hire through exams and campuses. Pharma and specialty chemistry hire the process-minded. Battery materials and new energy are the part the old flow-sheet subjects do not cover.",
    semester: [
      "Learn one simulator properly. A single Aspen flowsheet you can perturb is worth more than four theory subjects on a résumé.",
      "Write a short HAZOP-style note on that flowsheet. Safety is not a soft chapter.",
      "Read one battery or specialty process so the branch is not only oil and gas.",
      "Decide between GATE/PSU and a plant internship before the final year starts.",
    ],
    legacy: [
      { name: "Hand calculations as the only plant", why: "The office simulates, then checks by hand." },
      { name: "Industrial chemistry drift", why: "A different degree. Recruiters notice." },
      { name: "No data from a real run", why: "Even a pilot log changes how you speak." },
    ],
    skills: [
      s("aspen", "Process simulation", 82, 0.4, 1, "The hiring skill. An elective if it appears at all."),
      s("safety", "Process safety", 72, 0.35, 2, "Present as a subject. Rarely practiced on a flowsheet."),
      s("transfer", "Transport and reaction", 48, 0.15, 3, "The academic core. Assumed, not the differentiator."),
      s("battery", "Battery and new-energy processes", 66, 0.85, 0, "Demand moved. The paper, on older schemes, did not."),
      s("plant", "Plant design and economics", 64, 0.25, 2, "A final-year ritual. Useful when the numbers are defended."),
      s("python", "Python for data from the plant", 44, 0.55, 0, "A plus, not a change of career."),
      s("lab", "Lab practice and documentation", 58, 0.2, 3, "Taught. Quality of the log varies with the college, which is what the tier factor is for."),
    ],
  },
  {
    id: "inst",
    name: "Instrumentation Engineering",
    short: "Instrumentation",
    family: "Measurement",
    employability: 77,
    employabilityNote: "Domain figure reported with India Skills Report coverage, 2025–26. High test-readiness.",
    placement: null,
    placementNote: "Not in the AICTE large-branch cut used here.",
    candidatesPerJob: 11.5,
    candidatesNote: "foundit, August 2026. The most crowded specialism in that table.",
    pressure:
      "This is the cleanest proof that employability is not employment. 77% test as employable. 11.5 candidates chase each opening. The work is real and specialist. The seats are few. A high score in sensors will not multiply the seats.",
    myth: "Instrumentation is a quiet branch with a sure core job.",
    market:
      "Oil and gas, pharma plants, process automation, and some semiconductor equipment work. Siemens, ABB, Honeywell, and plant owners hire. They hire a person who has tuned a loop or programmed a PLC, not only derived a transfer function. Many graduates then sit the software drive and lose to CSE on DSA.",
    semester: [
      "Program a PLC or a modern controller and log the signal. Put the trend on the résumé, not the transfer function.",
      "Pair it with one industrial protocol you have actually sniffed or configured.",
      "If you are crossing to software, start a year early. A last-semester switch into this crowd does not work.",
      "Target plants and automation firms first. The software drive is the overflow, not the plan.",
    ],
    legacy: [
      { name: "Measurement theory without a logged signal", why: "The job is the trend, the noise, and the calibration." },
      { name: "Obsolete trainer kits only", why: "Fine as history. Not the plant." },
      { name: "No control loop closed by the student", why: "The interview asks what you tuned." },
    ],
    skills: [
      s("plc", "PLC and SCADA", 86, 0.55, 2, "Closest paper skill to the job. Still thin in many colleges."),
      s("controls", "Control systems you tuned", 70, 0.35, 3, "Heavily examined in theory."),
      s("embedded", "Embedded C", 72, 0.55, 2, "Shared with ECE. Quality depends on the lab."),
      s("sensors", "Industrial sensors and data", 76, 0.65, 2, "The branch identity. Rarely a historian or a data log."),
      s("python", "Python on instrument data", 55, 0.6, 1, "A differentiator for a crowded branch."),
      s("safety", "Functional safety, at awareness", 60, 0.5, 1, "Plants ask. Syllabi mention."),
      s("dsa", "DSA, only if exiting to software", 64, 0.3, 1, "Usually too thin to win a software drive."),
    ],
  },
  {
    id: "auto",
    name: "Automobile Engineering",
    short: "Auto",
    family: "Vehicles",
    employability: null,
    employabilityNote: "No ISR domain percentage.",
    placement: null,
    placementNote: "Not separated in the AICTE cut used here. Cohorts are smaller than mechanical.",
    candidatesPerJob: 1.2,
    candidatesNote: "foundit, August 2026, automobile and automotive engineering. The least crowded specialism they published. One source rounded it to 1.1.",
    pressure:
      "The kindest ratio in the 2026 snapshot, and still easy to waste. The seats are in EV systems, manufacturing, and suppliers. A syllabus that is only IC engines, taught as in 2014, walks past them.",
    myth: "Auto is a niche with no campus life. Or: any mechanical student will be preferred over you.",
    market:
      "Tata Motors, Mahindra, Maruti, Hyundai, TVS, Bajaj, Bosch, and the EV makers. Sector hiring was up 11% year on year in Naukri’s September 2026 read. They want a subsystem: battery, thermal, chassis, or a line. Not a poster of a car.",
    semester: [
      "Document one vehicle subsystem with a calculation and a CAD model.",
      "Add the electric version of that subsystem. Engines still matter. They are no longer the whole question.",
      "Spend time with a supplier problem: tolerance, cost, or a test. That is hiring language.",
      "Do not abandon the branch for a generic coding course unless you are willing to compete at 9.5 to 1.",
    ],
    legacy: [
      { name: "IC engines as the identity of the degree", why: "Still taught as if the mix of vehicles had not moved." },
      { name: "Workshop familiarity without a tolerance", why: "Enthusiasm is not a drawing." },
      { name: "Vehicle projects that do not run and do not measure", why: "A shell with no data." },
    ],
    skills: [
      s("ev", "EV powertrain, battery, thermal", 90, 0.9, 1, "The demand. A unit or an elective on newer schemes."),
      s("cad", "CAD to a manufacturable part", 76, 0.4, 2, "Present. Release quality is the gap."),
      s("gdnt", "GD&T", 70, 0.35, 1, "Supplier hiring checks this directly."),
      s("ice", "IC engines and transmissions", 48, 0.2, 3, "Still the centre of the paper."),
      s("battery", "Battery systems", 78, 0.85, 0, "Often absent as a serious subject."),
      s("mfg", "Automotive manufacturing", 64, 0.4, 2, "Taught more as theory than as a line."),
      s("plc", "Line automation", 55, 0.5, 1, "Useful at suppliers and plants."),
    ],
  },
  {
    id: "prod",
    name: "Production & Industrial Engineering",
    short: "Production",
    family: "Plants",
    employability: null,
    employabilityNote: "No ISR domain percentage.",
    placement: null,
    placementNote: "Not separated in the AICTE cut. Cohorts are small.",
    candidatesPerJob: 1.4,
    candidatesNote: "foundit, August 2026, production and industrial engineering.",
    pressure:
      "A quiet branch with a favourable ratio, ignored because seniors talk about software packages. Factories are hiring people who can see a line. The syllabus still prefers operations-research numerics to a line you have timed.",
    myth: "Production is mechanical without respect. Avoid it.",
    market:
      "Manufacturing is 15% of engineering jobs. Industrial engineers fit quality, planning, and improvement roles inside auto, FMCG plants, and electronics assembly. The proof they want is a before-and-after on a process, not a solved queueing paper.",
    semester: [
      "Time a real process. Even a canteen or a lab can teach the method if you are honest about the limits.",
      "Learn one quality tool deeply enough to use it on that process.",
      "Add a shop-floor data skill: PLC awareness or a simple dashboard from a CSV a plant would recognize.",
      "Recruit into manufacturing and GCC operations roles. Do not treat software as the only respectable exit.",
    ],
    legacy: [
      { name: "Operations research with no process", why: "The mathematics survived. The factory visit did not." },
      { name: "Metrology as instrument identification", why: "The job is a capability study." },
      { name: "Plant layout as a drawing only", why: "No flow, no constraint, no cost." },
    ],
    skills: [
      s("ie", "Work study and line design", 72, 0.35, 3, "The paper already has this. Practice is the hole."),
      s("quality", "Quality systems", 74, 0.4, 2, "Six Sigma is a certificate mill. A real study is rare."),
      s("plc", "Shop-floor automation", 70, 0.6, 1, "Industry moved. The core paper lagged."),
      s("mfg", "Manufacturing processes", 58, 0.25, 3, "Shared with mechanical, taught in full."),
      s("cad", "CAD for tooling and fixtures", 55, 0.3, 2, "Useful when tied to a process."),
      s("python", "Data on the line", 50, 0.6, 0, "Spreadsheets are assumed. A reproducible analysis is not."),
      s("supply", "Planning and inventory", 60, 0.35, 2, "Taught as formulae. The interview is a messy case."),
    ],
  },
  {
    id: "bio",
    name: "Biotechnology",
    short: "Biotech",
    family: "Life science",
    employability: null,
    employabilityNote: "No ISR engineering-domain percentage. Do not borrow the B.Pharma figure.",
    placement: null,
    placementNote: "Not in the large-branch AICTE cut. Campus recruiting is thin outside a few cities.",
    candidatesPerJob: null,
    candidatesNote: "Not in the foundit engineering specialism table.",
    pressure:
      "The 2010s pitch — biotech is the next IT — met a small industry. Jobs exist in bioprocess, quality, and bioinformatics. They do not exist at the scale of the classrooms opened to catch the pitch.",
    myth: "A biotech degree is a research career by default, or it is a wasted seat.",
    market:
      "Biocon, Syngene, Serum Institute, Dr. Reddy’s, Bharat Biotech and hospital-adjacent labs hire for process, quality, and analysis. They hire on technique and documentation. A final-year review paper is not a technique.",
    semester: [
      "Get one wet-lab or bioprocess skill to the point where you can write the protocol from memory and name its failure.",
      "If you are quantitative, learn Python on a biological dataset. Bioinformatics hiring is narrower and less crowded than the wet-lab rumour.",
      "Learn documentation: a batch record, a deviation, GLP awareness. Quality roles are a large part of the real industry.",
      "Ignore the advice to “just do MBA” as a reflex. Only do it if you can say which job it buys.",
    ],
    legacy: [
      { name: "Survey projects", why: "No method, no result, no owner." },
      { name: "Instrument tourism", why: "You watched a PCR. You cannot run one." },
      { name: "No statistics beyond a mean", why: "The smallest honest lab skill." },
    ],
    skills: [
      s("bioprocess", "Bioprocess and fermentation", 68, 0.4, 3, "Core, and close to manufacturing jobs."),
      s("qc", "Quality, GLP, documentation", 70, 0.45, 1, "A large share of junior roles. A small share of the syllabus."),
      s("bioinfo", "Bioinformatics", 66, 0.6, 2, "An elective track. Often a software demo."),
      s("python", "Python on biological data", 72, 0.7, 1, "The bridge into computational roles."),
      s("mol", "Molecular technique you can perform", 64, 0.25, 3, "Labs vary more by college than the PDF admits."),
      s("stats", "Statistics for experiments", 60, 0.35, 1, "Under-taught, always asked."),
      s("ml", "Models on bio data", 48, 0.75, 0, "A specialist plus. Not the junior job."),
    ],
  },
  {
    id: "aero",
    name: "Aerospace Engineering",
    short: "Aerospace",
    family: "Flight and structures",
    employability: null,
    employabilityNote: "No ISR domain percentage. Cohorts are small and concentrated in a few colleges.",
    placement: null,
    placementNote: "Not separately reported in the sources used here.",
    candidatesPerJob: null,
    candidatesNote: "Not in the foundit table. Seats in HAL, ISRO and DRDO are exam- or specialist-shaped, not mass hiring.",
    pressure:
      "A prestigious name on a small industry. The students who do well can show a simulation with stated limits, or they clear a hard exam. The students who were promised a cockpit are in the wrong degree.",
    myth: "Aerospace means aircraft, pilot-adjacent glamour, and a PSU at the end.",
    market:
      "HAL, ISRO, DRDO, NAL, and design offices of the large airframe makers. Plus automotive and energy firms who will hire the CFD or structures student and never make an aircraft. The second path is larger than the first, and seniors rarely mention it.",
    semester: [
      "Own one analysis: a CFD case or a structures model with a mesh and a limit you can say out loud.",
      "Learn enough programming to reproduce the figure. MATLAB alone is getting thin.",
      "Map the non-aerospace employers of the same skill. That is the majority path.",
      "If the dream is ISRO or DRDO, treat the exam as a subject, not as a mood.",
    ],
    legacy: [
      { name: "Aircraft general knowledge", why: "Trivia is not analysis." },
      { name: "A CFD picture with no residual history", why: "The first question in a real interview." },
      { name: "No manufacturing exposure", why: "Airframes are built, not only solved." },
    ],
    skills: [
      s("cfd", "CFD with stated limits", 78, 0.45, 2, "Taught as a software introduction."),
      s("struct-aero", "Aerospace structures", 60, 0.25, 3, "The paper’s centre."),
      s("composites", "Composites", 66, 0.55, 1, "Industry use ran ahead of the core."),
      s("matlab", "MATLAB or Python for the model", 55, 0.3, 2, "MATLAB is traditional. Python is the more portable proof."),
      s("cad", "CAD and a manufacturable intent", 58, 0.35, 2, "Present in better schemes."),
      s("propulsion", "Propulsion", 50, 0.3, 3, "Deep theory, narrow fresher hiring."),
      s("test", "Test and measurement", 62, 0.4, 1, "Wind-tunnel tourism versus a test you designed."),
    ],
  },
  {
    id: "meta",
    name: "Metallurgy & Materials",
    short: "Metallurgy",
    family: "Materials",
    employability: null,
    employabilityNote: "No ISR domain percentage.",
    placement: null,
    placementNote: "Not in the large-branch cut. Cohorts are small; steel and foundry campuses still recruit.",
    candidatesPerJob: null,
    candidatesNote: "Not separated by foundit. Demand is plant-shaped, plus a newer battery-materials tail.",
    pressure:
      "A small branch with a real industry, easy to abandon because it is unfashionable. Steel, foundry, automotive materials, and failure analysis still hire. Battery materials hire too, and almost no older syllabus reaches them.",
    myth: "Metallurgy is a dead plant degree. Or it is only Tata Steel via GATE.",
    market:
      "Tata Steel, JSW, SAIL, Hindalco, automotive suppliers, and national labs. Failure analysis and characterization are everyday work. The battery supply chain is the new neighbour, and it wants materials people who can also read a process.",
    semester: [
      "Characterize one material and write the result as a lab would: method, number, limit.",
      "Add a failure or corrosion story with a cause you can defend.",
      "Read one battery-materials flow so you are not surprised by the only growing neighbour.",
      "Talk to plants. This branch still hires from shop floors and from exams, more than from hackathons.",
    ],
    legacy: [
      { name: "Extractive metallurgy as the whole identity", why: "True of some jobs. Not of failure analysis or batteries." },
      { name: "Microscopy you only watched", why: "The skill is the interpretation." },
      { name: "No process numbers", why: "Yield, energy, defect rate. Plants speak these." },
    ],
    skills: [
      s("char", "Characterization", 74, 0.35, 3, "The branch at its best, when the student touched the instrument."),
      s("physical", "Physical metallurgy", 62, 0.2, 3, "Core theory."),
      s("failure", "Failure and corrosion", 68, 0.4, 2, "Close to industrial work. Often a late elective."),
      s("extract", "Extractive and process", 55, 0.2, 3, "Still the bulk of the older paper."),
      s("battery", "Battery materials", 72, 0.9, 0, "New demand. Absent on most schemes a current final-year sat."),
      s("python", "Data from tests", 42, 0.5, 0, "Rare and useful."),
      s("quality", "Plant quality systems", 58, 0.3, 1, "The language of a steel or foundry fresher role."),
    ],
  },
];

export const COMPANIES: Company[] = [
  {
    name: "TCS",
    sector: "IT services",
    fresher: "volume",
    branches: ["cse", "it", "aiml", "ece", "eee"],
    tests: "Coding plus a narrower digital track. The bulk seat still exists and is no longer the seat they describe first.",
    trend: "FY27 campus intent reported near 25,000. Prime and Digital, cited around ₹7–12 lakh at some colleges, were about 40% of offers and were set to rise. Routine coding is what AI is taking.",
  },
  {
    name: "Infosys",
    sector: "IT services",
    fresher: "volume",
    branches: ["cse", "it", "aiml", "ece", "eee"],
    tests: "Aptitude and coding. Specialist tracks ask for a project, not a certificate.",
    trend: "Same shift as the rest of services: fewer pure-volume seats, more weight on AI, cloud, and data. Do not budget your year on the 2019 hiring story.",
  },
  {
    name: "Wipro",
    sector: "IT services",
    fresher: "volume",
    branches: ["cse", "it", "ece", "eee"],
    tests: "Aptitude, coding, and sometimes a project discussion on the higher band.",
    trend: "Hiring selective inside a volume brand. The letter is not the old uniform package.",
  },
  {
    name: "HCLTech",
    sector: "IT services",
    fresher: "volume",
    branches: ["cse", "it", "ece", "eee"],
    tests: "Coding and fundamentals. ECE is welcome when the role is engineering, not only Java training.",
    trend: "Still a campus presence. The work they staff fastest is not the syllabus word-for-word.",
  },
  {
    name: "LTIMindtree",
    sector: "IT services",
    fresher: "selective",
    branches: ["cse", "it", "aiml", "ece"],
    tests: "Coding, SQL, and a project round more often than the oldest services pattern.",
    trend: "Competes for the same digital fresher as the larger five, with less patience for a syllabus-only résumé.",
  },
  {
    name: "Accenture",
    sector: "IT services",
    fresher: "volume",
    branches: ["cse", "it", "aiml", "ece", "eee"],
    tests: "Cognitive, coding, and communication. Advanced tracks want cloud or data proof.",
    trend: "A large door that now sorts quickly. Communication will not compensate for a blank Git history on the higher band.",
  },
  {
    name: "Cognizant",
    sector: "IT services",
    fresher: "volume",
    branches: ["cse", "it", "ece"],
    tests: "Aptitude and coding. GenC and its higher variants are different exams. Know which one is visiting.",
    trend: "Volume returned in bursts after the slow years. It did not return as an entitlement.",
  },
  {
    name: "Zoho",
    sector: "Product",
    fresher: "selective",
    branches: ["cse", "it", "aiml"],
    tests: "Long fundamentals. They have a record of ignoring brand of college. They do not ignore whether you can build.",
    trend: "One of the few product firms that still hires widely from ordinary campuses, slowly, on skill.",
  },
  {
    name: "Freshworks",
    sector: "Product",
    fresher: "specialist",
    branches: ["cse", "it", "aiml"],
    tests: "DSA, projects, and system thinking at a junior scale.",
    trend: "Small fresher intake. A shipped project matters more than the branch nickname.",
  },
  {
    name: "Microsoft, Google, Amazon, Adobe",
    sector: "Product",
    fresher: "specialist",
    branches: ["cse", "it", "aiml", "ece"],
    tests: "DSA, design, and an internship or a serious project. ECE only when the role is systems or silicon, not by hope.",
    trend: "Not a placement-cell story for most colleges. Off-campus and internships are the real door. The college tag helps and, per employers in the skills report, decides less than it did when the skill is AI.",
  },
  {
    name: "Flipkart, PhonePe, Razorpay, Swiggy",
    sector: "Product",
    fresher: "specialist",
    branches: ["cse", "it", "aiml"],
    tests: "DSA plus a discussion of something you ran in production or close to it.",
    trend: "Selective, clustered in Bengaluru and Hyderabad. They do not visit most tier-3 campuses. The work sample still travels.",
  },
  {
    name: "Qualcomm, Texas Instruments, Intel, Micron, NXP, AMD",
    sector: "Semiconductors",
    fresher: "specialist",
    branches: ["ece", "eee", "cse"],
    tests: "Verilog, C, digital design, computer architecture, sometimes analog. A waveform or a simulation you can walk through.",
    trend: "The honest core door for ECE. Headcount is small next to services. India’s design centers are hiring; the 8085 does not get you in.",
  },
  {
    name: "Samsung device and semiconductor teams",
    sector: "Semiconductors",
    fresher: "specialist",
    branches: ["ece", "eee", "cse"],
    tests: "Role-split: software DSA, or C and OS, or silicon.",
    trend: "Several different companies wearing one logo. Ask which team is visiting before you revise the wrong subject.",
  },
  {
    name: "Tata Electronics, Kaynes, and the new packaging plants",
    sector: "Semiconductors",
    fresher: "selective",
    branches: ["ece", "eee", "mech", "chem", "meta"],
    tests: "Process, yield, electronics, and a willingness to work a plant. Not a coding contest.",
    trend: "The manufacturing half of India’s semiconductor push. It will not absorb every ECE batch. It is new demand the old syllabus does not name.",
  },
  {
    name: "Bosch, Siemens, ABB, Schneider",
    sector: "Industrial",
    fresher: "selective",
    branches: ["mech", "eee", "ece", "inst", "auto", "prod"],
    tests: "Core subject depth, a project with numbers, sometimes coding for the embedded teams.",
    trend: "The steadiest multi-branch hirers in core. They hire the student who can talk a machine, a drive, or a loop.",
  },
  {
    name: "Tata Motors, Mahindra, Maruti, Hyundai, TVS",
    sector: "Automotive",
    fresher: "selective",
    branches: ["mech", "auto", "eee", "prod", "meta"],
    tests: "GD&T, manufacturing, thermodynamics applied to a part, sometimes an EV subsystem.",
    trend: "Auto sector hiring was up about 11% year on year in September 2026. EV and suppliers are where a mechanical student stops being “core and stuck”.",
  },
  {
    name: "Ola Electric, Ather, and EV suppliers",
    sector: "Automotive",
    fresher: "specialist",
    branches: ["auto", "mech", "eee", "ece"],
    tests: "A subsystem: battery, thermal, motor, embedded control. Enthusiasm for vehicles is not a test.",
    trend: "Volatile companies, real skill demand. Do not bet the year on one startup. Do learn the subsystem they all ask about.",
  },
  {
    name: "L&T and Tata Projects",
    sector: "Construction",
    fresher: "selective",
    branches: ["civil", "mech", "eee"],
    tests: "Core subjects, software for the discipline, and whether you will take a site.",
    trend: "Construction is 13% of engineering jobs. These firms are the campus face of that share. Site roles outnumber design roles.",
  },
  {
    name: "Afcons, Shapoorji Pallonji, large developers",
    sector: "Construction",
    fresher: "selective",
    branches: ["civil"],
    tests: "Quantities, concrete, a model, site sense.",
    trend: "They hire beyond the placement week, which is why civil’s campus percentage looks worse than the industry.",
  },
  {
    name: "HAL, BEL, BHEL, ISRO, DRDO, BARC",
    sector: "Public science and defence",
    fresher: "exam",
    branches: ["mech", "ece", "eee", "aero", "cse", "meta", "chem"],
    tests: "GATE, or their own exam, plus an interview on fundamentals. A project helps only after the exam.",
    trend: "A real path, a narrow one. It is a preparation plan, not a hope you attach to the placement cell.",
  },
  {
    name: "ONGC, IOCL, NTPC, POWERGRID",
    sector: "Energy PSU",
    fresher: "exam",
    branches: ["mech", "eee", "chem", "civil", "inst"],
    tests: "GATE. The syllabus of the exam is closer to the degree than a startup is, and the seats are numbered.",
    trend: "Still the plan many core seniors describe as the only plan. It is one plan. Have the other.",
  },
  {
    name: "Reliance, Adani, JSW",
    sector: "Process and industry",
    fresher: "selective",
    branches: ["chem", "mech", "eee", "meta", "civil"],
    tests: "Plant subjects, sometimes an aptitude gate. Projects with numbers.",
    trend: "Energy transition work sits inside these groups as well as in oil and steel. Ask which subsidiary is hiring.",
  },
  {
    name: "Biocon, Syngene, Serum, Dr. Reddy’s",
    sector: "Biopharma",
    fresher: "specialist",
    branches: ["bio", "chem"],
    tests: "Technique, documentation, a real lab story. Not a literature survey.",
    trend: "The actual biotech industry. Smaller than the classrooms built for it. Quality and process outnumber “research scientist” on the fresher requisition.",
  },
  {
    name: "Tata Steel, SAIL, Hindalco",
    sector: "Metals",
    fresher: "exam",
    branches: ["meta", "mech", "eee"],
    tests: "GATE or a company exam, plus characterization and process.",
    trend: "Still the spine of metallurgy hiring. Battery materials are extra, not a replacement.",
  },
];

export const CAMPUSES: Campus[] = [
  { name: "IITs (the 23)", system: "IIT", tier: "t1", place: "National", note: "The tag still opens doors. Employers in the 2026 skills report already say an AI skill can outweigh it. The syllabus is not the advantage. The peers, labs, and internships are." },
  { name: "IISc", system: "Institute", tier: "t1", place: "Bengaluru", note: "Research weight. Not a mass placement machine, and not trying to be." },
  { name: "IIIT Hyderabad", system: "IIIT", tier: "t1", place: "Hyderabad", note: "Computing depth that many larger brands do not match. Small on purpose." },
  { name: "BITS Pilani campuses", system: "Deemed", tier: "t1", place: "Pilani, Goa, Hyderabad", note: "Practice and internships do more than the brand. Still not a substitute for a shipped project." },
  { name: "NIT Trichy, Surathkal, Warangal", system: "NIT", tier: "t1", place: "South", note: "Old NITs. Recruiters know the difference between these and a new NIT with the same prefix." },
  { name: "Other NITs", system: "NIT", tier: "t2", place: "National", note: "A national exam got you in. It does not make the lab identical to Trichy. Judge the campus, not the three letters." },
  { name: "IIIT Delhi, Allahabad, Bangalore", system: "IIIT", tier: "t2", place: "National", note: "Stronger in computing than the name “not an IIT” suggests. Branch depth varies by campus." },
  { name: "Newer IIITs", system: "IIIT", tier: "t2", place: "National", note: "Uneven. Read the last two placement lists, not the inauguration speech." },
  { name: "DTU and NSUT", system: "State", tier: "t2", place: "Delhi", note: "Delhi public options with a real recruiter list. You still own the project." },
  { name: "Jadavpur University", system: "State", tier: "t2", place: "Kolkata", note: "Reputation above its funding. Core and CSE both have a history. Verify the current list." },
  { name: "Anna University, CEG and MIT", system: "State", tier: "t2", place: "Chennai", note: "Not the same thing as an Anna affiliate in another district using the same syllabus PDF." },
  { name: "COEP and VJTI", system: "State", tier: "t2", place: "Maharashtra", note: "Old public colleges. A different market from a new private college affiliated to the same university system." },
  { name: "ICT Mumbai", system: "State", tier: "t2", place: "Mumbai", note: "Chemical and allied. A specialist school, which is the point." },
  { name: "RVCE, BMS, PES, MSRIT", system: "Private", tier: "t2", place: "Bengaluru", note: "Bengaluru private colleges with a real visiting list. Paying the fee is not the skill. The city is an advantage only if you use it." },
  { name: "VIT Vellore", system: "Deemed", tier: "t2", place: "Vellore", note: "Scale is the story. Outcomes span a wide band inside one brand. Your rank, your project, your drive." },
  { name: "Manipal, Thapar, Amrita", system: "Deemed", tier: "t2", place: "Various", note: "Deemed universities with their own schemes, usually faster than a big affiliating university. Delivery still depends on the student." },
  { name: "SRM, and similar large deemed brands", system: "Deemed", tier: "t3", place: "Various", note: "Large batches. A placement percentage on a hoarding is not your probability. Ask for the median of your branch, not the highest offer." },
  { name: "PSG, CIT, SSN", system: "Private", tier: "t2", place: "Tamil Nadu", note: "Regional industry links, especially core and ECE. Stronger than the tier label of “private” suggests." },
  { name: "VTU affiliates", system: "Affiliating", tier: "t3", place: "Karnataka", note: "One scheme for the state. 2025 adds AI across branches for new admissions only. A student already enrolled is often on 2022. The college, not VTU, decides if the lab exists." },
  { name: "AKTU affiliates", system: "Affiliating", tier: "t3", place: "Uttar Pradesh", note: "NEP papers now name AI, cloud, IoT, and security in later CSE years. Hundreds of colleges teach that PDF very differently." },
  { name: "JNTU affiliates", system: "Affiliating", tier: "t3", place: "Andhra and Telangana", note: "Huge system. Hyderabad’s job market is next door and does not visit every affiliate." },
  { name: "Anna University affiliates", system: "Affiliating", tier: "t3", place: "Tamil Nadu", note: "CEG is not the affiliate. Same regulation, different classroom." },
  { name: "Mumbai University engineering colleges", system: "Affiliating", tier: "t3", place: "Mumbai", note: "The city has the jobs. The syllabus revision cycle is slow. Internships in the city matter more than the paper." },
  { name: "SPPU affiliates", system: "Affiliating", tier: "t3", place: "Pune", note: "Pune is an auto and manufacturing hire market. A computer-only plan ignores the city." },
  { name: "GTU affiliates", system: "Affiliating", tier: "t3", place: "Gujarat", note: "Chemical, mechanical, and a growing industrial belt. The scheme is not the plant." },
  { name: "MAKAUT affiliates", system: "Affiliating", tier: "t3", place: "West Bengal", note: "Large private intake. Kolkata hiring is narrower than Bengaluru or Hyderabad. Plan for off-campus." },
  { name: "RGPV and MP affiliating colleges", system: "Affiliating", tier: "t3", place: "Madhya Pradesh", note: "The skills report has ranked MP high on employability. Employability is a test. The local recruiter list is a different page." },
  { name: "State government colleges outside the old brands", system: "State", tier: "t2", place: "National", note: "Often a better bargain than a private college with a cricket team. Check the branch-wise median, then the lab." },
];

export const AFFILIATES = [
  {
    name: "VTU",
    fact: "The 2022 scheme still governs students admitted then. The 2025 scheme adds AI and computational work across branches, including mechanical, civil, and electrical, but only from that admission year.",
  },
  {
    name: "AKTU",
    fact: "The 2025–26 final-year CSE papers name AI, IoT, cloud, and cryptography, plus MOOCs. A named elective is not a deployment, and most of the university’s students are not in a lab that can support one.",
  },
  {
    name: "JNTU, Anna, Mumbai, SPPU, GTU, MAKAUT, RGPV",
    fact: "One PDF, many colleges. The gap this report measures is not only old topics. It is the distance between the PDF and the Tuesday lab.",
  },
];

export const SECTORS = [
  {
    name: "IT, software, GCCs",
    share: "33% of engineering jobs",
    source: "foundit, Aug 2026",
    branches: ["cse", "it", "aiml", "ece", "eee"],
    note: "Still the largest slice, no longer the default destination of every branch. Inside it, entry-level tech openings were 15,000 of 1.23 lakh in October 2026.",
  },
  {
    name: "Manufacturing and industrial",
    share: "15%",
    source: "foundit, Aug 2026",
    branches: ["mech", "prod", "auto", "eee", "chem", "meta", "inst"],
    note: "The second-largest destination. Invisible in most placement-week conversations, which only count companies that sit in an auditorium.",
  },
  {
    name: "Construction and real estate",
    share: "13%",
    source: "foundit, Aug 2026",
    branches: ["civil", "mech", "eee"],
    note: "Larger than the civil placement rate suggests, because a lot of it never becomes a campus offer.",
  },
  {
    name: "Electronics, semiconductors, auto and EV, energy",
    share: "26% together",
    source: "foundit, Aug 2026",
    branches: ["ece", "eee", "auto", "mech", "inst", "chem", "meta"],
    note: "The bloc that did not exist as a campus story a decade ago. It does not have room for every student who was told to “learn coding instead”.",
  },
];

export const CITIES = [
  { name: "Bengaluru", share: "19%", note: "About 1.27 lakh of the foundit engineering openings." },
  { name: "Delhi-NCR", share: "13%", note: "Product, services, and GCCs." },
  { name: "Hyderabad", share: "12%", note: "GCCs and product. The city’s colleges do not automatically feed it." },
  { name: "Pune", share: "10%", note: "Auto, manufacturing, and software together." },
  { name: "Chennai", share: "9%", note: "Auto, electronics, and services." },
  { name: "Mumbai", share: "8%", note: "Finance-adjacent tech, construction, process." },
];

export const FRESHER_WORD: Record<FresherMode, string> = {
  volume: "Volume",
  selective: "Selective",
  specialist: "Specialist",
  exam: "Exam",
};

export function branchById(id: string): Branch {
  return BRANCHES.find((branch) => branch.id === id) ?? BRANCHES[0];
}
