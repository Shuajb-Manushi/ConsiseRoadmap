import type { TopicMeta } from "../../types";


export const securityMeta: TopicMeta[] = [
  {
    id: "sec-mindset",
    title: "The Secure-Engineering Mindset & Ethics",
    branch: "security",
    stage: 1,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 6,
    summary:
      "Before any offensive technique: the defensive mindset that belongs in every branch (validate input, check boundaries, least privilege, treat external data as hostile), the discipline of threat modeling, and — non-negotiably — the legal and ethical boundaries of security work: authorization, scope, and responsible disclosure.",
    prerequisiteIds: ["testing-fundamentals", "problem-decomposition"],
  },
  {
    id: "sec-linux-hardening",
    title: "Linux Security: Users, Permissions & Services",
    branch: "security",
    stage: 2,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "The security model of the system most servers run: users and groups, the permission model (the read/write/execute bits you met early, now as a security control), privilege escalation via sudo/setuid, processes and services, and basic hardening — because you can't defend or attack systems you don't understand.",
    prerequisiteIds: ["sec-mindset", "systems-processes"],
  },
  {
    id: "sec-web-vulns",
    title: "Web Vulnerabilities: The OWASP Top 10",
    branch: "security",
    stage: 3,
    required: true,
    difficulty: "advanced",
    estimatedHours: 16,
    summary:
      "The most impactful security domain for a web developer: injection (SQL, command), cross-site scripting, broken access control, authentication failures, and the rest of the OWASP Top 10 — learned by both exploiting them in legal labs (PortSwigger) and, crucially, verifying your own applications defend against them.",
    prerequisiteIds: ["sec-mindset", "db-auth", "web-frontend-quality"],
  },
  {
    id: "sec-memory-crypto",
    title: "Memory Corruption, Mitigations & Applied Cryptography",
    branch: "security",
    stage: 4,
    required: true,
    difficulty: "advanced",
    estimatedHours: 16,
    summary:
      "Two deep, adjacent topics for the systems-security-minded. Memory corruption: how buffer overflows and use-after-free become exploits, and why modern mitigations (ASLR, NX, stack canaries) work — demonstrated safely in isolated, deliberately vulnerable local programs. Applied cryptography: using crypto correctly via vetted libraries (hashing, symmetric/asymmetric, TLS) and the cardinal rule — never invent your own.",
    prerequisiteIds: ["systems-memory-vm", "sec-web-vulns", "cs-discrete-probability"],
  },
  {
    id: "sec-network-supplychain",
    title: "Network Analysis, Reverse Engineering & Supply-Chain Security",
    branch: "security",
    stage: 5,
    required: true,
    difficulty: "advanced",
    estimatedHours: 14,
    summary:
      "The broader security toolkit: analyzing network traffic with Wireshark to understand and investigate protocols, an introduction to reverse engineering (reading compiled binaries — your assembly knowledge applied), and dependency/supply-chain security — because most modern code is dependencies, and a compromised package is a compromised system.",
    prerequisiteIds: ["sec-memory-crypto", "systems-networking", "se-ci-docker-deploy"],
  },
];
