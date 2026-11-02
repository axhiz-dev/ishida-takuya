import {
  ArrowDown, ArrowRight, CalendarDots, ChartBar, CheckCircle,
  Database, FileText, Gear, Headset, ListChecks, Stack, TreeStructure,
  User, UsersThree, WarningCircle, Wrench,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { NowInitiative } from "@/content/engineer";

function StoryIcon({ icon: IconComponent, size = 28 }: { icon: Icon; size?: number }) {
  return <IconComponent size={size} weight="regular" aria-hidden />;
}

function Contribution({ children }: { children: React.ReactNode }) {
  return <div className="migration-contribution"><User size={26} aria-hidden /><p><strong>私の担当</strong>{children}</p></div>;
}

function Background({ children }: { children: React.ReactNode }) {
  return <details className="migration-background"><summary>詳しい背景を見る</summary><div>{children}</div></details>;
}

export function ProductMigrationStory({ initiative }: { initiative: NowInitiative }) {
  const viewpoints = [
    { icon: UsersThree, title: "顧客の利用実態", note: "業務に必要な機能・使い方" },
    { icon: Headset, title: "CS・セールスの視点", note: "顧客の要望・案内や提案のしやすさ" },
    { icon: CalendarDots, title: "開発スケジュール", note: "目標時期・実現できる範囲" },
  ];
  const decisions = [
    { icon: ListChecks, title: "必要な機能・使い方を整理", note: "利用実態・要望をもとに、必要な範囲を明確化" },
    { icon: TreeStructure, title: "使いやすい構成を検討", note: "顧客の業務に合わせて、機能の構成を見直す" },
    { icon: Gear, title: "期限に合わせて仕様を調整", note: "関係者と変更点をすり合わせる" },
  ];
  return (
    <div className="migration-story migration-product" data-testid="product-migration-story">
      <p className="migration-intro">既存機能の移行に向け、利用実態・要望・期限を整理し、関係者と仕様をすり合わせる。</p>
      <div className="migration-product-map">
        <section className="migration-inputs">
          <h5 className="migration-column-title">判断の材料</h5>
          <ul className="migration-input-list">
            {viewpoints.map(({ icon, title, note }) => <li key={title}><StoryIcon icon={icon} /><div><strong>{title}</strong><span>{note}</span></div></li>)}
          </ul>
          <div className="migration-merge" aria-hidden><ArrowRight size={26} /></div>
        </section>
        <section className="migration-decisions">
          <h5 className="migration-column-title">移行仕様をすり合わせる</h5>
          <ol className="migration-decision-list">
            {decisions.map(({ icon, title, note }, index) => <li key={title}><span className="migration-step-number">{index + 1}</span><StoryIcon icon={icon} /><div><strong>{title}</strong><span>{note}</span></div>{index < decisions.length - 1 && <ArrowDown className="migration-step-arrow" size={18} aria-hidden />}</li>)}
          </ol>
        </section>
        <section className="migration-agreement">
          <h5 className="migration-column-title">合意した移行方針</h5>
          <div className="migration-agreement-body"><ArrowRight className="migration-agreement-arrow" size={30} aria-hidden /><div className="migration-document"><FileText size={52} weight="regular" aria-hidden /></div><p>提供範囲・仕様・<br className="migration-desktop-break" />進め方に合意</p></div>
        </section>
      </div>
      <Contribution>仕様の再整理と、関係者との合意形成。</Contribution>
      <Background><p>{initiative.situation}</p><p>{initiative.action}</p><p>{initiative.outcome}</p></Background>
    </div>
  );
}

export function TechnicalMigrationStory({ summary }: { summary: string }) {
  return (
    <div className="migration-story migration-technical" data-testid="technical-migration-story">
      <p className="migration-intro">日次蓄積のコスト・保守負担を見直し、都度集計へ移行する設計。</p>
      <ol className="migration-tech-rows">
        <li>
          <div className="migration-row-label"><span className="migration-step-number">1</span><div><h4>既存の課題</h4><p>日次のデータ蓄積による<br />コスト・保守負担</p></div></div>
          <div className="migration-system"><StoryIcon icon={Database} size={32} /><div><strong>BigQueryに過去データを日次蓄積</strong><span>ダッシュボードの集計に利用</span></div><ArrowDown className="migration-system-next" size={18} aria-hidden /></div>
          <ArrowRight className="migration-row-arrow" size={24} aria-hidden />
          <div className="migration-effects"><p><Database size={20} aria-hidden />インフラコスト</p><p><Wrench size={20} aria-hidden />保守負担</p></div>
        </li>
        <li>
          <div className="migration-row-label"><span className="migration-step-number">2</span><div><h4>移行方針</h4><p>必要なデータを<br />集計時に取得</p></div></div>
          <div className="migration-system migration-system-accent"><StoryIcon icon={Database} size={32} /><div><strong>集計時に中央DBから必要データを取得</strong><span>その場で集計し、ダッシュボードに表示</span></div><ArrowDown className="migration-system-next" size={18} aria-hidden /></div>
          <ArrowRight className="migration-row-arrow" size={24} aria-hidden />
          <div className="migration-effects migration-concerns"><strong>新たな課題</strong><p><WarningCircle size={20} aria-hidden />他プロダクトと共有するDBへの負荷</p><p><WarningCircle size={20} aria-hidden />表示までの待ち時間</p></div>
        </li>
        <li>
          <div className="migration-row-label"><span className="migration-step-number">3</span><div><h4>移行先での対策</h4><p>負荷と待ち時間に<br />対応する設計・実装</p></div></div>
          <div className="migration-countermeasures">
            <div><StoryIcon icon={ChartBar} /><p><strong>分割取得で負荷を制御</strong><span>データを分割して取得</span></p></div>
            <div><StoryIcon icon={Stack} /><p><strong>Valkeyで集計結果を再利用</strong><span>同じ集計の繰り返しを避ける</span></p></div>
            <div><StoryIcon icon={FileText} /><p><strong>保持方針・管理者の手動更新を設計</strong><span>データの鮮度と運用方法を検討</span></p></div>
            <span className="migration-ongoing"><CheckCircle size={14} aria-hidden />設計・実装中</span>
          </div>
          <div className="migration-collaboration"><UsersThree size={28} aria-hidden /><div><strong>中央DBチームと<br />性能改善を協議</strong><p>鮮度・問い合わせ対応も<br />考慮しながら検討</p></div></div>
        </li>
      </ol>
      <Contribution>取得・集計・キャッシュの設計と、Go・Reactの実装。</Contribution>
      <Background><p>{summary}</p><p>初回の集計待ち時間も含めて検証中。性能・コストの改善効果は未確定。</p></Background>
    </div>
  );
}
