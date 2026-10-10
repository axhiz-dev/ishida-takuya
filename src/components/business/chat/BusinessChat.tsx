"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
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
  User,
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

type View = "experience" | "faq" | "pricing" | "process" | "contact";
type Choice = { label: string; description?: string; action: () => void };
function Guide({
  children,
  title = false,
}: {
  children: ReactNode;
  title?: boolean;
}) {
  return (
    <div className={s.guide}>
      <Image
        src="/images/business/chat-guide.png"
        alt=""
        width={52}
        height={52}
        className={s.mascot}
      />
      <div className={s.guideText}>
        {title ? <h1>{children}</h1> : children}
      </div>
    </div>
  );
}
function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className={s.userMessage}>
      <p>{children}</p>
      <User size={23} weight="fill" aria-hidden="true" />
    </div>
  );
}
function Choices({ items, label }: { items: Choice[]; label: string }) {
  return (
    <div className={s.choices} role="group" aria-label={label}>
      {items.map((item, index) => (
        <button key={item.label} onClick={item.action} data-multiline>
          <span>
            <strong>{item.label}</strong>
            {item.description && <small>{item.description}</small>}
          </span>
          <span className={s.choiceTail}>
            <span className={s.choiceNumber} aria-hidden="true">
              {index + 1}
            </span>
            <CaretRight size={17} />
          </span>
        </button>
      ))}
    </div>
  );
}

export default function BusinessChat() {
  const [view, setView] = useState<View>("experience");
  const [experience, setExperience] = useState<Experience | null>(null);
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("code");
  const [concern, setConcern] = useState("");
  const [question, setQuestion] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [welcomed, setWelcomed] = useState(false);
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
    const timer = setTimeout(() => setWelcomed(true), 550);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (welcomed) {
      main.current?.scrollTo({ top: 0 });
      main.current?.focus({ preventScroll: true });
    }
  }, [view, step, experience, question, welcomed]);
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
    <div className={s.app}>
      <a className={s.skip} href="#business-conversation">
        会話へ移動
      </a>
      <header className={s.header}>
        <button
          onClick={() => navigate("experience")}
          className={s.brand}
          aria-label="体験に戻る"
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
          {(view !== "experience" || experience || !welcomed) && (
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
              {!welcomed ? (
                <Guide>
                  <p className={s.typing} role="status">
                    入力中<span>…</span>
                  </p>
                </Guide>
              ) : (
                <>
                  <Guide title>いつもの仕事、AIと一緒なら？</Guide>
                  <div className={s.indent}>
                    <p className={s.welcomeLead}>
                      気になる仕事から、試してみてください。
                    </p>
                    <p className={s.caption}>まずはサンプルで体験できます</p>
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
                    <p className={s.welcomeNote}>
                      いつもの仕事に合わせて、AIの使い方を一緒に考えます。
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          {view === "experience" && experience && (
            <>
              <div className={s.trail}>
                <button onClick={home}>
                  <ArrowLeft size={16} />
                  仕事を選び直す
                </button>
                <span>
                  {experience === "shift"
                    ? `${Math.min(step + 1, 6)} / 6`
                    : `${Math.min(step + 1, 3)} / 3`}
                </span>
              </div>
              <UserMessage>{experienceNames[experience]}</UserMessage>
              {!reflection && experience === "aggregate" && (
                <>
                  <Guide>
                    <p>
                      {step === 0
                        ? "まず、集計する前に確認したいことがあります。"
                        : "確認が必要なものだけ、人が見られる形にしました。"}
                    </p>
                  </Guide>
                  <div className={s.indent}>
                    <AggregateArtifact resolved={step === 1} method={method} />
                  </div>
                  <Guide>
                    <p>
                      {step === 0
                        ? "この2つ、どう扱いましょう？"
                        : "この確認ルールを、来月も使える手順として残せます。"}
                    </p>
                  </Guide>
                  <div className={s.indent}>
                    <Choices
                      label="集計の進め方"
                      items={
                        step === 0
                          ? [
                              {
                                label: "取引先コードで照合する",
                                description:
                                  "共通のコードがあるか確認して、同じ取引先をまとめます。",
                                action: () => {
                                  setMethod("code");
                                  setStep(1);
                                },
                              },
                              {
                                label: "名前をそろえるルールを決める",
                                description:
                                  "「（株）」などの表記の違いを整理します。",
                                action: () => {
                                  setMethod("name");
                                  setStep(1);
                                },
                              },
                              {
                                label: "判断が難しいものは確認に回す",
                                description:
                                  "無理にまとめず、人が確認できるように残します。",
                                action: () => {
                                  setMethod("hold");
                                  setStep(1);
                                },
                              },
                            ]
                          : [
                              {
                                label: "自分の仕事で考えてみる",
                                action: () => setStep(2),
                              },
                            ]
                      }
                    />
                  </div>
                </>
              )}
              {!reflection && experience === "shift" && (
                <>
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
                </>
              )}
              {reflection && (
                <>
                  <Guide>
                    <p>
                      {experience === "shift"
                        ? "シフトづくりの、どこを楽にしたいですか？"
                        : "ご自身の集計では、どこに時間がかかっていますか？"}
                    </p>
                  </Guide>
                  <div className={s.indent}>
                    <Choices
                      label="困っていること"
                      items={concerns[experience].map((label) => ({
                        label,
                        action: () => setConcern(label),
                      }))}
                    />
                  </div>
                  {concern && (
                    <>
                      <UserMessage>{concern}</UserMessage>
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
                    </>
                  )}
                </>
              )}
              {step > 0 && (
                <div className={s.indent}>
                  <button className={s.back} onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={16} />
                    ひとつ前に戻る
                  </button>
                </div>
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
                <>
                  <UserMessage>{questions[question]!.q}</UserMessage>
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
                </>
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
          {view !== "experience" && (
            <div className={s.indent}>
              <button className={s.back} onClick={() => navigate("experience")}>
                <ArrowLeft size={17} />
                {experience ? "体験の続きに戻る" : "仕事の体験を見る"}
              </button>
            </div>
          )}
        </div>
      </main>
      <footer className={s.dock}>
        {menu && (
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
        <button
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
        </button>
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
  );
}
