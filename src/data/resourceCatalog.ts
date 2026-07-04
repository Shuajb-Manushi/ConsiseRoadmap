import type { Resource } from "./types";

/**
 * The curated resource library. Topics reference these entries (optionally
 * overriding `note` with topic-specific guidance) so URLs live in one place.
 */
export const R = {
  missingSemester: {
    title: "MIT: The Missing Semester of Your CS Education",
    url: "https://missing.csail.mit.edu/",
    type: "course",
    note: "Short lectures on the shell, editors, Git, and debugging — the tooling universities skip.",
  },
  proGit: {
    title: "Pro Git (2nd edition)",
    url: "https://git-scm.com/book/en/v2",
    type: "book",
    note: "The definitive free Git book. Chapters 1–3 cover everything a beginner needs.",
  },
  githubSkills: {
    title: "GitHub Skills",
    url: "https://skills.github.com/",
    type: "lab",
    note: "Hands-on interactive courses that run inside real GitHub repositories.",
  },
  beejC: {
    title: "Beej's Guide to C Programming",
    url: "https://beej.us/guide/bgc/",
    type: "book",
    note: "Friendly, complete, and honest about pointers and memory. The best free C book.",
  },
  gnuC: {
    title: "GNU C Language Manual",
    url: "https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html",
    type: "reference",
    note: "A drier but precise description of the whole C language.",
  },
  cppref: {
    title: "cppreference — C",
    url: "https://en.cppreference.com/w/c",
    type: "reference",
    note: "The standard-library reference to keep open while writing C.",
  },
  gdbDocs: {
    title: "GDB Documentation",
    url: "https://sourceware.org/gdb/documentation/",
    type: "documentation",
    note: "Official manual for the GNU debugger — use it as a lookup, not a read-through.",
  },
  ostep: {
    title: "Operating Systems: Three Easy Pieces",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    type: "book",
    note: "The best free OS book. Short chapters on virtualization, concurrency, and persistence.",
  },
  nand2tetris: {
    title: "Nand2Tetris",
    url: "https://www.nand2tetris.org/",
    type: "course",
    note: "Build a computer from logic gates up. The definitive 'how does hardware run code' course.",
  },
  godbolt: {
    title: "Compiler Explorer",
    url: "https://godbolt.org/",
    type: "lab",
    note: "Paste C, see the assembly. Invaluable for understanding what the compiler really emits.",
  },
  visualgo: {
    title: "VisuAlgo",
    url: "https://visualgo.net/en",
    type: "reference",
    note: "Animated visualizations of data structures and algorithms — watch them before coding them.",
  },
  opendsa: {
    title: "OpenDSA",
    url: "https://opendsa-server.cs.vt.edu/",
    type: "course",
    note: "Interactive data-structures textbook with embedded exercises.",
  },
  mitMath: {
    title: "MIT 6.042J: Mathematics for Computer Science",
    url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/",
    type: "course",
    note: "Free lectures and problem sets on proofs, counting, graphs, and probability.",
  },
  pyTutorial: {
    title: "The Official Python Tutorial",
    url: "https://docs.python.org/3/tutorial/",
    type: "documentation",
    note: "Concise and authoritative — ideal for someone who already programs in C.",
  },
  automate: {
    title: "Automate the Boring Stuff with Python",
    url: "https://automatetheboringstuff.com/",
    type: "book",
    note: "Practical Python through automating files, spreadsheets, and the web.",
  },
  pytestDocs: {
    title: "pytest Documentation",
    url: "https://docs.pytest.org/",
    type: "documentation",
    note: "How to write, organize, parametrize, and run Python tests.",
  },
  exercismPy: {
    title: "Exercism — Python Track",
    url: "https://exercism.org/tracks/python",
    type: "lab",
    note: "Small mentored exercises for building Python fluency between projects.",
  },
  mdnCurriculum: {
    title: "MDN Curriculum",
    url: "https://developer.mozilla.org/en-US/curriculum/",
    type: "course",
    note: "Mozilla's structured path through HTML, CSS, JavaScript, and web best practice.",
  },
  mdnJs: {
    title: "MDN JavaScript Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    type: "documentation",
    note: "The reference-quality guide to the JavaScript language itself.",
  },
  tsHandbook: {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    type: "documentation",
    note: "The official, readable walkthrough of TypeScript's type system.",
  },
  reactLearn: {
    title: "React — Learn",
    url: "https://react.dev/learn",
    type: "documentation",
    note: "React's official interactive tutorial. Modern, hook-first, and excellent.",
  },
  rnSetup: {
    title: "React Native — Environment Setup",
    url: "https://reactnative.dev/docs/environment-setup",
    type: "documentation",
    note: "Official guide to getting a working React Native toolchain.",
  },
  expoTutorial: {
    title: "Expo Tutorial",
    url: "https://docs.expo.dev/tutorial/introduction/",
    type: "course",
    note: "Build and run a first Expo app on your own phone, step by step.",
  },
  pgTutorial: {
    title: "PostgreSQL Tutorial (official)",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    type: "documentation",
    note: "PostgreSQL's own tutorial — short, accurate, and the right level of depth.",
  },
  fastapiTutorial: {
    title: "FastAPI Tutorial — User Guide",
    url: "https://fastapi.tiangolo.com/tutorial/",
    type: "documentation",
    note: "One of the best-written framework tutorials anywhere. Work through it in order.",
  },
  dockerStart: {
    title: "Docker — Get Started",
    url: "https://docs.docker.com/get-started/",
    type: "documentation",
    note: "Official introduction to images, containers, volumes, and compose.",
  },
  ghActions: {
    title: "GitHub Actions Documentation",
    url: "https://docs.github.com/en/actions",
    type: "documentation",
    note: "How to run tests and builds automatically on every push.",
  },
  beejNet: {
    title: "Beej's Guide to Network Programming",
    url: "https://beej.us/guide/bgnet/",
    type: "book",
    note: "The classic free introduction to sockets in C. Funny and rigorous.",
  },
  wireshark: {
    title: "Wireshark Documentation",
    url: "https://www.wireshark.org/docs/",
    type: "documentation",
    note: "User guide for capturing and dissecting real network traffic.",
  },
  owasp: {
    title: "OWASP Top 10",
    url: "https://owasp.org/www-project-top-ten/",
    type: "reference",
    note: "The canonical list of web application security risks, with explanations.",
  },
  portswigger: {
    title: "PortSwigger Web Security Academy",
    url: "https://portswigger.net/web-security",
    type: "lab",
    note: "Free, legal, hands-on labs for every major web vulnerability class.",
  },
  bandit: {
    title: "OverTheWire: Bandit",
    url: "https://overthewire.org/wargames/bandit/",
    type: "lab",
    note: "A legal wargame that teaches Linux, the shell, and a security mindset level by level.",
  },
  pwnCollege: {
    title: "pwn.college",
    url: "https://pwn.college/",
    type: "course",
    note: "University-grade binary exploitation and systems security course with authorized practice infrastructure.",
  },
} as const satisfies Record<string, Resource>;

export type CatalogKey = keyof typeof R;

/** Grouping used by the Resource Library page. */
export const resourceSubjects: { subject: string; keys: CatalogKey[] }[] = [
  {
    subject: "Foundations & Tools",
    keys: ["missingSemester", "proGit", "githubSkills"],
  },
  {
    subject: "C & Systems",
    keys: ["beejC", "gnuC", "cppref", "gdbDocs", "ostep", "nand2tetris", "godbolt"],
  },
  {
    subject: "Algorithms & Mathematics",
    keys: ["visualgo", "opendsa", "mitMath"],
  },
  {
    subject: "Python",
    keys: ["pyTutorial", "automate", "pytestDocs", "exercismPy"],
  },
  {
    subject: "Web & Mobile",
    keys: ["mdnCurriculum", "mdnJs", "tsHandbook", "reactLearn", "rnSetup", "expoTutorial"],
  },
  {
    subject: "Backend & Databases",
    keys: ["pgTutorial", "fastapiTutorial", "dockerStart", "ghActions"],
  },
  {
    subject: "Networking & Security",
    keys: ["beejNet", "wireshark", "owasp", "portswigger", "bandit", "pwnCollege"],
  },
];
