import type { Branch } from "./types";

export const branches: Branch[] = [
  {
    id: "start",
    name: "Start Here & Developer Tools",
    tagline: "How programs run, terminals, Git, debugging, and how to think about problems.",
    color: "#7d7264",
    order: 0,
  },
  {
    id: "c",
    name: "C & Memory",
    tagline: "Pointers, the heap, and hand-built data structures — the foundation everything else stands on.",
    color: "#a84632",
    order: 1,
  },
  {
    id: "cs",
    name: "Applied CS & Mathematics",
    tagline: "Complexity, algorithms, and math introduced beside the code that uses it.",
    color: "#5c6fa8",
    order: 2,
  },
  {
    id: "python",
    name: "Python & Automation",
    tagline: "A second language for automating real work, tested and packaged properly.",
    color: "#3f7d5c",
    order: 3,
  },
  {
    id: "web",
    name: "Web Foundations",
    tagline: "How the web actually works, then HTML, CSS, JavaScript, TypeScript, and React.",
    color: "#b98524",
    order: 4,
  },
  {
    id: "backend",
    name: "Databases & Backend",
    tagline: "Relational data, SQL, PostgreSQL, and building real APIs with FastAPI.",
    color: "#2f6f8f",
    order: 5,
  },
  {
    id: "practice",
    name: "Software Engineering Practice",
    tagline: "Requirements, collaboration, design, testing strategy, CI, and delivery.",
    color: "#7a5f8f",
    order: 6,
  },
  {
    id: "arch",
    name: "Software Architecture",
    tagline: "Turning working code into systems that stay changeable, reliable, and observable.",
    color: "#a04b73",
    order: 7,
  },
  {
    id: "systems",
    name: "Systems & Networking",
    tagline: "Processes, memory, concurrency, and sockets — what the machine really does.",
    color: "#44526a",
    order: 8,
  },
  {
    id: "mobile",
    name: "Mobile Development",
    tagline: "React Native after web foundations — reuse everything you already know.",
    color: "#2e8f7a",
    order: 9,
    optional: true,
  },
  {
    id: "security",
    name: "Security & Ethical Hacking",
    tagline: "Secure thinking throughout, then dedicated offensive/defensive depth — always in authorized labs.",
    color: "#8f2f3f",
    order: 10,
  },
  {
    id: "optional",
    name: "Optional Specializations",
    tagline: "Rust, Go, game dev, compilers, cloud — pick by interest, not obligation.",
    color: "#9a8a4a",
    order: 11,
    optional: true,
  },
];

export const branchById = new Map(branches.map((b) => [b.id, b]));
