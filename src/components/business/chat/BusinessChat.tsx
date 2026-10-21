"use client";

import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ChatTurn, { ConversationActiveContext, Guide, ResponseReadyContext } from "./ChatTurn";
import WelcomeIntro from "./WelcomeIntro";
import Link from "next/link";
import {
  ArrowCounterClockwise,
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
import MonthlyReportArtifact from "./MonthlyReportArtifact";
import GrowthArtifact from "./GrowthArtifacts";
import GrowthDocumentPreview, { GrowthDocuments } from "./GrowthDocumentPreview";
import type { GrowthDocumentId } from "./growthDocuments";
import { growthScenarios } from "./growthScenarios";
import {
  experienceNames,
  experienceOptions,
  shiftSteps,
  type Experience,
} from "./content";
import s from "./chat.module.css";
import support from "./support.module.css";
import BusinessHeader from "../BusinessHeader";
import { owner } from "@/config/owner";
import SupportPanel from "./SupportPanel";
import { PersonAvatar } from "./SelfIntroduction";
import { readBusinessPanel, type BusinessPanel } from "./supportContent";


const aggregateRequest = "私は経理担当をしています。\n毎月月末になると、売上データと入金明細のExcelを開いて、取引先ごとに金額を照合しています。\n会社名の書き方が違うこともあり、同じ取引先かどうかを一件ずつ確認するのが大変です。\n使っているExcelのサンプルはこちらです。毎月同じような作業なので、自動化したいのですが、できますか？";
const aggregateConfirmation = "はい、田中工業と㈱田中工業は同じ取引先です。山田商事の表記違いもまとめてください。同じ会社か判断できないものは、確認用に残してください。";
const aggregateMailRequest = "田中工業の社内担当者は営業部の佐藤さん（sato@example.com）です。差額の理由を確認するメールを作って、連携したGmailに下書き保存してください。まだ送信はしないでください。";
const aggregateReportRequest = "確認した結果を、売上や入金状況がひと目で分かる月次レポートにできますか？ 件数が多いときの見え方も確かめたいので、架空の確認用サンプルを作って見せてください。";
const aggregateSkillRequest = "OKです。毎月月末に、照合から月次レポートまで同じ形で作れるスキルにしてください。取引先の表記ルールと社内担当者も保存して、次回は今月分のExcelだけで進められるようにしたいです。前月との比較には過去のデータも使ってください。";

type Choice = { label: string; description?: string; badge?: string; action: () => void };
type ChoiceDock = {
  target: HTMLDivElement | null;
  active: string;
  dismissed: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setDismissed: React.Dispatch<React.SetStateAction<string>>;
};
const ChoiceDockContext = createContext<ChoiceDock | null>(null);
function Choices({ items, label, inline = false }: { items: Choice[]; label: string; inline?: boolean }) {
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
    if (!ready || !active || inline) return;
    setActive(id);
    return () => setActive((current) => current === id ? "" : current);
  }, [id, ready, active, setActive, inline]);
  if (!active || !ready || (!inline && (!dock.target || dock.active !== id || dock.dismissed === id))) return null;
  const panel = <section className={inline ? s.introChoices : s.floatingChoices} aria-label="選択肢パネル" onKeyDown={(event) => {
      if (event.key === "Escape") dock.setDismissed(id);
    }}>
      <div className={s.choicePanelHeader}>
        <span>{label}</span>
        {!inline && <button aria-label="選択肢を閉じる" onClick={() => dock.setDismissed(id)}><X size={20} /></button>}
      </div>
      <div className={s.choices} role="group" aria-label={label}>
        {items.map((item, index) => (
          <button key={item.label} aria-label={item.label} aria-describedby={item.description ? `${id}-description-${index}` : undefined} onClick={() => { dock.setDismissed(id); item.action(); }} data-multiline>
            {item.badge && <span className={s.choiceExampleBadge} aria-hidden="true">{item.badge}</span>}
            <span><strong>{item.label}</strong>{item.description && <small id={`${id}-description-${index}`}>{item.description}</small>}</span>
            <span className={s.choiceTail}>
              <span className={s.choiceNumber} aria-hidden="true">{index + 1}</span>
              <CaretRight size={17} />
            </span>
          </button>
        ))}
      </div>
    </section>;
  return inline ? panel : createPortal(panel, dock.target!);
}

function CompletionBridge({ onAbout }: { onAbout: () => void }) {
  return <section data-static-preview aria-label="自己紹介へのリンク"><button className={support.personLink} onClick={onAbout} aria-label="石田ってどんな人？">
    <PersonAvatar compact />
    <span>石田ってどんな人？</span>
    <CaretRight size={18} aria-hidden="true" />
  </button></section>;
}

