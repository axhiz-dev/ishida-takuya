import {
  ChatCircle,
  CheckCircle,
  FileXls,
  WarningCircle,
} from "@phosphor-icons/react";
import s from "./chat.module.css";

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
  person = "シフト係",
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
export function ShiftArtifact({ step }: { step: number }) {
  return (
    <section className={s.lineArtifact} aria-label="LINE連携のサンプル体験">
      <div className={s.lineHeader}>
        <ChatCircle size={21} weight="fill" />
        <strong>
          {step === 2 ? "シフト係とのトーク" : "お店のシフト連絡"}
        </strong>
        <span>サンプル</span>
      </div>
      <div className={s.lineBody}>
        {step === 0 && (
          <Bubble>
            来月のシフトを作ります。25日までに予定を教えてください。
          </Bubble>
        )}
        {step === 1 && (
          <>
            <Bubble person="山田さん" own>
              火・木の夕方に入れます。12日は休みたいです。
            </Bubble>
            <Bubble>
              火・木の夕方、12日はお休みで登録します。違っていたら教えてください。
            </Bubble>
            <div className={s.availability}>
              勤務希望：火・木 夕方
              <br />
              休み希望：12日
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Bubble>
              佐藤さん、来月の希望がまだ届いていません。明日までに教えてください。
            </Bubble>
            <div className={s.availability}>
              提出済み <strong>9人</strong>
              <span>
                未提出 <strong>1人</strong>
              </span>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <Bubble>金曜の18〜22時が1人足りません。入れる方はいますか？</Bubble>
            <ShiftRow />
          </>
        )}
        {step === 4 && (
          <>
            <Bubble person="佐藤さん" own>
              その日なら入れます！
            </Bubble>
            <Bubble>
              佐藤さん、ありがとうございます。金曜18〜22時に反映しました。
            </Bubble>
            <ShiftRow filled />
            <p className={s.lineFoot}>
              <CheckCircle size={16} />
              人数・勤務条件を確認
            </p>
          </>
        )}
        {step === 5 && (
          <>
            <Bubble>
              来月のシフトができました。こちらから確認してください。
            </Bubble>
            <div className={s.schedule}>
              <strong>シフト表のプレビュー</strong>
              <table>
                <thead>
                  <tr>
                    <th>時間帯</th>
                    <th>木</th>
                    <th>金</th>
                    <th>土</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>昼</th>
                    <td>山田・田中</td>
                    <td>山田・鈴木</td>
                    <td>田中・鈴木</td>
                  </tr>
                  <tr>
                    <th>夜</th>
                    <td>山田・鈴木</td>
                    <td className={s.filled}>田中・佐藤</td>
                    <td>山田・佐藤</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <p className={s.sampleNote}>
        架空のデータによる体験です。実際のLINEには送信されません。
      </p>
    </section>
  );
}
function ShiftRow({ filled = false }: { filled?: boolean }) {
  return (
    <div className={s.shiftRow}>
      <span>金曜 18–22時</span>
      <strong>{filled ? "田中・佐藤" : "田中"}</strong>
      <span className={filled ? s.ok : s.shortage}>
        {filled ? "配置済み" : "あと1人"}
      </span>
    </div>
  );
}
