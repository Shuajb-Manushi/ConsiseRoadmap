import type { BranchId } from "./types";
import { topicMetaById } from "./topics/lite";
import { milestonesLite } from "./milestonesLite";

/**
 * The GUIDED learning path: an ordered set of phases that flows top-to-bottom.
 * Unlike the raw prerequisite graph, this is a single clear direction a
 * beginner can follow. Phases group topics thematically; a couple of topics sit
 * outside their "home" branch's phase where real prerequisites demand it (e.g.
 * Python's HTTP/concurrency topics come after the Web phase, because they build
 * on how the web works).
 *
 * `guided.test.ts` validates that this ordering is a genuine topological sort:
 * no topic is listed before one of its required prerequisites, every required
 * topic appears exactly once, and every milestone sits at/after the phase that
 * unlocks it.
 */

export type SideBranch = {
  id: string;
  title: string;
  note: string;
  topicIds: string[];
  milestoneIds?: string[];
};

export type GuidedPhase = {
  id: string;
  /** Human phase number (1-based). */
  number: number;
  title: string;
  /** One line: why this comes now. */
  whyNow: string;
  /** Branches this phase primarily draws from (for colored badges). */
  branches: BranchId[];
  /** Ordered trunk topics. */
  topicIds: string[];
  /** Milestones unlocked around this phase. */
  milestoneIds?: string[];
  /** Where to go next after this phase. */
  nextDirection: string;
  /** Restrained optional/later side branches that fork off here. */
  sideBranches?: SideBranch[];
};

export const guidedPhases: GuidedPhase[] = [
  {
    id: "orientation",
    number: 1,
    title: "Orientation & Developer Tools",
    whyNow:
      "Before writing more code, get fluent with the machine and the workflow: how programs run, the terminal, Git, debugging, and testing. These tools make every later phase faster.",
    branches: ["start"],
    topicIds: [
      "code-to-program",
      "terminal-filesystems",
      "vscode-workflow",
      "git-github",
      "debugging-errors",
      "testing-fundamentals",
      "problem-decomposition",
    ],
    nextDirection: "Now deepen the C you already know into how memory really works.",
  },
  {
    id: "c-memory",
    number: 2,
    title: "C & Memory Foundations",
    whyNow:
      "You know C to linked lists — now master pointers, the heap, and hand-built data structures. This is the bedrock everything else stands on, from Python objects to systems and security.",
    branches: ["c"],
    topicIds: [
      "c-compilation",
      "c-integers-bits",
      "c-pointers-arrays",
      "c-heap-lifetime",
      "c-structs-callbacks",
      "c-modular-build",
      "c-file-io",
      "c-debug-tools",
      "c-lists-stacks-queues",
      "c-hash-tables",
      "c-trees",
      "c-graphs",
    ],
    milestoneIds: ["m-c-database"],
    nextDirection: "With structures in hand, learn to reason about their cost and correctness.",
  },
  {
    id: "applied-cs",
    number: 3,
    title: "Applied CS, Data Structures & Math",
    whyNow:
      "Now that you've built the structures, learn to choose between them: complexity, recursion, searching/sorting, graph algorithms, state machines, and the mathematics that shows up in real code.",
    branches: ["cs"],
    topicIds: [
      "cs-data-representation",
      "cs-big-o",
      "cs-recursion",
      "cs-search-sort",
      "cs-graphs-paths",
      "cs-state-machines",
      "cs-discrete-probability",
    ],
    milestoneIds: ["m-c-search-engine"],
    nextDirection: "Add a second, faster language for automating real work: Python.",
  },
  {
    id: "python",
    number: 4,
    title: "Python & Automation",
    whyNow:
      "A high-leverage second language, learned through your C lens (a dict is your hash table with a garbage collector). Build tested, packaged tools that automate genuine tasks.",
    branches: ["python"],
    topicIds: [
      "py-core",
      "py-functions-errors",
      "py-files-stdlib",
      "py-classes-types",
      "py-testing-cli",
    ],
    milestoneIds: ["m-python-automation"],
    nextDirection: "Learn how the web works, then build for it — HTML through React.",
  },
  {
    id: "web",
    number: 5,
    title: "Web Foundations",
    whyNow:
      "How the internet works, then semantic HTML, CSS, JavaScript, TypeScript, and React — building on your C and Python foundations so the frontend stack is principled, not magic.",
    branches: ["web"],
    topicIds: [
      "web-how-internet-works",
      "web-html-a11y",
      "web-css",
      "web-javascript",
      "web-dom-async",
      "web-typescript",
      "web-react",
      "web-frontend-quality",
    ],
    milestoneIds: ["m-vanilla-web"],
    nextDirection: "Put data behind your apps: databases and real backend services.",
  },
  {
    id: "backend",
    number: 6,
    title: "Python Services, Databases & Backend",
    whyNow:
      "Now that you understand the web, complete Python's networking side (HTTP clients, concurrency) and build real backends: relational data, SQL, FastAPI, and secure authentication.",
    branches: ["python", "backend"],
    topicIds: [
      "py-http-apis",
      "py-concurrency",
      "db-relational-thinking",
      "db-sql",
      "db-design-performance",
      "db-api-design",
      "db-fastapi",
      "db-auth",
      "db-backend-ops",
    ],
    milestoneIds: ["m-python-task-cli"],
    nextDirection: "Descend to what the machine really does: systems and networking.",
    sideBranches: [
      {
        id: "mobile",
        title: "Mobile Development",
        note: "Optional: reuse your React & TypeScript to build a native app for your backend.",
        topicIds: ["mobile-react-native", "mobile-app-data"],
        milestoneIds: ["m-react-native-companion"],
      },
    ],
  },
  {
    id: "systems",
    number: 7,
    title: "Systems & Networking",
    whyNow:
      "Understand processes, virtual memory, concurrency, and sockets — the ground truth beneath every language and framework, and the foundation for both performance and security.",
    branches: ["systems"],
    topicIds: [
      "systems-architecture-asm",
      "systems-processes",
      "systems-memory-vm",
      "systems-concurrency",
      "systems-networking",
    ],
    milestoneIds: ["m-networked-chat", "m-http-server-c"],
    nextDirection: "Level up how you build: engineering practice, testing strategy, and delivery.",
  },
  {
    id: "practice",
    number: 8,
    title: "Software-Engineering Practice",
    whyNow:
      "Turn code into software: requirements, collaborative Git, clean design, a real testing strategy, CI, containers, and deployment.",
    branches: ["practice"],
    topicIds: [
      "se-requirements",
      "se-git-collaboration",
      "se-clean-code",
      "se-testing-strategy",
      "se-ci-docker-deploy",
    ],
    milestoneIds: ["m-fullstack-issue-tracker"],
    nextDirection:
      "Your issue tracker works and ships. Now learn to keep systems like it changeable, reliable, and observable as they grow.",
  },
  {
    id: "architecture",
    number: 9,
    title: "Software Architecture",
    whyNow:
      "You've built and shipped a real system — now learn to keep it alive: modularity and boundaries, contracts and versioning, choosing a system's shape, surviving failure, seeing inside it, and evolving it with recorded decisions. Every lab works on your own issue tracker.",
    branches: ["arch"],
    topicIds: [
      "arch-modularity",
      "arch-boundaries",
      "arch-data-contracts",
      "arch-system-shapes",
      "arch-reliability",
      "arch-observability",
      "arch-evolution",
    ],
    milestoneIds: ["m-architecture-evolution"],
    nextDirection: "Apply a security mindset in depth — always in authorized, legal labs.",
  },
  {
    id: "security",
    number: 10,
    title: "Security & Ethical Hacking",
    whyNow:
      "With real systems built, learn to defend and (ethically, in authorized labs only) attack them: the secure mindset, Linux hardening, web vulnerabilities, memory corruption, and cryptography.",
    branches: ["security"],
    topicIds: [
      "sec-mindset",
      "sec-linux-hardening",
      "sec-web-vulns",
      "sec-memory-crypto",
      "sec-network-supplychain",
    ],
    milestoneIds: ["m-security-capstone"],
    nextDirection:
      "From here, specialize by genuine interest — no engineer needs every branch below.",
    sideBranches: [
      {
        id: "optional",
        title: "Optional Specializations",
        note: "Later & by interest: pick where your foundations transfer — you don't need them all.",
        topicIds: [
          "opt-rust",
          "opt-go",
          "opt-enterprise",
          "opt-cpp",
          "opt-gamedev",
          "opt-frontiers",
        ],
      },
    ],
  },
];

