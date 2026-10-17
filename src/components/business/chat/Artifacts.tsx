import {
  ChatCircle,
  CheckCircle,
  FileXls,
  WarningCircle,
} from "@phosphor-icons/react";
import s from "./chat.module.css";
import { weeklyShiftSample, type ShiftSample } from "./content";

export function AggregateArtifact({
  resolved,
}: {
  resolved?: boolean;
}) {
  return (
    <section className={s.artifact} aria-label="集計のサンプル">
      <span className={s.badge}>サンプル体験</span>
      {!resolved ? (
        <>
          <p className={s.artifactLead}>
            同じ取引先でも、名前の書き方が違います。
          </p>
          <div className={s.sheets}>
            {[
              ["売上データ", "田中工業", "230,000"],
              ["入金明細", "㈱田中工業", "200,000"],
            ].map(([title, name, amount]) => (
              <div className={s.sheet} key={title}>
                <h3>
                  <FileXls size={25} weight="duotone" />
                  {title}
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>取引先名</th>
                      <th>金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{title === "売上データ" ? "山田商事" : "山田商事 株式会社"}</td>
                      <td>120,000</td>
                    </tr>
                    <tr className={s.highlight}>
                      <td>{name}</td>
                      <td>{amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className={s.artifactLead}>
            確認した取引先を照合すると、金額の違いが見つかりました。
          </p>
          <table>
            <thead>
              <tr>
                <th>取引先</th>
                <th>売上</th>
                <th>入金</th>
                <th>確認</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>山田商事</td>
                <td>120,000</td>
                <td>120,000</td>
                <td>
                  <CheckCircle aria-label="一致" size={18} />
                </td>
              </tr>
              <tr className={s.highlight}>
                <td>田中工業</td>
                <td>230,000</td>
                <td>200,000</td>
                <td>要確認</td>
              </tr>
            </tbody>
          </table>
          <p className={s.artifactNote}>
            <WarningCircle size={18} />
            差額は30,000円。理由を社内担当者に確認します。
          </p>
        </>
      )}
    </section>
  );
}
export function MailDraftArtifact() {
  return <section className={`${s.artifact} ${s.mailDraft}`} aria-label="Gmail下書きのサンプル">
    <span className={s.badge}>Gmail連携のサンプル体験 · 下書き保存</span>
    <dl>
      <div><dt>宛先</dt><dd>営業部 佐藤さん &lt;sato@example.com&gt;</dd></div>
      <div><dt>件名</dt><dd>田中工業様の売上・入金差額について確認のお願い</dd></div>
    </dl>
    <div className={s.mailBody}>{`佐藤さん

お疲れさまです。月末の売上・入金を確認したところ、田中工業様の売上230,000円に対して入金が200,000円となっており、30,000円の差額がありました。

分割での入金予定や、明細への入力漏れがないか、ご確認いただけますか。差額の理由と、未入金の場合は入金予定日を教えてください。

よろしくお願いします。`}</div>
    <p className={s.sampleNote}>架空の宛先・データによるサンプルです。実際のGmail保存・メール送信は行いません。</p>
  </section>;
}

export function FinanceSkillArtifact() {
  return <section className={s.artifact} aria-label="finance-checkerスキルのサンプル">
    <span className={s.badge}>スキル作成のサンプル体験</span>
    <h3 className={s.artifactLead}>finance-checker</h3>
    <ul className={s.skillDetails}>
      <li><strong>照合ルール</strong>：㈱・株式会社・空白を整理。確認済みの表記だけをまとめ、判断できない取引先は確認用に残す。</li>
      <li><strong>確認済みの対応</strong>：田中工業 ↔ ㈱田中工業、山田商事 ↔ 山田商事 株式会社。</li>
      <li><strong>社内担当者</strong>：田中工業は営業部の佐藤さん（sato@example.com）。</li>
      <li><strong>毎月の作業</strong>：売上・入金を照合し、差額一覧と担当者へのGmail下書きを作成。送信は人が確認して行う。</li>
      <li><strong>月次レポート</strong>：売上・照合済み入金・未入金残高、売上推移、取引先別売上、確認が必要なものをまとめる。前月データがある場合は前月比も表示。</li>
      <li><strong>集計の範囲</strong>：対象月末までの入金を確認。期限前の未入金と期限到来分を分け、照合できない入金は別枠に残す。</li>
    </ul>
    <p className={s.artifactLead}>次回の頼み方</p>
    <code className={s.skillPrompt}>finance-checkerで今月分を確認して ＋ 今月のExcel</code>
    <p className={s.sampleNote}>この画面では作成の流れを体験できます。実際のスキル保存や自動実行は行いません。</p>
  </section>;
}

function Bubble({
  children,
  person = "シフト係bot",
  own = false,
}: {
  children: React.ReactNode;
  person?: string;
  own?: boolean;
}) {
  return (
    <div className={own ? s.lineOwn : s.lineMessage}>
      <small>{person}</small>
      <div>{children}</div>
    </div>
  );
}
export function ShiftArtifact({ sample }: { sample: ShiftSample }) {
  return (
    <>
    {sample === "trial" && <details className={s.shiftInstructions} data-static-preview>
      <summary>AIと整理した指示文を見る</summary>
      <section className={s.artifact} aria-label="シフト調整の指示文の見本">
      <span className={s.badge}>AIと整理した指示文 · 見本</span>
      <h3 className={s.artifactLead}>LINEでシフトを集め、店長確認用の案を作って</h3>
      <ul className={s.skillDetails}>
        <li>毎月20日に募集、25日締切。自由な文章で希望を受け付ける。</li>
        <li>曖昧な開始時間だけ聞き返す。終了時間の指定がなければLASTとして登録し、内容を返す。訂正も受け付ける。</li>
        <li>24日に未回答者へ1回だけ個別に催促。締切後の未回答・返信は店長に知らせる。</li>
        <li>平日は17〜22時に2人、土日は18〜22時に3人。毎日責任者を1人配置。不足時は対象者と追加募集の文面を店長に確認してから送る。</li>
        <li>条件を満たさなければ店長に知らせる。シフト案は店長の最終承認後に共有する。</li>
      </ul>
      <p className={s.sampleNote}>試行用の指示文の見本です。この画面では保存・実行されません。</p>
    </section></details>}
    <section className={s.lineArtifact} aria-label="LINE連携のサンプル体験" data-static-preview={sample === "trial" ? "" : undefined}>
      <div className={s.lineHeader}>
        <ChatCircle size={21} weight="fill" />
        <strong>
          {sample === "reminder" || sample === "reply" ? "スタッフとシフト係bot" : sample === "trial" ? "募集からシフト確定まで" : "お店のシフト連絡"}
        </strong>
        <span>動作見本</span>
      </div>
      {sample === "trial" && <p className={s.lineScrollHint}>20日の自動募集から順に見られます。トーク内をスクロールしてください。</p>}
      <div className={sample === "trial" ? `${s.lineBody} ${s.lineTimeline}` : s.lineBody}
        role={sample === "trial" ? "region" : undefined}
        aria-label={sample === "trial" ? "募集から確定までのLINEトーク" : undefined}
        tabIndex={sample === "trial" ? 0 : undefined}>
        {sample === "recruit" && (
          <Bubble>
            来月のシフトを作ります。25日までに予定を教えてください。
          </Bubble>
        )}
        {sample === "reply" && (
          <>
            <Bubble person="山田さん" own>
              火曜は夕方から入れます
            </Bubble>
            <Bubble>
              火曜日は何時から勤務できますか？
            </Bubble>
            <Bubble person="山田さん" own>17時からです</Bubble>
            <Bubble>山田さん、火曜日17時からLASTで登録しました！</Bubble>
          </>
        )}
        {sample === "reminder" && (
          <>
            <Bubble>
              佐藤さん、来月のシフト希望の締切は明日25日です。勤務できる日時を、このトークで教えてください。
            </Bubble>
            <div className={s.availability}>
              24日・未回答の人に1回だけ個別に送る見本
            </div>
          </>
        )}
        {sample === "shortage" && (
          <>
            <p className={s.lineFoot}>店長が対象者と文面を承認した後の見本</p>
            <Bubble>土曜の18〜22時が1人足りません。入れる方はいますか？</Bubble>
            <Bubble person="鈴木さん" own>
              その日なら入れます！
            </Bubble>
            <Bubble>
              鈴木さん、ありがとうございます。土曜18〜22時でシフト案に反映しました！
            </Bubble>
            <ShiftRow filled />
            <p className={s.lineFoot}>
              <CheckCircle size={16} />
              人数・勤務条件を確認
            </p>
          </>
        )}
        {sample === "trial" && (
          <>
            <p className={s.lineDay}>20日 · 設定した日に自動で募集</p>
            <p className={s.lineChannel}>お店のシフト連絡 · グループ</p>
            <Bubble>来月のシフトを作ります。25日までに、勤務できる日時やお休みの希望を教えてください。</Bubble>
            <p className={s.lineChannel}>ここからは月曜〜日曜の1週間分の見本です。このお店のLASTは22時です。</p>
            <Bubble person="田中さん · 責任者" own>月・水は17〜22時、土曜は18〜22時で入れます。ほかの曜日は休みでお願いします。</Bubble>
            <Bubble>田中さん、月曜・水曜17〜22時、土曜18〜22時、ほかの曜日はお休みで登録しました！</Bubble>
            <Bubble person="山田さん" own>火曜は夕方から入れます</Bubble>
            <Bubble>火曜日は何時から勤務できますか？</Bubble>
            <Bubble person="山田さん" own>17時からです</Bubble>
            <Bubble>山田さん、火曜日17時からLASTで登録しました！</Bubble>
            <Bubble person="山田さん" own>土日も18〜22時で入れます。</Bubble>
            <Bubble>山田さん、土曜・日曜18〜22時も登録しました！</Bubble>
            <p className={s.lineDay}>21日 · 届いた希望を整理</p>
            <Bubble person="高橋さん · 責任者" own>火・木・金は17〜22時、日曜は18〜22時でお願いします。ほかの曜日は休みです。</Bubble>
            <Bubble>高橋さん、火曜・木曜・金曜17〜22時、日曜18〜22時、ほかの曜日はお休みで登録しました！</Bubble>
            <Bubble person="鈴木さん" own>月・水・金は17時から入れます。ほかの曜日はお休み希望です。</Bubble>
            <Bubble>鈴木さん、月曜・水曜・金曜17時からLAST、ほかの曜日はお休み希望で登録しました！</Bubble>
            <p className={s.lineDay}>24日 · 未回答の人に1回だけ催促</p>
            <p className={s.lineChannel}>佐藤さんとシフト係bot · 個別トーク</p>
            <Bubble>佐藤さん、来月のシフト希望の締切は明日25日です。勤務できる日時を、このトークで教えてください。</Bubble>
            <Bubble person="佐藤さん" own>遅くなりました！ 木曜17〜22時と日曜18〜22時で入れます。ほかの曜日は休み希望です。</Bubble>
            <Bubble>佐藤さん、木曜17〜22時、日曜18〜22時、ほかの曜日はお休み希望で登録しました！</Bubble>
            <p className={s.lineDay}>25日 · 集計して、不足を店長に相談</p>
            <p className={s.lineChannel}>店長とシフト係bot · 個別トーク</p>
            <Bubble>5人の希望がそろいました。平日は各2人・責任者1人、日曜の夜は3人・責任者1人で組めます。土曜18〜22時だけは田中さんと山田さんの2人で、あと1人必要です。</Bubble>
            <ShiftRow />
            <Bubble>土曜をお休み希望の鈴木さん・佐藤さんに、変更できるか聞いてもよいですか？ 文面案：「土曜18〜22時が1人足りません。もし予定の変更が可能であれば、ご協力いただけますか？ 難しければお休み希望のままで大丈夫です。」</Bubble>
            <Bubble person="店長" own>その2人に、その文面でお願いします。</Bubble>
            <p className={s.lineChannel}>鈴木さんとシフト係bot · 個別トーク（佐藤さんにも同じ依頼）</p>
            <Bubble>土曜18〜22時が1人足りません。もし予定の変更が可能であれば、ご協力いただけますか？ 難しければお休み希望のままで大丈夫です。</Bubble>
            <Bubble person="鈴木さん" own>その土曜なら予定が空いたので、18〜22時で入れます！</Bubble>
            <Bubble>鈴木さん、ありがとうございます。土曜18〜22時でシフト案に反映しました！</Bubble>
            <p className={s.lineChannel}>佐藤さんとシフト係bot · 個別トーク</p>
            <Bubble>土曜の不足枠は埋まりました。追加の勤務は不要です。お休み希望のままにしています。</Bubble>
            <p className={s.lineDay}>25日 · シフト案を店長が最終確認</p>
            <p className={s.lineChannel}>店長とシフト係bot · 個別トーク</p>
            <Bubble>鈴木さんの返信を反映し、月曜〜日曜の1週間分をまとめました。平日は各2人、土日は各3人で、毎日責任者が1人います。こちらの案で確定してよいですか？</Bubble>
            <WeeklySchedule />
            <p className={s.lineFoot}>平日は各2人・土日は各3人。毎日責任者1人。店長の最終承認を待ちます。</p>
            <Bubble person="店長" own>確認しました。この内容で確定して、みんなに知らせてください。</Bubble>
            <p className={s.lineChannel}>お店のシフト連絡 · グループ</p>
            <Bubble>店長の確認が完了し、月曜〜日曜の1週間分のシフトが確定しました！ シフト表を共有します。自分の勤務日と時間を確認してください。変更が必要なときは、このLINEで連絡してください。</Bubble>
            <WeeklySchedule confirmed />
            <p className={s.lineFoot}><CheckCircle size={16} />募集から確認・共有まで完了</p>
          </>
        )}
      </div>
      <p className={s.sampleNote}>
        架空のデータによる体験です。実際のLINEには送信されません。
      </p>
    </section>
    </>
  );
}
function WeeklySchedule({ confirmed = false }: { confirmed?: boolean }) {
  const title = confirmed ? "確定した1週間のシフト" : "1週間のシフト案";
  return <div className={s.schedule}>
    <strong>{title} · 月曜〜日曜</strong>
    <p className={s.lineFoot}>夕方〜夜の勤務 · このお店のLASTは22時</p>
    <table aria-label={title}>
      <thead><tr>
        <th scope="col">曜日・時間帯</th>
        <th scope="col">責任者</th>
        <th scope="col">スタッフ</th>
        <th scope="col">人数</th>
      </tr></thead>
      <tbody>{weeklyShiftSample.map((shift) => <tr key={shift.day}>
        <th scope="row">{shift.day}曜<br />{shift.hours}</th>
        <td>{shift.leader}</td>
        <td className={shift.day === "土" ? s.filled : undefined}>{shift.staff.join("・")}</td>
        <td>{shift.staff.length + 1}人</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
function ShiftRow({ filled = false }: { filled?: boolean }) {
  return (
    <div className={s.shiftRow}>
      <span>土曜 18–22時</span>
      <strong>{filled ? "田中（責任者）・山田・鈴木" : "田中（責任者）・山田"}</strong>
      <span className={filled ? s.ok : s.shortage}>
        {filled ? "配置済み" : "あと1人"}
      </span>
    </div>
  );
}
