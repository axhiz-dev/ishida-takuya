import type { TechTopic } from "@/content/engineer";

function Flow({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="topic-flow">
      {steps.map((step) => (
        <li key={step.title}>
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </li>
      ))}
    </ol>
  );
}

/** 公開用に処理の要点だけを示す概念図。接続構成の詳細は含めない。 */
export function TechTopicDiagram({ kind }: { kind: NonNullable<TechTopic["diagram"]> }) {
  return (
    <figure className="topic-diagram">
      <figcaption className="topic-diagram-caption">
        <span>{kind === "aggregation" ? "集計方式の見直し" : "閲覧時のキャッシュ判定と処理の分岐"}</span>
        <span className="topic-diagram-status">移行先は設計・実装中</span>
      </figcaption>
      <div className="topic-diagram-columns">
        {kind === "aggregation" ? (
          <>
            <div className="topic-diagram-panel">
              <p className="topic-diagram-label">Before <span>従来の事前集計</span></p>
              <Flow steps={[
                { title: "人事データ", detail: "分析対象のデータ" },
                { title: "BigQueryで事前集計", detail: "閲覧に先立って集計結果を用意" },
                { title: "グラフ表示", detail: "集計済みの結果を表示" },
              ]} />
              <p className="topic-diagram-note">課題：事前集計の運用コスト</p>
            </div>
            <div className="topic-diagram-panel topic-diagram-panel-accent">
              <p className="topic-diagram-label">After <span>移行先の都度集計</span></p>
              <Flow steps={[
                { title: "閲覧リクエスト", detail: "必要なタイミングで処理を開始" },
                { title: "共通基盤から分割取得 → Goで集計", detail: "他プロダクトと共有する基盤の負荷に配慮" },
                { title: "React・Rechartsで表示", detail: "バックエンドから受け取った結果を描画" },
              ]} />
              <p className="topic-diagram-note">検証中：共通基盤への負荷と初回待ち時間</p>
            </div>
          </>
        ) : (
          <>
            <div className="topic-diagram-panel topic-diagram-panel-accent">
              <p className="topic-diagram-label">HIT <span>キャッシュあり</span></p>
              <Flow steps={[
                { title: "Valkeyの集計結果を取得", detail: "保存済みの結果を再利用" },
                { title: "結果を返してグラフ表示", detail: "データの再取得・再集計を省く" },
              ]} />
            </div>
            <div className="topic-diagram-panel">
              <p className="topic-diagram-label">MISS <span>キャッシュなし</span></p>
              <Flow steps={[
                { title: "データを分割取得・集計", detail: "初回は集計完了まで待ち時間が発生" },
                { title: "結果を保存してグラフ表示", detail: "以降の閲覧で結果を再利用" },
              ]} />
            </div>
          </>
        )}
      </div>
      <p className="topic-diagram-footer">
        {kind === "aggregation"
          ? "性能検証をもとに、取得件数・並列度・基盤側の性能改善をチーム間で協議。"
          : "鮮度と負荷を踏まえて保持方針を決定。管理者には手動更新を用意し、連続操作を抑制。"}
      </p>
      <p className="topic-diagram-disclaimer">処理の要点を示す概念図。移行後の性能・コスト改善効果は検証中。</p>
    </figure>
  );
}
