import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const securityTopics: TopicDraft[] = [
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
    whyItMatters:
      "Security is a way of thinking that makes all your code better, and it must be built on an ethical foundation. Every technique ahead is dual-use; the line between a security professional and a criminal is authorization. Establishing that foundation first is what makes the rest of this branch legitimate and career-building rather than dangerous.",
    prerequisiteIds: ["testing-fundamentals", "problem-decomposition"],
    concepts: [
      "The defensive habits threaded through this whole roadmap, named and consolidated",
      "Treating all external input as hostile; trust boundaries",
      "Threat modeling: assets, adversaries, attack surfaces, and what could go wrong (STRIDE-style thinking)",
      "Least privilege, defense in depth, and failing safely",
      "The legal reality: unauthorized access is a crime everywhere; authorization and scope are everything",
      "Responsible disclosure: how to report vulnerabilities ethically",
      "Where to practice legally: your own labs, CTFs, and deliberately vulnerable apps",
    ],
    practicalUses: [
      "Designing any system with security considered from the start",
      "Threat-modeling a feature before building it",
      "Practicing security skills without legal or ethical jeopardy",
    ],
    lab: {
      title: "Threat-Model Your Own Stack",
      scenario:
        "Turn your security thinking systematic: perform a real threat-modeling exercise on your full-stack issue tracker — identify assets, adversaries, trust boundaries, and attack surfaces; enumerate what could go wrong at each; and write a personal ethics-and-authorization charter for all your future security practice.",
      outcome:
        "You can threat-model a real system methodically, you've consolidated the defensive habits from across the roadmap, and you have a clear, written ethical framework governing your security work.",
      requirements: [
        "Draw your issue tracker's architecture with trust boundaries marked (where untrusted data crosses into trusted zones)",
        "Enumerate assets (user data, credentials, availability) and plausible adversaries (external attacker, malicious user, compromised dependency)",
        "For each trust boundary, list what could go wrong (injection, broken access control, etc.) using structured thinking (e.g., STRIDE categories)",
        "Map each identified risk to a defense you already built (or should) — connecting your whole roadmap's security notes into one picture",
        "Write a personal charter: I will only test systems I own or am explicitly authorized to test; I will define scope; I will disclose responsibly; I will practice only in legal environments — with the reasoning behind each",
        "Identify three legal practice environments (your own labs, specific CTFs, deliberately vulnerable apps) you'll use going forward",
      ],
      checkpoints: [
        "Trust boundaries are correctly identified (every place external input enters)",
        "Each risk maps to a concrete defense in your system",
        "Your charter is specific and reasoned, not a generic copy",
        "You can name where and how you'll practice legally",
      ],
      hints: [
        "A trust boundary is anywhere data crosses from less-trusted to more-trusted: the API's edge, the database queries, the browser's rendering. Mark them all.",
        "Threat modeling asks 'what could go wrong here?' systematically rather than hoping you thought of everything — structure beats intuition.",
        "The single most important sentence in security: only touch systems you own or are explicitly authorized to test. Internalize it now, before you have offensive skills.",
      ],
      validation: [
        "A classmate reviewing your threat model finds it complete and the defenses appropriate",
        "Your charter would clearly guide a real decision (e.g., 'a friend asks me to test their employer's site' — your charter answers it: not without authorization)",
      ],
      solutionOutline: [
        "Threat modeling makes security proactive and systematic: by identifying assets, boundaries, and adversaries up front, you find weaknesses in design rather than in production — the security analog of requirements-before-code.",
        "The defensive habits (validate, bound, least-privilege, hostile-input) recur at every trust boundary; consolidating them shows security as one coherent discipline, not scattered tricks.",
        "Ethics and authorization are the foundation everything else stands on: the same skills protect or harm depending only on consent and legality, so the framework must come first.",
      ],
      extensions: [
        "Threat-model a system you use daily (email, a bank app) as an outsider — what would you protect and how?",
        "Read a real responsible-disclosure writeup and note how the researcher stayed ethical and legal",
      ],
    },
    resources: {
      primary: [
        { ...R.owasp, note: "The Top 10 as a structured catalog of what goes wrong — your threat-modeling checklist." },
      ],
      alternatives: [
        { ...R.portswigger, note: "Its learning materials frame vulnerabilities with the defensive and ethical context." },
        { ...R.bandit, note: "A legal, ethical place to start building hands-on skills immediately." },
      ],
    },
    masteryChecks: [
      "Threat-model a described system: assets, boundaries, adversaries, and top risks",
      "State the legal and ethical rules of security practice and apply them to a gray-area scenario",
      "Explain 'treat all input as hostile' with examples from three different branches you've studied",
    ],
    securityNote:
      "This topic IS the security foundation: authorization and ethics are not optional preliminaries but the permanent constraint on everything that follows. Every offensive exercise in this branch runs only in explicitly authorized, legal environments — your own labs, sanctioned CTFs, and intentionally vulnerable applications. Never target systems you don't own or have written permission to test.",
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
    whyItMatters:
      "Linux runs the internet's servers, and its permission and privilege model is the first line of defense on every one of them. Understanding it deeply — from the file bits to service accounts to how privilege escalation works — is foundational for both defending systems and understanding how they're compromised.",
    prerequisiteIds: ["sec-mindset", "systems-processes"],
    concepts: [
      "Users, groups, and the root account; the principle of least privilege embodied",
      "File permissions as security: read/write/execute for user/group/other, and what each enables",
      "Privilege escalation mechanisms: sudo, setuid/setgid binaries, and their risks",
      "Processes, service accounts, and running services with minimal privilege",
      "The filesystem's security-relevant locations (/etc, credentials, logs)",
      "Basic hardening: minimizing attack surface, updates, and safe defaults",
      "How misconfigurations become vulnerabilities",
    ],
    practicalUses: [
      "Securing any Linux server you deploy to",
      "Understanding privilege-escalation paths (to defend against them)",
      "Configuring services to run with least privilege",
    ],
    lab: {
      title: "OverTheWire Bandit + Harden a Box",
      scenario:
        "Two complementary halves. Offensive-but-legal: work through OverTheWire Bandit levels, which teach Linux, the shell, and a security mindset by having you legitimately find each level's password. Defensive: take a practice Linux VM (or your WSL install) and harden it — audit permissions, apply least privilege to a service, and document what you changed and why.",
      outcome:
        "You understand the Linux security model from both sides — finding weaknesses (legally, in Bandit) and closing them (hardening) — with the permission and privilege model now concrete.",
      requirements: [
        "Complete a substantial run of OverTheWire Bandit levels; keep notes on what each taught about permissions, privilege, and the shell",
        "On a practice VM/WSL: audit for permission problems (world-writable sensitive files, overly permissive directories) and fix them",
        "Configure a service (e.g., your deployed backend) to run under a dedicated least-privilege user rather than root, and verify it still works",
        "Examine a setuid binary and explain the privilege-escalation risk it represents",
        "Document a before/after hardening report: what was exposed, what you changed, and the principle behind each fix",
        "Explicitly confirm all work is on systems you own or the sanctioned Bandit environment",
      ],
      checkpoints: [
        "Bandit progress demonstrates real facility with permissions and the shell",
        "The audited permission issues are found and fixed correctly",
        "The service runs as a non-root least-privilege user and still functions",
        "You can explain the setuid escalation risk concretely",
      ],
      hints: [
        "Bandit is explicitly legal and designed for learning — this is exactly the sanctioned environment your ethics charter endorses.",
        "Least privilege for services: a compromised service running as root is game over; running as a limited user contains the damage. This is defense in depth.",
        "World-writable files and unnecessary setuid binaries are classic escalation vectors — auditing for them is basic hygiene.",
      ],
      validation: [
        "Your hardening changes survive a re-audit (the issues are actually gone)",
        "The least-privilege service works and can be shown running as the correct user",
        "Your notes correctly explain the security principle behind each Bandit level's solution",
      ],
      solutionOutline: [
        "Linux security centers on identity (users/groups) and the permission bits that gate every file and process action — the read/write/execute model you learned early is the actual enforcement mechanism, not a formality.",
        "Least privilege is the throughline: services, users, and processes should have exactly the access they need and no more, so that a compromise is contained rather than total.",
        "Bandit teaches offense-for-defense legally: finding each password requires understanding a real permission or misconfiguration issue, building the mindset that then informs your hardening.",
      ],
      extensions: [
        "Continue to OverTheWire's later wargames as skills grow",
        "Set up basic logging/auditing on your box and review what it captures",
      ],
    },
    resources: {
      primary: [
        { ...R.bandit, note: "The primary hands-on, legal environment for this topic." },
      ],
      alternatives: [
        { ...R.ostep, note: "For the process and privilege mechanisms underneath." },
        { ...R.missingSemester, note: "The security-and-cryptography and shell lectures reinforce the fundamentals." },
      ],
    },
    masteryChecks: [
      "Explain the Linux permission model and how it enforces least privilege",
      "Identify and fix common permission misconfigurations on a system",
      "Explain how setuid enables privilege escalation and why it's risky",
    ],
    securityNote:
      "All practice here is on systems you own or the explicitly sanctioned OverTheWire environment. The skills are dual-use: the same permission auditing that hardens your server is what an attacker uses to find escalation paths. Authorization is what makes the difference — never apply these to systems you don't control.",
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
    whyItMatters:
      "You build web applications, so web vulnerabilities are the threats most relevant to your work. Understanding them from the attacker's side (in legal labs) makes you dramatically better at defending — you've already built many of these defenses (parameterized queries, output escaping, authorization checks); now you'll confirm they work by trying to break them.",
    prerequisiteIds: ["sec-mindset", "db-auth", "web-frontend-quality"],
    concepts: [
      "Injection: SQL injection and command injection — how untrusted input becomes code",
      "Cross-site scripting (XSS): reflected, stored, and DOM-based; the contexts and defenses",
      "Broken access control: the #1 risk — missing or flawed authorization checks",
      "Authentication and session failures (connecting to your auth lab)",
      "CSRF, SSRF, and security misconfiguration",
      "The defensive patterns for each: parameterization, output encoding, authorization on every action, secure defaults",
      "Testing your own apps: verifying defenses hold by attempting the attacks legally",
    ],
    practicalUses: [
      "Building web apps that resist the most common real attacks",
      "Security-reviewing web code (yours and others')",
      "Understanding vulnerability reports and fixing them correctly",
    ],
    lab: {
      title: "Attack the Labs, Defend Your App",
      scenario:
        "The definitive dual exercise. In PortSwigger's Web Security Academy (free, legal, sandboxed), work through labs for the major vulnerability classes to understand them as an attacker. Then turn on your own issue tracker: attempt each attack against it, confirm your defenses hold (or find they don't and fix them), and produce a security assessment of your own application.",
      outcome:
        "You understand the OWASP Top 10 from both sides, you've verified your own application's defenses by attacking it, and you can security-review web code with real understanding.",
      requirements: [
        "Complete PortSwigger labs covering: SQL injection, XSS (reflected and stored), and access control at minimum — with notes on the mechanism and defense for each",
        "Against your own issue tracker (which you own — fully authorized): attempt SQL injection on inputs and confirm parameterization defeats it; attempt stored XSS in issue text and confirm escaping defeats it; attempt to access/modify another user's issues and confirm authorization defeats it",
        "For any defense that fails, fix it and re-test until the attack is defeated — you may well find a real gap",
        "Test authentication robustness (from your auth lab) against the failures PortSwigger demonstrates",
        "Produce a security assessment report of your own app: what you tested, what held, what you fixed, and residual risks",
        "Confirm every offensive action was against PortSwigger's sanctioned labs or your own application — nothing else",
      ],
      checkpoints: [
        "You can explain each vulnerability class's mechanism and defense from having done both",
        "Your app's parameterized queries, output escaping, and authorization checks are verified by attempted attack",
        "Any gap found is fixed and re-tested to confirm closure",
        "The assessment report is honest about what you tested and what remains",
      ],
      hints: [
        "PortSwigger's labs are the gold standard: free, legal, and each isolates one vulnerability so you learn it cleanly. This is your sanctioned attack environment.",
        "Attacking your own app is the point: you built the defenses (parameterized queries, escaping, authz checks) — now prove they work by trying to bypass them. Confidence should come from testing, not hope.",
        "Broken access control (accessing another user's data by changing an ID) is OWASP #1 and the easiest to get wrong — test it thoroughly on your own app.",
        "If an attack succeeds on your app, that's a success of the exercise, not a failure — you found a real bug before an attacker did. Fix and re-test.",
      ],
      validation: [
        "Each attack class is defeated by your app's defenses (demonstrated, not assumed)",
        "Fixes for any found gaps are verified by re-attacking",
        "The assessment report would be useful to a teammate maintaining the app",
      ],
      solutionOutline: [
        "Each Top 10 class has a clear mechanism (untrusted input crossing a trust boundary into code, or a missing check) and a clear defense (parameterization, output encoding contextually, authorization on every action, secure configuration) — you learn the attack to understand the defense deeply.",
        "Attacking your own application closes the loop from the whole roadmap: the defensive habits you built (since the sqlite CLI, the DOM lab, the auth lab) are validated by adversarial testing rather than taken on faith.",
        "Security testing is testing with a hostile imagination — the abuse cases you've written throughout, now systematized against the most common real-world attacks.",
      ],
      extensions: [
        "Add automated security tests to your app's suite (attempt-injection tests that must fail to inject)",
        "Explore additional PortSwigger labs (SSRF, deserialization) as depth allows",
        "Add a Content Security Policy and re-test XSS",
      ],
    },
    resources: {
      primary: [
        { ...R.portswigger, note: "The definitive free, legal, hands-on labs for every web vulnerability class." },
      ],
      alternatives: [
        { ...R.owasp, note: "The Top 10 for the structured catalog and defensive guidance." },
        { ...R.fastapiTutorial, note: "Revisit its security sections to confirm your defenses match best practice." },
      ],
    },
    masteryChecks: [
      "Explain SQL injection and XSS mechanisms and their correct defenses",
      "Test your own application for broken access control and confirm it's defended",
      "Security-review a web endpoint and identify its trust boundaries and needed defenses",
    ],
    securityNote:
      "Every offensive action here is confined to PortSwigger's sanctioned labs and your own applications — both fully authorized. This is the model for all security practice: attack only what you own or are explicitly permitted to test. The purpose is defensive mastery; the attacker's perspective exists to make you build unbreakable defenses.",
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
    whyItMatters:
      "Memory-corruption exploitation is the foundation of low-level security and reverse engineering, and understanding it (plus its mitigations) makes you a far better systems programmer. Cryptography secures everything, and the most dangerous crypto mistakes come from misuse and homemade schemes — learning correct use protects every system you build.",
    prerequisiteIds: ["systems-memory-vm", "sec-web-vulns", "cs-discrete-probability"],
    concepts: [
      "How a stack buffer overflow overwrites the return address (your assembly/stack-frame knowledge, weaponized in a lab)",
      "Use-after-free and heap corruption as exploit primitives (your heap lab, from the attacker's view)",
      "Mitigations and why they work: ASLR, NX/DEP, stack canaries, and the ongoing arms race",
      "Cryptographic primitives: hashing, symmetric and asymmetric encryption, signatures — what each is for",
      "Using crypto correctly: vetted libraries, correct modes, key management, and never rolling your own",
      "Common crypto misuses: ECB, hardcoded keys, weak randomness, homemade schemes",
      "TLS revisited as applied crypto that secures the transport you've used throughout",
    ],
    practicalUses: [
      "Writing memory-safe C with real understanding of the threat",
      "Using cryptography correctly in applications (never inventing it)",
      "The foundation for reverse engineering and deeper security work",
    ],
    lab: {
      title: "Exploit a Toy, Then Secure Real Data",
      scenario:
        "Two contained exercises. Memory: in a small, deliberately vulnerable program you write and run only on your own machine, demonstrate a classic stack buffer overflow overwriting the return address (with mitigations disabled to see the mechanism), then re-enable mitigations one by one and observe each stopping the exploit. Crypto: correctly implement encryption-at-rest for sensitive data in one of your apps using a vetted library, and audit for the common misuses.",
      outcome:
        "You understand memory-corruption mechanics and why mitigations work — from a safe, self-contained lab — and you can use cryptography correctly via libraries while recognizing dangerous misuse.",
      requirements: [
        "Write a tiny vulnerable C program (a classic unbounded gets/strcpy into a stack buffer) on your own machine; compiling with mitigations off, demonstrate control of the return address to redirect execution to another function in the same program (a self-contained, harmless demonstration)",
        "Re-enable mitigations incrementally (stack canary, NX, ASLR) and document how each defeats or complicates the exploit — connecting to your virtual-memory lab",
        "Write up the defense: how bounds-checking (your string-library discipline) prevents the vulnerability at the source, and why memory-safe languages exist",
        "Crypto: add encryption-at-rest for a sensitive field in one of your applications using a well-established library (correct algorithm, mode, and key management from environment/secret store) — never a homemade scheme",
        "Audit for crypto misuse: demonstrate why ECB mode leaks patterns (the classic penguin image), why hardcoded keys are fatal, and why weak randomness breaks security",
        "Confirm all memory-exploit work is on self-contained programs on your own machine, targeting nothing external",
      ],
      checkpoints: [
        "The overflow demonstration works with mitigations off and you can explain each step via the stack frame",
        "Each re-enabled mitigation's effect is observed and explained",
        "Your app encrypts sensitive data correctly with a vetted library and proper key handling",
        "You can explain three concrete crypto misuses and their consequences",
      ],
      hints: [
        "This is the payoff of your assembly and virtual-memory labs: the return address on the stack (which you diagrammed) is what the overflow overwrites. Keep it entirely self-contained — a function in your own program jumping to another function in your own program.",
        "Mitigations are why real exploitation is hard: canaries detect stack smashing, NX stops executing injected data, ASLR hides addresses. Observing them engage makes the defenses concrete.",
        "The cardinal crypto rule: never invent or implement your own primitives. Use a maintained library, use it correctly (authenticated encryption, proper modes), and manage keys outside the code.",
        "ECB mode encrypting the same plaintext block to the same ciphertext block leaks structure — the famous encrypted-penguin-still-a-penguin image demonstrates it instantly.",
      ],
      validation: [
        "The mitigation progression is documented with observed behavior at each step",
        "The encryption is verifiably correct (round-trips, uses authenticated mode, keys not in code)",
        "Your misuse demonstrations (ECB, hardcoded key) clearly show the failure",
      ],
      solutionOutline: [
        "A stack overflow works by writing past a buffer into the saved return address, redirecting execution — your assembly and stack-frame knowledge is exactly the mechanism; mitigations (canary/NX/ASLR) each attack a precondition of the exploit, which is why layered defenses raise the bar.",
        "The real-world defense is prevention at the source: bounds-checked buffers (your string-library discipline) and memory-safe languages eliminate the bug class, which is why the industry moves toward Rust for new systems code.",
        "Cryptography is secure only when used correctly: vetted libraries provide sound primitives, and the engineer's job is correct composition and key management — homemade crypto and misuse (ECB, hardcoded keys, weak randomness) are where real systems fail, per OWASP's Cryptographic Failures.",
      ],
      extensions: [
        "Explore a beginner pwn.college module for structured, sanctioned binary-exploitation practice",
        "Add digital signatures to verify data integrity in one of your apps",
        "Read a real CVE writeup for a memory-corruption bug and map it to what you demonstrated",
      ],
    },
    resources: {
      primary: [
        { ...R.pwnCollege, note: "University-grade, sanctioned binary-exploitation course with its own legal practice infrastructure." },
      ],
      alternatives: [
        { ...R.owasp, note: "The Cryptographic Failures entry for the crypto-misuse catalog." },
        { ...R.ostep, note: "For the memory-protection mechanisms the mitigations build on." },
      ],
    },
    masteryChecks: [
      "Explain how a stack buffer overflow overwrites the return address and how three mitigations counter it",
      "Use a crypto library to encrypt data correctly and explain why homemade crypto is dangerous",
      "Identify three crypto misuses in code and explain their consequences",
    ],
    securityNote:
      "All memory-exploitation work is strictly confined to self-contained programs on your own machine (or sanctioned platforms like pwn.college) — never targeting external or others' systems. This is offensive knowledge acquired for defensive purposes and legitimate research. The cryptography rule is absolute: never invent your own; use vetted libraries correctly. Both topics carry real legal weight — stay within authorized, isolated environments always.",
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
    whyItMatters:
      "Network analysis is essential for investigating incidents and understanding protocols; reverse engineering opens up malware analysis and vulnerability research; and supply-chain security addresses one of the fastest-growing real-world threats — the dependencies you didn't write but are responsible for. Together they round out a practical security foundation.",
    prerequisiteIds: ["sec-memory-crypto", "systems-networking", "se-ci-docker-deploy"],
    concepts: [
      "Packet analysis with Wireshark: capturing, filtering, and dissecting real traffic (your chat protocol, observed)",
      "Investigating protocols and spotting anomalies in traffic",
      "Reverse engineering basics: static analysis of a binary, reading disassembly (your assembly skills applied)",
      "Understanding compiled programs without source; tools and approaches",
      "Dependency security: known vulnerabilities, auditing, and lockfiles as a security artifact",
      "Supply-chain threats: typosquatting, compromised packages, and build-system attacks",
      "Defenses: pinning, auditing, minimizing dependencies, and verifying integrity",
    ],
    practicalUses: [
      "Investigating suspicious network activity",
      "Analyzing unknown binaries (malware analysis foundations)",
      "Securing your projects' dependencies against supply-chain attacks",
    ],
    lab: {
      title: "Investigate Traffic, Reverse a Binary, Audit Dependencies",
      scenario:
        "A three-part practical. Network: capture and analyze traffic from your own chat server and a normal browsing session in Wireshark, dissecting protocols and identifying what's visible vs. encrypted. Reversing: take a small binary (one you compiled yourself) and analyze it without the source, recovering its behavior from the disassembly. Supply chain: audit a real project's dependencies for known vulnerabilities and harden it.",
      outcome:
        "You can analyze network traffic, do basic static reverse engineering of a binary, and audit and harden a project's dependency supply chain — a practical, broadly applicable security skill set.",
      requirements: [
        "Wireshark: capture your own chat protocol traffic and a browsing session; identify the TCP handshake, your message framing, and the difference between plaintext (HTTP) and encrypted (HTTPS/TLS) — explain exactly what an eavesdropper can and cannot see",
        "Reverse engineering: compile a small C program, then — without looking at the source — use disassembly/static analysis to recover what it does (its logic, any 'secret' comparison), applying your assembly knowledge",
        "Supply chain: run a dependency audit (e.g., npm audit / pip-audit) on one of your real projects; investigate a reported vulnerability, understand it, and remediate; pin/lock dependencies",
        "Research and explain a real supply-chain attack (typosquatting or a compromised package) and how pinning, auditing, and minimizing dependencies defend against it",
        "Confirm all analysis is on your own traffic, your own binaries, and your own projects",
      ],
      checkpoints: [
        "You correctly dissect your chat protocol and the TLS-vs-plaintext distinction in Wireshark",
        "You recover a self-compiled binary's behavior from its disassembly",
        "A real dependency vulnerability is understood and remediated in your project",
        "You can explain a supply-chain attack and its defenses concretely",
      ],
      hints: [
        "Wireshark on your own chat server closes the loop from the networking lab: you designed the protocol, now you see it on the wire, and TLS makes payloads opaque — proving why it matters.",
        "Reverse engineering starts with your assembly literacy: identify functions, follow the control flow, find the comparison that gates behavior. Start with an unoptimized binary.",
        "Your lockfiles are a security artifact: they pin exact versions so a compromised newer release can't silently enter. Auditing tools flag known-vulnerable versions — treat their reports seriously.",
        "Most of your code is dependencies you didn't write — you're responsible for them anyway. Minimizing and auditing them is real security work.",
      ],
      validation: [
        "Your Wireshark analysis correctly identifies protocol elements and the encryption boundary",
        "The reversed binary's recovered behavior matches its actual source (checked afterward)",
        "The dependency remediation is verified (the audit is clean or risks are documented)",
      ],
      solutionOutline: [
        "Network analysis reveals the ground truth of communication: Wireshark shows exactly what travels the wire, making protocol behavior and the value of encryption concrete — and it's the core tool for investigating real incidents.",
        "Reverse engineering applies your assembly and systems knowledge in reverse: recovering behavior from a binary is reading the machine you learned to read, and it underpins malware analysis and vulnerability research.",
        "Supply-chain security addresses the reality that modern software is mostly dependencies: pinning, auditing, minimizing, and verifying integrity defend against a threat class (compromised or malicious packages) that has caused major real-world breaches.",
      ],
      extensions: [
        "Analyze a provided PCAP from a CTF to investigate a simulated incident",
        "Explore a reverse-engineering CTF challenge (legal, sanctioned)",
        "Add automated dependency auditing to your CI pipeline",
      ],
    },
    resources: {
      primary: [
        { ...R.wireshark, note: "The official documentation for capture and analysis." },
      ],
      alternatives: [
        { ...R.pwnCollege, note: "Has reverse-engineering modules in a sanctioned environment." },
        { ...R.godbolt, note: "For understanding the compilation your reverse engineering undoes." },
      ],
    },
    masteryChecks: [
      "Analyze a network capture and explain what's visible, what's encrypted, and any anomalies",
      "Recover a small binary's behavior from its disassembly",
      "Audit a project's dependencies and explain supply-chain defenses",
    ],
    securityNote:
      "All work is on your own traffic, self-compiled binaries, and your own projects — capturing others' traffic or reversing others' software may be illegal and always requires authorization. Supply-chain security is increasingly critical: you are responsible for your dependencies' security even though you didn't write them. Stay within legal, authorized boundaries; the skills are powerful and dual-use.",
  },
];
