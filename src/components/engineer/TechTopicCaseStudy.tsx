import type { TechTopic } from "@/content/engineer";

export function TechTopicCaseStudy({ study }: { study: NonNullable<TechTopic["caseStudy"]> }) {
  return (
    <div className="topic-case-study">
      <div className="topic-case-columns">
        <section className="topic-case-panel">
          <h4 className="topic-case-label">課題</h4>
          <p className="topic-case-title">{study.problem.title}</p>
          <p className="topic-case-description">{study.problem.description}</p>
        </section>
        <section className="topic-case-panel topic-case-solution">
          <h4 className="topic-case-label">解決策</h4>
          <p className="topic-case-title">{study.solution.title}</p>
          <p className="topic-case-description">{study.solution.description}</p>
        </section>
      </div>
      <dl className="topic-case-contribution">
        <dt>自分の担当・判断</dt>
        <dd>{study.contribution}</dd>
      </dl>
      <p className="topic-case-ongoing">{study.ongoing}</p>
    </div>
  );
}
