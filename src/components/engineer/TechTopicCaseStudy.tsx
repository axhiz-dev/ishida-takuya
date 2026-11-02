import {
  ArrowRight, ArrowsClockwise, ArrowsLeftRight, CalendarDots,
  ChartBar, Clock, Database, Handshake, Lightbulb, Stack, UsersThree,
} from "@phosphor-icons/react";
import type { TechTopic } from "@/content/engineer";

type Study = NonNullable<TechTopic["caseStudy"]>;

function AggregationProblem() {
  return (
    <div className="case-visual" role="img" aria-label="人事データと過去の履歴をまとめて集計すると、他プロダクトと共有する基盤にも負荷がかかる">
      <div className="case-data-sources">
        <span><UsersThree size={28} weight="duotone" aria-hidden />人事データ</span>
        <span className="case-times" aria-hidden>×</span>
        <span><CalendarDots size={28} weight="duotone" aria-hidden />過去の履歴</span>
      </div>
      <div className="case-load-path"><span>重い時系列集計</span><ArrowRight size={20} aria-hidden /></div>
      <div className="case-shared-db"><Database size={36} weight="duotone" aria-hidden /><span><strong>共通基盤</strong><small>他プロダクトも利用</small></span></div>
    </div>
  );
}

function AggregationSolution() {
  return (
    <div className="case-visual" role="img" aria-label="共通基盤からデータを分割取得してGoで集計。取得件数や並列度を調整する設計">
      <div className="case-processing">
        <span className="case-process-node"><Stack size={36} weight="duotone" aria-hidden /><strong>分割取得</strong></span>
        <ArrowRight className="case-connector" size={20} aria-hidden />
        <span className="case-process-node"><span className="case-go" aria-hidden>Go</span><strong>集計</strong></span>
        <ArrowRight className="case-connector" size={20} aria-hidden />
        <span className="case-process-node"><ChartBar size={36} weight="duotone" aria-hidden /><strong>表示</strong></span>
      </div>
      <div className="case-control"><span>取得件数</span><span>並列度</span><span>基盤性能</span></div>
      <p className="case-visual-caption">負荷と待ち時間を、検証しながら調整</p>
    </div>
  );
}

function CacheProblem() {
  return (
    <div className="case-visual" role="img" aria-label="毎回の集計では待ち時間が発生し、キャッシュを長く保持すると更新反映が遅れるというトレードオフ">
      <div className="case-tradeoff">
        <span><Clock size={36} weight="duotone" aria-hidden /><small>毎回集計</small><strong>待ち時間</strong></span>
        <ArrowsLeftRight className="case-connector" size={24} aria-hidden />
        <span><CalendarDots size={36} weight="duotone" aria-hidden /><small>長く保持</small><strong>更新の遅れ</strong></span>
      </div>
      <p className="case-visual-caption">性能だけでなく、データ鮮度にも配慮</p>
    </div>
  );
}

function CacheSolution() {
  return (
    <div className="case-visual" role="img" aria-label="通常の閲覧はValkeyの集計結果を再利用。更新を確認したい管理者には手動更新を用意">
      <div className="case-cache-lanes">
        <div><span>通常の閲覧</span><ArrowRight size={18} aria-hidden /><strong><Database size={22} weight="duotone" aria-hidden />結果を再利用<small>Valkey</small></strong></div>
        <div><span>管理者の確認</span><ArrowRight size={18} aria-hidden /><strong><ArrowsClockwise size={22} aria-hidden />手動で更新<small>連続操作を抑制</small></strong></div>
      </div>
      <p className="case-visual-caption">使う場面に合わせて、更新方法を分ける</p>
    </div>
  );
}

export function TechTopicCaseStudy({ study }: { study: Study }) {
  const aggregation = study.visual === "aggregation";
  return (
    <div className="topic-case-study">
      <div className="topic-case-columns">
        <section className="topic-case-panel">
          <h4 className="topic-case-label">課題</h4>
          <p className="topic-case-title">{study.problem.title}</p>
          {aggregation ? <AggregationProblem /> : <CacheProblem />}
        </section>
        <section className="topic-case-panel topic-case-solution">
          <h4 className="topic-case-label">解決策 <span>設計・実装中</span></h4>
          <p className="topic-case-title">{study.solution.title}</p>
          {aggregation ? <AggregationSolution /> : <CacheSolution />}
        </section>
      </div>
      <div className="topic-case-contribution">
        {aggregation ? <Handshake size={24} weight="duotone" aria-hidden /> : <Lightbulb size={24} weight="duotone" aria-hidden />}
        <p><strong>自分の担当・判断</strong>{study.contribution}</p>
      </div>
      <details className="topic-case-details">
        <summary>設計の背景・検証状況</summary>
        <dl>
          <dt>課題の背景</dt><dd>{study.problem.description}</dd>
          <dt>設計の詳細</dt><dd>{study.solution.description}</dd>
          <dt>現在の進捗</dt><dd>{study.ongoing}</dd>
        </dl>
      </details>
    </div>
  );
}
