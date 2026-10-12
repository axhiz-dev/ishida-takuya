"use client";

import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ChatTurn, { ConversationActiveContext, Guide, ResponseReadyContext } from "./ChatTurn";
import WelcomeIntro from "./WelcomeIntro";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowCounterClockwise,
  BookmarkSimple,
  ChatCircle,
  Check,
  CaretDown,
  CaretRight,
  ListChecks,
  Plus,
  Question,
  X,
} from "@phosphor-icons/react";
import { AggregateArtifact, MailDraftArtifact, FinanceSkillArtifact, ShiftArtifact } from "./Artifacts";
import Consultation from "./Consultation";
import MonthlyReportArtifact from "./MonthlyReportArtifact";
import {
  experienceNames,
  questions,
  shiftSteps,
  type Experience,
} from "./content";
import s from "./chat.module.css";


const aggregateRequest = "私は経理担当をしています。\n毎月月末になると、売上データと入金明細のExcelを開いて、取引先ごとに金額を照合しています。\n会社名の書き方が違うこともあり、同じ取引先かどうかを一件ずつ確認するのが大変です。\n使っているExcelのサンプルはこちらです。毎月同じような作業なので、自動化したいのですが、できますか？";
const aggregateConfirmation = "はい、田中工業と㈱田中工業は同じ取引先です。山田商事の表記違いもまとめてください。同じ会社か判断できないものは、確認用に残してください。";
const aggregateMailRequest = "田中工業の社内担当者は営業部の佐藤さん（sato@example.com）です。差額の理由を確認するメールを作って、連携したGmailに下書き保存してください。まだ送信はしないでください。";
const aggregateReportRequest = "確認した結果を、売上や入金状況がひと目で分かる月次レポートにできますか？ 件数が多いときの見え方も確かめたいので、架空の確認用サンプルを作って見せてください。";
const aggregateSkillRequest = "OKです。毎月月末に、照合から月次レポートまで同じ形で作れるスキルにしてください。取引先の表記ルールと社内担当者も保存して、次回は今月分のExcelだけで進められるようにしたいです。前月との比較には過去のデータも使ってください。";

type View = "experience" | "faq" | "pricing" | "process" | "contact";
type Choice = { label: string; description?: string; action: () => void };
type ChoiceDock = {
  target: HTMLDivElement | null;
  active: string;
  dismissed: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setDismissed: React.Dispatch<React.SetStateAction<string>>;
};
const ChoiceDockContext = createContext<ChoiceDock | null>(null);
function Choices({ items, label }: { items: Choice[]; label: string }) {
  const id = useId();
  const complete = useContext(ResponseReadyContext);
  const active = useContext(ConversationActiveContext);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!complete || !active) return;
    const timer = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timer);
  }, [complete, active]);
  const dock = useContext(ChoiceDockContext)!;
  const { setActive } = dock;
  useEffect(() => {
    if (!ready || !active) return;
    setActive(id);
    return () => setActive((current) => current === id ? "" : current);
  }, [id, ready, active, setActive]);
  if (!active || !ready || !dock.target || dock.active !== id || dock.dismissed === id) return null;
  return createPortal(
    <section className={s.floatingChoices} aria-label="選択肢パネル" onKeyDown={(event) => {
      if (event.key === "Escape") dock.setDismissed(id);
    }}>
      <div className={s.choicePanelHeader}>
        <span>{label}</span>
        <button aria-label="選択肢を閉じる" onClick={() => dock.setDismissed(id)}><X size={20} /></button>
      </div>
      <div className={s.choices} role="group" aria-label={label}>
        {items.map((item, index) => (
          <button key={item.label} onClick={() => { dock.setDismissed(id); item.action(); }} data-multiline>
            <span><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
            <span className={s.choiceTail}>
              <span className={s.choiceNumber} aria-hidden="true">{index + 1}</span>
              <CaretRight size={17} />
            </span>
          </button>
        ))}
      </div>
    </section>, dock.target,
  );
}

