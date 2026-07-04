import type { Route } from "../lib/useHashRoute";
import { totalRequiredHours, topicCount, milestoneCount } from "../data/curriculum";
import "../styles/pages.css";

export function About({ navigate }: { navigate: (r: Route) => void }) {
  const weeks = Math.round(totalRequiredHours / 7);
  return (
    <div className="container page page--prose">
      <button className="detail-back" onClick={() => navigate({ name: "roadmap" })}>← Back to roadmap</button>
      <header className="page-head">
        <h1>About this roadmap</h1>
        <p className="page-lede">
          ConciseRoadmaps is a map, not a course. It shows what matters, why it matters, what to
          build, and where to learn each thing — then gets out of your way. Everything is unlocked,
          always.
        </p>
      </header>

      <section className="prose-section">
        <h2>The learning philosophy</h2>
        <p>
          You learn theory by <strong>using it</strong>, not by memorizing it in isolation. Every
          topic here is anchored by a real, meaningful project — you understand why pointers exist
          because you build a dynamic text buffer, not because someone tells you to print a pointer.
          Concepts are introduced next to the code that needs them: the math sits beside the
          algorithm, the security note sits beside the vulnerability it prevents.
        </p>
        <p>
          The destination is <strong>self-sufficiency</strong>: an engineer who can build ideas
          without depending on tools to think for them. That means doing the hard parts yourself,
          especially early. The path deliberately continues from where you are — C through linked
          lists — into memory, data structures, and systems, then Python and the web, rather than
          restarting from "what is a variable".
        </p>
      </section>

      <section className="prose-section">
        <h2>About the estimated hours</h2>
        <p>
          Each topic shows an estimate in hours. These are <strong>guidance, not deadlines</strong>.
          The whole required path totals roughly {Math.round(totalRequiredHours)} hours across{" "}
          {topicCount} topics and {milestoneCount} milestone projects. At about seven study hours a
          week — sometimes more in summer — that's a multi-year journey, and that is completely
          normal. Some topics will take you half the estimate; some will take triple. Neither means
          anything is wrong.
        </p>
        <p>
          There are no fixed schedules, streaks, or due dates here on purpose. Consistency over a
          long time beats intensity that burns out. Roughly {weeks} focused weeks of required
          material is a useful mental anchor, not a target to race.
        </p>
      </section>

      <section className="prose-section">
        <h2>Using AI without outsourcing your thinking</h2>
        <p>
          AI tools are genuinely useful — as a <strong>reviewer, explainer, and quiz-master</strong>,
          not as the author of code you couldn't write yourself. The rule that keeps you growing:
        </p>
        <ul>
          <li><strong>Attempt fully first.</strong> Struggle is where the learning happens; skipping it skips the point.</li>
          <li><strong>Then ask AI to critique</strong> your finished attempt, find flaws, and suggest edge cases you missed.</li>
          <li><strong>Explain every suggestion back</strong> in your own words before you accept it. If you can't, you don't understand it yet.</li>
          <li><strong>Re-implement from understanding</strong>, never by pasting a transcript. Code you can't re-derive tomorrow taught you nothing.</li>
        </ul>
        <p>
          If the AI's code "worked" but you couldn't have written it, you did not complete the
          exercise — you just watched someone else complete it.
        </p>
      </section>

      <section className="prose-section">
        <h2>Legal and ethical security practice</h2>
        <p>
          The security branch teaches offensive techniques for one reason: to build unbreakable
          defenses. Every offensive exercise is confined to environments that are explicitly legal
          and authorized — your own applications, sanctioned labs like PortSwigger and pwn.college,
          and legal wargames like OverTheWire.
        </p>
        <p>
          The single non-negotiable rule of all security work: <strong>only test systems you own or
          have explicit written authorization to test.</strong> Unauthorized access is a crime
          everywhere, regardless of intent. The difference between a security professional and a
          criminal is authorization — internalize that before you acquire the skills, not after.
        </p>
      </section>

      <section className="prose-section">
        <h2>What this is not</h2>
        <p>
          There is no progress tracking, no accounts, no streaks, no XP, no badges, no dashboards,
          and no cloud sync — by design. It's a static site with no backend, no telemetry, and no
          data collection. Your only footprint is a remembered theme and last-opened topic, stored
          locally in your own browser. The roadmap is the interface; the projects are the point.
        </p>
        <div className="about-cta">
          <button className="btn btn--primary" onClick={() => navigate({ name: "topic", id: "code-to-program" })}>
            Start from the beginning →
          </button>
          <button className="btn" onClick={() => navigate({ name: "resources" })}>
            Browse the resource library
          </button>
        </div>
      </section>
    </div>
  );
}
