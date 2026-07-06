import type { TopicMeta } from "../../types";


export const pythonMeta: TopicMeta[] = [
  {
    id: "py-core",
    title: "Python's Data Model — Coming from C",
    branch: "python",
    stage: 1,
    required: true,
    difficulty: "foundation",
    estimatedHours: 12,
    summary:
      "Python for someone who owns pointers: every value is a heap object, every variable a reference (a pointer you can't misuse), and the interpreter does your malloc/free. Lists, dicts, tuples, sets — recognized as the dynamic array and hash table you built by hand — plus slicing, comprehensions, iterators, and generators. You do not restart from 'what is a variable'.",
    prerequisiteIds: ["c-heap-lifetime", "c-hash-tables"],
  },
  {
    id: "py-functions-errors",
    title: "Functions, Closures, Modules & Exceptions",
    branch: "python",
    stage: 2,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "Python's function machinery: default/keyword/variadic arguments, functions as first-class values (your C function pointers, upgraded), closures, decorators demystified, module and package structure with imports — plus the exception model: try/except/finally, raising well, custom exceptions, and with-statements for guaranteed cleanup.",
    prerequisiteIds: ["py-core"],
  },
  {
    id: "py-files-stdlib",
    title: "Files, Paths, JSON, Regex & the Standard Library",
    branch: "python",
    stage: 3,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "The batteries: pathlib for filesystem work, reading/writing text and binary safely (encodings — your data-representation knowledge cashes in), JSON and CSV as the interchange formats of everything, regular expressions used judiciously, and the discovery habit for a standard library that already solves most problems.",
    prerequisiteIds: ["py-functions-errors"],
  },
  {
    id: "py-classes-types",
    title: "Classes, Composition & Type Hints",
    branch: "python",
    stage: 4,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "Object-oriented Python without the cargo cult: classes when data and behavior genuinely belong together, dataclasses for record types, dunder methods for natural interfaces, composition over inheritance as the default — plus modern type hints and a checker (mypy/pyright) that brings back the compile-time safety net you had in C.",
    prerequisiteIds: ["py-functions-errors"],
  },
  {
    id: "py-testing-cli",
    title: "pytest, Virtual Environments, CLIs & Packaging",
    branch: "python",
    stage: 5,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "The professionalization cluster: virtual environments and pinned dependencies (why every project gets its own), pytest with fixtures and parametrize (your C harness, industrialized), argparse for real command-line interfaces with subcommands, project layout with pyproject.toml, and packaging so your tools install with pip.",
    prerequisiteIds: ["py-classes-types"],
  },
  {
    id: "py-http-apis",
    title: "HTTP Clients & Consuming APIs",
    branch: "python",
    stage: 6,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "Programs talking to the web: HTTP's request/response anatomy (methods, headers, status codes, bodies) exercised from Python, JSON APIs, pagination, timeouts and retries (your decorator returns!), rate-limit courtesy, API keys handled properly, and testing code that talks to servers you don't control.",
    prerequisiteIds: ["py-testing-cli", "web-how-internet-works"],
  },
  {
    id: "py-concurrency",
    title: "Concurrency: Threads, Processes & Async",
    branch: "python",
    stage: 7,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Doing many things at once, honestly: the I/O-bound vs CPU-bound distinction that decides everything, threads and the GIL (why Python threads help with waiting but not computing), process pools for real parallelism, async/await as cooperative concurrency, and the shared-state hazards you'll formalize in the systems branch.",
    prerequisiteIds: ["py-http-apis"],
  },
];