export default function BusinessChat() {
  const [choiceTarget, setChoiceTarget] = useState<HTMLDivElement | null>(null);
  const [activeChoice, setActiveChoice] = useState("");
  const [dismissedChoice, setDismissedChoice] = useState("");
  const choicesVisible = !!activeChoice && dismissedChoice !== activeChoice;
  const [view, setView] = useState<View>("experience");
  const [experience, setExperience] = useState<Experience | null>(null);
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [contactStarted, setContactStarted] = useState(false);
  const [contactContext, setContactContext] = useState({
    topic: "",
    concern: "",
  });
  const main = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Partial<Record<View, number>>>({});
  const launcher = useRef<HTMLButtonElement>(null);
  const menuBox = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (activeChoice && dismissedChoice === activeChoice) launcher.current?.focus();
  }, [activeChoice, dismissedChoice]);
  useLayoutEffect(() => {
    const restore = () => main.current?.scrollTo({ top: scrollPositions.current[view] ?? 0 });
    restore();
    // Choices return through a portal after effects run; restore once more
    // after the dock has its original height.
    const frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [view]);
  useEffect(() => {
    if (view === "experience" && !experience) main.current?.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [view, step, experience, question]);
  useEffect(() => {
    if (view === "faq") main.current?.scrollTo({ top: 0 });
  }, [question, view]);
  useEffect(() => {
    if (!menu) return;
    searchInput.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        launcher.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (
        !menuBox.current?.contains(e.target as Node) &&
        !launcher.current?.contains(e.target as Node)
      )
        setMenu(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menu]);
  function navigate(next: View) {
    if (next !== view && main.current) scrollPositions.current[view] = main.current.scrollTop;
    setView(next);
    setMenu(false);
    setSearch("");
    if (next === "faq") setQuestion(null);
  }
  function start(kind: Experience) {
    setExperience(kind);
    setStep(0);
    scrollPositions.current.experience = 0;
    navigate("experience");
  }
  function home() {
    setExperience(null);
    setStep(0);
    scrollPositions.current.experience = 0;
    navigate("experience");
  }
  function contact() {
    setContactStarted(true);
    setContactContext({
      topic: experience ? experienceNames[experience] : "AI活用について",
      concern: "",
    });
    navigate("contact");
  }
  const menuItems = [
    {
      label: "仕事の体験",
      icon: ListChecks,
      action: () => navigate("experience"),
    },
    {
      label: "費用・支援内容",
      icon: ListChecks,
      action: () => navigate("pricing"),
    },
    { label: "よくある質問", icon: Question, action: () => navigate("faq") },
    {
      label: "支援の進め方",
      icon: ListChecks,
      action: () => navigate("process"),
    },
    { label: "相談する", icon: ChatCircle, action: contact },
  ].filter((item) => item.label.includes(search.trim()));
  return (
    <ChoiceDockContext.Provider value={{ target: choiceTarget, active: activeChoice, dismissed: dismissedChoice, setActive: setActiveChoice, setDismissed: setDismissedChoice }}>
    <div className={s.app}>
      <a className={s.skip} href="#business-conversation">
        会話へ移動
      </a>
      <header className={s.header}>
        <button
          onClick={home}
          className={s.brand}
          aria-label="最初の画面に戻る"
          title="最初の画面に戻る"
        >
          石田 卓也
        </button>
        <span className={s.service}>AI導入・活用の伴走支援</span>
        <nav aria-label="ご案内">
          <button onClick={() => navigate("faq")}>費用・FAQ</button>
          <button onClick={contact}>
            <ChatCircle size={21} />
            相談する
          </button>
        </nav>
      </header>
      <main
        ref={main}
        id="business-conversation"
        tabIndex={-1}
        className={s.main}
      >
        <div className={s.conversation}>
          {(view !== "experience" || experience) && (
            <h1 className={s.srOnly}>AI導入・活用の伴走支援</h1>
          )}
          {view !== "experience" && experience && (
            <button
              className={s.context}
              onClick={() => navigate("experience")}
              data-multiline
            >
              <BookmarkSimple size={18} />
              <span>
                {experienceNames[experience]}の体験を途中まで見ています
              </span>
              <ArrowLeft size={17} />
            </button>
          )}
          {view === "experience" && !experience && (
            <div className={s.welcome}>
              <WelcomeIntro>
              <div className={s.indent}>
                <Choices
                  label="試したい仕事"
                  items={[
                    {
                      label: experienceNames.aggregate,
                      description:
                        "ファイルを照合して、確認が必要なものだけ手元に。",
                      action: () => start("aggregate"),
                    },
                    {
                      label: experienceNames.shift,
                      description:
                        "いつものLINEで、希望の回収から完成のお知らせまで。",
                      action: () => start("shift"),
                    },
                    {
                      label: "何に使えるか、まだ分からない",
                      description: "支援の進め方から見てみる",
                      action: () => navigate("process"),
                    },
                  ]}
                />
              </div>
              </WelcomeIntro>
            </div>
          )}
          {experience && (
            <ConversationActiveContext.Provider value={view === "experience"}>
            <div hidden={view !== "experience"}>
              {experience === "aggregate" && (
                <>
                  <ChatTurn user={aggregateRequest} attachments>
                    <Guide>
                      <p>Excelを確認しました。共通の取引先コードがなく、会社名にも表記の揺れがあります。</p>
                      <AggregateArtifact />
                      <p>まず「㈱」「株式会社」や空白をそろえて、同じ取引先の候補を探しましょう。</p>
                      <p>売上の「田中工業」と入金明細の「㈱田中工業」は、同じ会社ですか？ 確認できた対応だけを照合に使います。</p>
                      {step === 0 && <Choices label="取引先の確認" items={[{
                        label: "同じ会社です。このルールで照合して", action: () => setStep(1),
                      }]} />}
                    </Guide>
                  </ChatTurn>
                  {step >= 1 && <ChatTurn user={aggregateConfirmation}>
                    <Guide>
                      <p>確認いただいた表記をまとめて照合しました。田中工業だけ、売上と入金が3万円ずれています。</p>
                      <AggregateArtifact resolved />
                      <p>分割入金か、入力漏れかはExcelだけでは分かりません。田中工業を担当する社内の方に、確認するメールを用意しましょうか？</p>
                      {step === 1 && <Choices label="差額を確認する" items={[{
                        label: "担当者を伝えて、確認メールを下書きして", description: "宛先と依頼内容をAIに伝えます。", action: () => setStep(2),
                      }]} />}
                    </Guide>
                  </ChatTurn>}
                  {step >= 2 && <ChatTurn user={aggregateMailRequest}>
                    <Guide>
                      <p>連携したGmailに、佐藤さんへのメールを下書き保存しました。内容はこちらです。</p>
                      <MailDraftArtifact />
                      <p>送信はしていません。宛先と内容を確認してから、Gmailで送れます。</p>
                      <p>確認結果は、売上や入金状況が分かる月次レポートにもまとめられます。</p>
                      {step === 2 && <Choices label="月次レポートを確かめる" items={[{
                        label: "件数の多いサンプルで月次レポートを見てみる", action: () => setStep(3),
                      }]} />}
                    </Guide>
                  </ChatTurn>}
                  {step >= 3 && <ChatTurn user={aggregateReportRequest}>
                    <Guide>
                      <p>見え方を確かめるため、半年分・8社の架空データを「サンプル2」として作りました。表記の対応と担当者も、確認済みという設定のテストデータです。</p>
                      <p>売上推移と取引先別の売上に加え、期限を迎えた未入金や、照合できない入金も分けて表示します。対象月を切り替えたり、元のExcelを確認したりできます。</p>
                      <MonthlyReportArtifact />
                      <p>この月次レポートまで、毎月の作業としてスキルに保存しましょうか？</p>
                      {step === 3 && <Choices label="毎月の仕事にする" items={[{
                        label: "月次レポートまで毎月使えるスキルにして", action: () => setStep(4),
                      }]} />}
                    </Guide>
                  </ChatTurn>}
                  {step >= 4 && <ChatTurn user={aggregateSkillRequest} emphasize="スキル">
                    <Guide>
                      <p><strong>finance-checker</strong> という<strong>スキル</strong>を作成します。</p>
                      <FinanceSkillArtifact />
                      <p>照合とメール下書きに加えて、月次レポートまで同じ形で作れます。前月比較や売上推移には、過去のExcelも一緒に渡します。</p>
                      <p>次の月末は「finance-checkerで今月分を確認して」と、売上・入金のExcelを添えるだけ。取引先の表記ルールや社内担当者の情報は、毎回渡す必要がありません。</p>
                      <p>担当者や照合ルールが変わったときは、スキルを更新できます。</p>
                      <p>僕に任せられる仕事は、これだけではありません。もっと仕事を楽にする方法を、一緒に考えてみませんか？</p>
                      {step === 4 && <Choices label="あなたの仕事でも" items={[{
                        label: "自分の仕事について相談する", action: contact,
                      }, {
                        label: "他の事例も見てみる", action: home,
                      }]} />}
                    </Guide>
                  </ChatTurn>}
                </>
              )}
              {experience === "shift" && (
                <ChatTurn key={`shift-${step}`} user={step === 0 ? "スタッフのシフト希望を毎月LINEで集めています。返信の確認や、足りない時間帯の調整に時間がかかるので、自動化できるか知りたいです。" : shiftSteps[step - 1]!.next}>
                  <Guide>
                    <p>{shiftSteps[step]!.line}</p>
                  </Guide>
                  <div className={s.indent}>
                    <p className={s.caption}>
                      {shiftSteps[step]!.title} · LINE連携のサンプル体験
                    </p>
                    <ShiftArtifact step={step} />
                    {step === 5 && (
                      <p className={s.subtext}>
                        調整がつかない場合は、責任者にお知らせします。確定前の承認も、運用に合わせて設定します。
                      </p>
                    )}
                    <Choices
                      label="シフト体験を進める"
                      items={step === 5 ? [
                        { label: "自分の仕事について相談する", action: contact },
                        { label: "他の事例も見てみる", action: home },
                      ] : [
                        {
                          label: shiftSteps[step]!.next,
                          action: () => setStep(step + 1),
                        },
                      ]}
                    />
                  </div>
                </ChatTurn>
              )}
            </div>
            </ConversationActiveContext.Provider>
          )}
          {view === "faq" && (
            <>
              {question === null ? (
                <>
                  <Guide>
                    <p>気になることはありますか？</p>
                  </Guide>
                  <div className={s.indent}>
                    <div className={s.tabs}>
                      <button aria-pressed="true">よくある質問</button>
                      <button onClick={() => navigate("pricing")}>
                        費用・支援内容
                      </button>
                    </div>
                    <Choices
                      label="よくある質問"
                      items={questions.map((q, i) => ({
                        label: q.q,
                        action: () => setQuestion(i),
                      }))}
                    />
                  </div>
                </>
              ) : (
                <ChatTurn key={question} user={questions[question]!.q}>
                  <Guide>
                    <p>{questions[question]!.a}</p>
                  </Guide>
                  {question === 2 && (
                    <div className={s.indent}>
                      <dl className={s.summary}>
                        <div>
                          <dt>初期費用</dt>
                          <dd>業務の整理・設定・動作確認</dd>
                        </div>
                        <div>
                          <dt>月額費用</dt>
                          <dd>運用サポート・所定の利用料</dd>
                        </div>
                        <div>
                          <dt>利用量が増える場合</dt>
                          <dd>人数や通知回数に応じて、事前にご相談</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                  <div className={s.indent}>
                    <Choices
                      label="回答のあとに"
                      items={[
                        {
                          label: "ほかの質問を見る",
                          action: () => setQuestion(null),
                        },
                        {
                          label: "費用・支援内容を見る",
                          action: () => navigate("pricing"),
                        },
                        {
                          label: experience
                            ? "体験の続きに戻る"
                            : "仕事の体験を見る",
                          action: () => navigate("experience"),
                        },
                        {
                          label: "自分の仕事について相談する",
                          action: contact,
                        },
                      ]}
                    />
                  </div>
                </ChatTurn>
              )}
            </>
          )}
          {view === "pricing" && (
            <>
              <Guide>
                <p>仕事に合う範囲を整理してから、費用をご案内します。</p>
              </Guide>
              <div className={s.indent}>
                <div className={s.tabs}>
                  <button onClick={() => navigate("faq")}>よくある質問</button>
                  <button aria-pressed="true">費用・支援内容</button>
                </div>
                <dl className={s.summary}>
                  <div>
                    <dt>初期の支援</dt>
                    <dd>業務の整理・設定・動作確認</dd>
                  </div>
                  <div>
                    <dt>継続の支援</dt>
                    <dd>運用サポート・使いながらの調整</dd>
                  </div>
                  <div>
                    <dt>外部サービス</dt>
                    <dd>LINE・AIなどの利用量を確認</dd>
                  </div>
                </dl>
                <p className={s.subtext}>
                  料金・支援範囲は現在検討中です。月額に含める利用量と、追加費用が発生する条件は、ご依頼前にご案内します。
                </p>
                <Choices
                  label="費用のあとに"
                  items={[
                    { label: "自分の仕事について相談する", action: contact },
                    {
                      label: "支援の進め方を見る",
                      action: () => navigate("process"),
                    },
                  ]}
                />
              </div>
            </>
          )}
          {view === "process" && (
            <>
              <Guide>
                <p>いつもの仕事を、一緒に見直すところから。</p>
              </Guide>
              <div className={s.indent}>
                <ol className={s.process}>
                  {[
                    [
                      "今のやり方を聞く",
                      "使っている資料や、時間がかかるところを整理します。",
                    ],
                    [
                      "小さく試して確かめる",
                      "見本で動かし、人が判断するところも決めます。",
                    ],
                    [
                      "使いながら調整する",
                      "現場に合う手順にして、続けられる形を考えます。",
                    ],
                  ].map(([title, body], i) => (
                    <li key={title}>
                      <span>{i + 1}</span>
                      <div>
                        <h2>{title}</h2>
                        <p>{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Choices
                  label="進め方のあとに"
                  items={[
                    {
                      label: "仕事の体験を見る",
                      action: () => navigate("experience"),
                    },
                    {
                      label: "まだ整理できていないけれど相談する",
                      action: contact,
                    },
                  ]}
                />
              </div>
            </>
          )}
          {contactStarted && (
            <div hidden={view !== "contact"}>
              <Guide>
                <p>今の仕事について、少し教えてください。</p>
              </Guide>
              <div className={s.indent}>
                <Consultation
                  topic={contactContext.topic}
                  concern={contactContext.concern}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className={s.dock}>
        <div ref={setChoiceTarget} className={s.choiceSlot} />
        {!choicesVisible && activeChoice && <button className={s.resumeChoices} onClick={() => setDismissedChoice("")}>選択肢を表示</button>}
        {!choicesVisible && menu && (
          <div
            className={s.menu}
            ref={menuBox}
            id="business-menu"
            role="region"
            aria-label="できること"
          >
            <div className={s.menuSearch}>
              <input
                ref={searchInput}
                aria-label="メニューを検索"
                placeholder="できることを検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => {
                  setMenu(false);
                  launcher.current?.focus();
                }}
                aria-label="メニューを閉じる"
              >
                <X size={20} />
              </button>
            </div>
            {menuItems.map(({ label, icon: Icon, action }) => (
              <button key={label} onClick={action}>
                <Icon size={21} />
                <span>{label}</span>
                <CaretRight size={17} />
              </button>
            ))}
            {!menuItems.length && (
              <p className={s.subtext}>該当するメニューはありません。</p>
            )}
            <button onClick={home}>
              <ArrowCounterClockwise size={21} />
              <span>最初から見る</span>
            </button>
          </div>
        )}
        {!choicesVisible && <button
          ref={launcher}
          className={s.launcher}
          aria-expanded={menu}
          aria-controls="business-menu"
          onClick={() => {
            setMenu(!menu);
            setSearch("");
          }}
        >
          <Plus size={25} />
          <span>メニューから、できることを選ぶ</span>
          <CaretDown size={20} />
        </button>}
        <div className={s.dockMeta}>
          <span>
            <Check size={12} />
            選択式のサンプル体験
          </span>
          <Link href="/business/privacy">プライバシー</Link>
          <Link href="/business/legal">特定商取引法に基づく表記</Link>
        </div>
      </footer>
      <noscript>
        <p className={s.noScript}>
          この体験にはJavaScriptが必要です。
          <Link href="/business/profile">支援者のプロフィールはこちら</Link>
          。問い合わせ窓口は準備中です。
        </p>
      </noscript>
    </div>
    </ChoiceDockContext.Provider>
  );
}
