import {
  ChatCircle,
  CheckCircle,
  FileXls,
  WarningCircle,
} from "@phosphor-icons/react";
import s from "./chat.module.css";

export function AggregateArtifact({
  resolved,
  method,
}: {
  resolved?: boolean;
  method?: string;
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
              ["売上データ", "田中工業（株）", "230,000"],
              ["入金明細", "田中工業株式会社", "200,000"],
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
                      <td>山田商事</td>
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
            {method === "hold"
              ? "判断できない取引先を、確認用に分けました。"
              : "名前をそろえても、金額の違いが残りました。"}
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
            {method === "hold"
              ? "取引先の対応と入金額を、人が確認します。"
              : "差額は30,000円。分割入金か、入力漏れかを人が確認します。"}
          </p>
        </>
      )}
    </section>
  );
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
