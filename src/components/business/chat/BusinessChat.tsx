"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ChatTurn, { Guide, ResponseReadyContext } from "./ChatTurn";
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
import { AggregateArtifact, ShiftArtifact } from "./Artifacts";
import Consultation from "./Consultation";
import {
  concerns,
  experienceNames,
  questions,
  shiftSteps,
  type Experience,
} from "./content";
import s from "./chat.module.css";


const aggregateRequest = "私は経理担当をしています。\n毎月月末になると、売上データと入金明細のExcelを開いて、取引先ごとに金額を照合しています。\n会社名の書き方が違うこともあり、同じ取引先かどうかを一件ずつ確認するのが大変です。\n使っているExcelのサンプルはこちらです。毎月同じような作業なので、自動化したいのですが、できますか？";
const aggregateMethods = [
  { id: "code", label: "取引先コードで照合する", description: "共通のコードがあるか確認して、同じ取引先をまとめます。", reply: "両方のファイルに取引先コードがあります。名前の表記が違っても、コードが同じものを照合してください。" },
  { id: "name", label: "名前をそろえるルールを決める", description: "「（株）」などの表記の違いを整理します。", reply: "「（株）」と「株式会社」の表記をそろえるルールを決めたいです。判断が難しいものは、確認できるように残してください。" },
  { id: "hold", label: "判断が難しいものは確認に回す", description: "無理にまとめず、人が確認できるように残します。", reply: "同じ取引先か判断が難しいものは、無理にまとめず、私が確認する一覧に分けてください。" },
];

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
  const ready = useContext(ResponseReadyContext);
  const dock = useContext(ChoiceDockContext)!;
  const { setActive } = dock;
  useEffect(() => {
    if (!ready) return;
    setActive(id);
    return () => setActive((current) => current === id ? "" : current);
  }, [id, ready, setActive]);
  if (!ready || !dock.target || dock.active !== id || dock.dismissed === id) return null;
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
  const [method, setMethod] = useState("code");
  const [concern, setConcern] = useState("");
  const [question, setQuestion] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [contactStarted, setContactStarted] = useState(false);
  const [contactContext, setContactContext] = useState({
    topic: "",
    concern: "",
  });
  const main = useRef<HTMLElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const menuBox = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (activeChoice && dismissedChoice === activeChoice) launcher.current?.focus();
  }, [activeChoice, dismissedChoice]);
  useEffect(() => {
    if (view !== "experience" || !experience) main.current?.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [view, step, experience, question]);
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
    setView(next);
    setMenu(false);
    setSearch("");
    if (next === "faq") setQuestion(null);
  }
  function start(kind: Experience) {
    setExperience(kind);
    setStep(0);
    setConcern("");
    navigate("experience");
  }
  function home() {
    setExperience(null);
    setStep(0);
    setConcern("");
    navigate("experience");
  }
  function contact() {
    setContactStarted(true);
    setContactContext({
      topic: experience ? experienceNames[experience] : "AI活用について",
      concern,
    });
    navigate("contact");
  }
  const reflection =
    experience !== null && step >= (experience === "shift" ? 6 : 2);
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
              <WelcomeIntro />
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
            </div>
          )}
          {view === "experience" && experience && (
            <>
              {experience === "aggregate" && (
                <>
                  <ChatTurn user={aggregateRequest} attachments>
                    <Guide>
                      <p>サンプルを確認しました。まず、集計する前に確認したいことがあります。</p>
                      <AggregateArtifact />
                      <p>この2つ、どう扱いましょう？</p>
                      {step === 0 && <Choices label="集計の進め方" items={aggregateMethods.map((item) => ({
                        ...item, action: () => { setMethod(item.id); setStep(1); },
                      }))} />}
                    </Guide>
                  </ChatTurn>
                  {step >= 1 && <ChatTurn key={method} user={aggregateMethods.find((item) => item.id === method)!.reply}>
                    <Guide>
                      <p>確認が必要なものだけ、人が見られる形にしました。</p>
                      <AggregateArtifact resolved method={method} />
                      <p>この確認ルールを、来月も使える手順として残せます。</p>
                      {step === 1 && <Choices label="集計の進め方" items={[{
                        label: "自分の仕事で考えてみる", action: () => setStep(2),
                      }, {
                        label: "他の事例も見てみる", action: home,
                      }]} />}
                    </Guide>
                  </ChatTurn>}
                </>
              )}
              {!reflection && experience === "shift" && (
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
                      items={[
                        {
                          label: shiftSteps[step]!.next,
                          action: () => setStep(step + 1),
                        },
                      ]}
                    />
                  </div>
                </ChatTurn>
              )}
              {reflection && (
                <>
                  <ChatTurn user={experience === "aggregate" ? "自分の仕事で考えてみる" : "自分のお店で考えてみる"}>
                  <Guide>
                    <p>
                      {experience === "shift"
                        ? "シフトづくりの、どこを楽にしたいですか？"
                        : "ご自身の集計では、どこに時間がかかっていますか？"}
                    </p>
                  </Guide>
                  <div className={s.indent}>
                    {!concern && <Choices
                      label="困っていること"
                      items={concerns[experience].map((label) => ({
                        label,
                        action: () => setConcern(label),
                      }))}
                    />}
                  </div>
                  </ChatTurn>
                  {concern && (
                    <ChatTurn key={concern} user={concern}>
                      <Guide>
                        <p>今のやり方も含めて、ご相談いただけます。</p>
                      </Guide>
                      <div className={s.indent}>
                        <Choices
                          label="体験のあとに"
                          items={[
                            {
                              label: "この仕事について相談する",
                              description: "選んだ内容を引き継ぎます。",
                              action: contact,
                            },
                            {
                              label: "費用・支援内容を見る",
                              action: () => navigate("pricing"),
                            },
                            { label: "別の仕事を試す", action: home },
                          ]}
                        />
                      </div>
                    </ChatTurn>
                  )}
                </>
              )}
            </>
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