/** A flat, ordered view of the guided path for validation and derived data. */
export type FlatEntry = {
  topicId: string;
  phaseId: string;
  phaseIndex: number;
  /** true when the topic is on an optional side branch. */
  side: boolean;
};

export function flattenGuided(): FlatEntry[] {
  const out: FlatEntry[] = [];
  guidedPhases.forEach((phase, phaseIndex) => {
    for (const topicId of phase.topicIds) {
      out.push({ topicId, phaseId: phase.id, phaseIndex, side: false });
    }
    for (const sb of phase.sideBranches ?? []) {
      for (const topicId of sb.topicIds) {
        out.push({ topicId, phaseId: phase.id, phaseIndex, side: true });
      }
    }
  });
  return out;
}

/** All milestone placements: milestone id -> phase index it appears in. */
export function guidedMilestonePlacements(): { milestoneId: string; phaseIndex: number }[] {
  const out: { milestoneId: string; phaseIndex: number }[] = [];
  guidedPhases.forEach((phase, phaseIndex) => {
    for (const m of phase.milestoneIds ?? []) out.push({ milestoneId: m, phaseIndex });
    for (const sb of phase.sideBranches ?? []) {
      for (const m of sb.milestoneIds ?? []) out.push({ milestoneId: m, phaseIndex });
    }
  });
  return out;
}

/** Sum of estimated hours for a list of topic ids (skips unknown ids). */
export function sumHours(topicIds: string[]): number {
  return topicIds.reduce((sum, id) => sum + (topicMetaById.get(id)?.estimatedHours ?? 0), 0);
}

export const knownMilestoneIds = new Set(milestonesLite.map((m) => m.id));
