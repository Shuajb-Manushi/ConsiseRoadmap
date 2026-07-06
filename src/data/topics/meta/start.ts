import type { TopicMeta } from "../../types";


export const startMeta: TopicMeta[] = [
  {
    id: "code-to-program",
    title: "How Source Code Becomes a Running Program",
    branch: "start",
    stage: 1,
    required: true,
    difficulty: "foundation",
    estimatedHours: 6,
    summary:
      "What actually happens between hitting 'build' in Code::Blocks and a process running: editing text, compiling to machine code, linking, loading into memory, and executing on the CPU. Interpreters (Python, JavaScript) take a different route to the same destination.",
    prerequisiteIds: [],
  },
  {
    id: "terminal-filesystems",
    title: "Terminals, Filesystems, Processes & WSL",
    branch: "start",
    stage: 2,
    required: true,
    difficulty: "foundation",
    estimatedHours: 10,
    summary:
      "The shell is the engineer's control panel: navigating the filesystem, absolute vs. relative paths, environment variables like PATH, processes, redirection, and pipes. You'll work in PowerShell first, then install WSL to get a real Linux environment on your Windows 10 machine — because servers, containers, and security tooling all live on Linux.",
    prerequisiteIds: ["code-to-program"],
  },
  {
    id: "vscode-workflow",
    title: "VS Code as a Professional Workbench",
    branch: "start",
    stage: 3,
    required: true,
    difficulty: "foundation",
    estimatedHours: 4,
    summary:
      "Turning VS Code from a text editor into your primary instrument: workspaces, the integrated terminal, go-to-definition, multi-cursor editing, the debugger UI, extensions worth having (and the many that aren't), and connecting VS Code to WSL.",
    prerequisiteIds: ["terminal-filesystems"],
  },
  {
    id: "git-github",
    title: "Git Fundamentals & GitHub",
    branch: "start",
    stage: 4,
    required: true,
    difficulty: "foundation",
    estimatedHours: 12,
    summary:
      "Version control as a safety net and a time machine: repositories, the staging area, commits, viewing history, branching basics, remotes, and pushing to GitHub. The mental model — Git stores snapshots of your whole project, and branches are just movable labels on them — matters more than memorizing commands.",
    prerequisiteIds: ["terminal-filesystems"],
  },
  {
    id: "debugging-errors",
    title: "Reading Errors & Debugging as a Method",
    branch: "start",
    stage: 5,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "Debugging is not staring harder — it's the scientific method applied to code: observe the failure precisely, form a hypothesis, design the smallest experiment that could falsify it, and repeat. This cluster also covers the underrated skills of actually reading error messages top to bottom and navigating official documentation.",
    prerequisiteIds: ["code-to-program"],
  },
  {
    id: "testing-fundamentals",
    title: "Testing Fundamentals",
    branch: "start",
    stage: 6,
    required: true,
    difficulty: "foundation",
    estimatedHours: 6,
    summary:
      "A test is a program that checks another program and complains precisely when it's wrong. Before any framework: what makes a good test case, boundaries and edge cases, arranging inputs and asserting outputs, and why tests are what let you change code without fear.",
    prerequisiteIds: ["debugging-errors"],
  },
  {
    id: "problem-decomposition",
    title: "Decomposing Problems & Using AI Responsibly",
    branch: "start",
    stage: 7,
    required: true,
    difficulty: "foundation",
    estimatedHours: 6,
    summary:
      "Before writing code: split any problem into requirements (what must be true), data (what must be represented), operations (what must happen to it), and edge cases (where it will break). Plus an honest protocol for AI tools: use them as a reviewer, explainer, and quiz-master — never as the author of code you couldn't have written.",
    prerequisiteIds: ["code-to-program"],
  },
];