export default function BusinessChat() {
  const [choiceTarget, setChoiceTarget] = useState<HTMLDivElement | null>(null);
  const [activeChoice, setActiveChoice] = useState("");
  const [dismissedChoice, setDismissedChoice] = useState("");
  const choicesVisible = !!activeChoice && dismissedChoice !== activeChoice;
  const [panel, setPanel] = useState<BusinessPanel | null>(null);
  const [sourceDocument, setSourceDocument] = useState<GrowthDocumentId | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [step, setStep] = useState(0);
  const [selectingExperience, setSelectingExperience] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const main = useRef<HTMLElement>(null);
  const backgroundScroll = useRef(0);
  const panelRef = useRef<BusinessPanel | null>(null);
  useLayoutEffect(() => {
    panelRef.current = panel;
    if (panel || sourceDocument) return;
    // Pausing removes the choice dock temporarily. Restore after its portal returns,
    // including when the growing viewport clamped a scroll position near the end.
    const restore = () => main.current?.scrollTo({ top: backgroundScroll.current });
    restore();
    const frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [panel, sourceDocument]);
  const launcher = useRef<HTMLButtonElement>(null);
  const menuBox = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (activeChoice && dismissedChoice === activeChoice) launcher.current?.focus();
  }, [activeChoice, dismissedChoice]);
  // URL-addressable overlays preserve the mounted conversation and form.
  useEffect(() => {
    const sync = () => { const next = readBusinessPanel(window.location.hash); if (next && !panelRef.current && main.current) backgroundScroll.current = main.current.scrollTop; setPanel(next); setMenu(false); if (!next) setDismissedChoice(""); };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
  }, [experience, step]);
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
  function navigate(next: BusinessPanel) {
    if (!panel && main.current) backgroundScroll.current = main.current.scrollTop;
    const url = `${window.location.pathname}${window.location.search}#${next}`;
    if (panel) window.history.replaceState(window.history.state, "", url);
    else window.history.pushState({ ...window.history.state, businessPanel: true }, "", url);
    setPanel(next);
    setMenu(false);
    setSearch("");
  }
  function closePanel() {
    // In-app openings use one history entry; direct links close in place.
    if (window.history.state?.businessPanel) window.history.back();
    else { window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`); setPanel(null); }
    setDismissedChoice("");
  }
  function start(kind: Experience) {
    setExperience(kind);
    setSelectingExperience(false);
    setStep(0);
    setMenu(false);
    setDismissedChoice("");
    backgroundScroll.current = 0;
    main.current?.scrollTo({ top: 0 });
  }
  function home() {
    setExperience(null);
    setSelectingExperience(false);
    setStep(0);
    setMenu(false);
    backgroundScroll.current = 0;
    main.current?.scrollTo({ top: 0 });
  }
  function contact() { navigate("contact"); }
  function openDocument(id: GrowthDocumentId) {
    if (main.current) backgroundScroll.current = main.current.scrollTop;
    setSourceDocument(id);
  }
  const completionChoices: Choice[] = [
    { label: "自分の仕事について相談する", description: "初回30分・無料。メールで日程を調整します。", action: contact },
    { label: "費用や支援の進め方を確認する", action: () => navigate("pricing") },
    { label: "もうひとつの事例を見る", action: () => { setSelectingExperience(true); setDismissedChoice(""); } },
  ];
  const finalChoices: Choice[] = selectingExperience ? [
    ...experienceOptions.filter((option) => option.kind !== experience).map((option) => ({
      label: option.label,
      description: option.description,
      action: () => start(option.kind),
    })),
    { label: "元の選択肢に戻る", action: () => { setSelectingExperience(false); setDismissedChoice(""); } },
  ] : completionChoices;
  const growthSteps = experience === "prospecting" || experience === "proposal" ? growthScenarios[experience] : null;
  const menuItems = [
    {
      label: "仕事の体験",
      icon: ListChecks,
      action: () => { setMenu(false); main.current?.focus({ preventScroll: true }); },
    },
    {
      label: "支援内容・費用",
      icon: ListChecks,
      action: () => navigate("pricing"),
    },
    { label: "よくある質問", icon: Question, action: () => navigate("faq") },
    {
      label: "支援の進め方",
      icon: ListChecks,
      action: () => navigate("process"),
    },
    { label: "自己紹介", icon: Question, action: () => navigate("about") },
    { label: "相談する", icon: ChatCircle, action: contact },
  ].filter((item) => item.label.includes(search.trim()));
  return (
    <ChoiceDockContext.Provider value={{ target: choiceTarget, active: activeChoice, dismissed: dismissedChoice, setActive: setActiveChoice, setDismissed: setDismissedChoice }}>
    <div className={s.app}>
      <a className={s.skip} href="#business-conversation">
        会話へ移動
      </a>
      <BusinessHeader onHome={home} onOpen={navigate} />
      <main
        ref={main}
        id="business-conversation"
        tabIndex={-1}
        className={s.main}
      >
        <div className={s.conversation}>
          {experience && <h1 className={s.srOnly}>AI導入・活用の伴走支援</h1>}
          <div hidden={!!experience}>
            <div className={s.welcome}>
              <WelcomeIntro>
              <div className={s.indent}>
                <Choices
                  inline
                  label="あなたの仕事に似ている場面を選んでみてください"
                  items={[
                    ...experienceOptions.map((option, index) => ({
                      label: option.label,
                      badge: `例${index + 1}`,
                      description: option.description,
                      action: () => start(option.kind),
                    })),
                    {
                      label: "支援の進め方を見る",
                      description: "無料相談から利用開始までをご案内",
                      action: () => navigate("process"),
                    },
                  ]}
                />
              </div>
              </WelcomeIntro>
            </div>
          </div>
          {experience && (
            <ConversationActiveContext.Provider value={!panel && !sourceDocument}>
            <div key={experience}>
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
                      <CompletionBridge onAbout={() => navigate("about")} />
                      {step === 4 && <Choices label="あなたの仕事でも" items={finalChoices} />}
                    </Guide>
                  </ChatTurn>}
                </>
              )}
              {growthSteps && growthSteps.slice(0, step + 1).map((scene, index) => (
                <ChatTurn key={`${experience}-${index}`} user={scene.user}
                  sourceAttachments={scene.documents && <GrowthDocuments ids={scene.documents} onOpen={openDocument} />}>
                  <Guide>
                    {scene.replies.map((reply) => <p key={reply}>{reply}</p>)}
                    {scene.sample && <GrowthArtifact sample={scene.sample} onOpenDocument={openDocument} />}
                    {index === growthSteps.length - 1 && <CompletionBridge onAbout={() => navigate("about")} />}
                    {step === index && <Choices
                      label={selectingExperience ? "ほかの事例を選ぶ" : scene.choiceLabel}
                      items={index === growthSteps.length - 1 ? finalChoices : [{
                        label: scene.next,
                        action: () => setStep(index + 1),
                      }]}
                    />}
                  </Guide>
                </ChatTurn>
              ))}
              {experience === "shift" && (
                <>
                  {shiftSteps.slice(0, step + 1).map((scene, index) => (
                    <ChatTurn key={`shift-${index}`} user={scene.user}>
                      <Guide>
                        {scene.replies.map((reply) => <p key={reply}>{reply}</p>)}
                        {scene.sample && <ShiftArtifact sample={scene.sample} />}
                        {index === shiftSteps.length - 1 && <CompletionBridge onAbout={() => navigate("about")} />}
                        {step === index && <Choices
                          label={scene.choiceLabel}
                          items={index === shiftSteps.length - 1 ? finalChoices : [{
                            label: scene.next,
                            action: () => setStep(index + 1),
                          }]}
                        />}
                      </Guide>
                    </ChatTurn>
                  ))}
                </>
              )}
            </div>
            </ConversationActiveContext.Provider>
          )}
        </div>
      </main>
      <footer className={s.dock}>
        <div ref={setChoiceTarget} className={s.choiceSlot} />
        {!choicesVisible && activeChoice && <button className={s.resumeChoices} onClick={() => setDismissedChoice("")}>選択肢を表示</button>}
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
          <Link href="/business/privacy" target="_blank" rel="noopener noreferrer">プライバシー</Link>
          <Link href="/business/legal" target="_blank" rel="noopener noreferrer">特定商取引法に基づく表記</Link>
        </div>
      </footer>
      {sourceDocument && <GrowthDocumentPreview documentId={sourceDocument} onClose={() => setSourceDocument(null)} />}
      <SupportPanel panel={panel} reference={experience ? experienceNames[experience] : ""} onOpen={navigate} onClose={closePanel} />
      <noscript>
        <p className={s.noScript}>
          この体験にはJavaScriptが必要です。
          <Link href="/business/profile">自己紹介はこちら</Link>
          。<a href={`mailto:${owner.email}`}>無料相談はメールでも受け付けています</a>。
        </p>
      </noscript>
    </div>
    </ChoiceDockContext.Provider>
  );
}
