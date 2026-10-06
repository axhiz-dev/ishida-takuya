"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDown, ArrowBendDownRight, ArrowLeft, CalendarBlank, Chats, BookOpen, FileText, UserCircle, Sparkle, List, X } from "@phosphor-icons/react";
import { owner } from "@/config/owner";
import { examples, service, type ExampleId } from "./content";
import ConsultationForm from "./ConsultationForm";
import s from "./renewal.module.css";

export default function BusinessRenewal() {
  const [selected, setSelected] = useState<ExampleId | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [stage, setStage] = useState<"learn" | "build" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const exampleHeading = useRef<HTMLHeadingElement>(null);
  const chosen = examples.find(example => example.id === selected);
  const scene = chosen?.scenes[sceneIndex];
  function focusExamples() {
    requestAnimationFrame(() => {
      exampleHeading.current?.focus({ preventScroll: true });
      document.getElementById("examples")?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function openExample(id: ExampleId) {
    setSelected(id); setSceneIndex(0); focusExamples();
  }
  function closeExample() { setSelected(null); setSceneIndex(0); focusExamples(); }
  function navigate() { setMenuOpen(false); }
  return <div className={s.site}>
    <a className="skip-link" href="#main">本文へ移動</a>
    <header className={s.header}>
      <a className={s.brand} href="#main" onClick={navigate}>{service.name}</a>
      <button className={s.menuToggle} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} aria-expanded={menuOpen} aria-controls="business-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <List size={24} />}</button>
      <nav id="business-navigation" className={s.navigation} data-open={menuOpen} aria-label="メインナビゲーション">
        <a href="#examples" onClick={() => { closeExample(); navigate(); }}>活用例</a>
        <a href="#support" onClick={navigate}>支援内容</a>
        <a href="#pricing" onClick={navigate}>料金</a>
        <a href="#about" onClick={navigate}>プロフィール</a>
        <a className={s.primary} href="#contact" onClick={navigate}>無料相談<ArrowRight size={20} aria-hidden="true" /></a>
      </nav>
    </header>

    <main id="main">
      <section className={s.hero} aria-labelledby="hero-title">
        <Image className={s.heroPhoto} src="/assets/business/renewal/hero.webp" alt="" fill priority sizes="100vw" />
        <div className={s.heroShade} aria-hidden="true" />
        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <p className={s.audience}>個人事業主・中小企業のための<br />AI活用支援</p>
            <h1 id="hero-title">いつもの仕事で<br />AIを使いこなす</h1>
            <p>実際の業務を題材に、AIへの頼み方から<br className={s.desktopBreak} />結果の確認まで一緒に進めます。</p>
            <p>4週間で使い方を試しながら、<br className={s.desktopBreak} />次回も使える指示と手順を作ります。</p>
            <a className={s.heroLink} href="#support">支援内容を見る<ArrowRight size={22} aria-hidden="true" /></a>
          </div>
          <div className={s.stages}>
            <p className={s.eyebrow}>STAGE SELECT</p>
            <h2>どこから始めますか</h2>
            <a href="#examples" className={s.stage} onClick={() => { setStage("learn"); closeExample(); }}>
              <span className={s.stageMeta}><span>01</span><span>LEARN</span></span>
              <h3>自分の仕事でAIを使う</h3>
              <p>何を頼めるか知りたい方へ</p>
              <ArrowUpRight className={s.stageArrow} size={28} aria-hidden="true" />
            </a>
            <ArrowDown className={s.stageDown} size={23} aria-hidden="true" />
            <a href="#examples" className={`${s.stage} ${s.buildStage}`} onClick={() => { setStage("build"); closeExample(); }}>
              <span className={s.stageMeta}><span>02</span><span>BUILD</span></span>
              <h3>繰り返す作業をAIに任せる</h3>
              <p>毎回使える指示と手順を作りたい方へ</p>
              <ArrowUpRight className={s.stageArrow} size={28} aria-hidden="true" />
            </a>
            <p className={s.goal}><ArrowBendDownRight size={24} aria-hidden="true" /><span>GOAL</span>自分で使って改善できるように</p>
          </div>
        </div>
      </section>

      <section id="examples" className={`${s.screen} ${s.examples}`} aria-labelledby="examples-title">
        {chosen && scene ? <>
          <button className={s.backLink} onClick={closeExample}><ArrowLeft size={20} aria-hidden="true" />活用例に戻る</button>
          <div className={s.sectionHead}>
            <p className={s.eyebrow}>EXAMPLE {String(examples.indexOf(chosen) + 1).padStart(2, "0")}</p>
            <h2 id="examples-title" ref={exampleHeading} tabIndex={-1}>{chosen.title}</h2>
            <p>{chosen.description}</p>
          </div>
          <div className={s.demo} data-testid={`demo-${chosen.id}`}>
            <div className={s.demoCaption}><span>会話の見本</span><span>{scene.title}</span></div>
            <div className={s.scene} key={`${chosen.id}-${sceneIndex}`}>
              {scene.messages.map((message, index) => <div key={index} className={s.message} data-speaker={message.speaker}>
                <div className={s.speaker}>{message.speaker === "you" ? <UserCircle size={30} aria-hidden="true" /> : <Sparkle size={26} aria-hidden="true" />}<span>{message.speaker === "you" ? "あなた" : "AI"}</span></div>
                <div className={s.messageBody}><p>{message.text}</p>{message.attachment && <span className={s.attachment}><FileText size={20} aria-hidden="true" />{message.attachment}</span>}</div>
              </div>)}
              {scene.result && <div className={s.result}>
                <div className={s.document}><p className={s.eyebrow}>AIが作った下書き</p><h3>{scene.result.title}</h3><ul>{scene.result.lines.map(line => <li key={line}>{line}</li>)}</ul><p className={s.finePrint}>実務では元の資料と照らし合わせて確認します。</p></div>
                <details className={s.reusable}><summary>次回も使うための指示を見る</summary><p>{scene.result.reusable}</p></details>
              </div>}
            </div>
          </div>
          <div className={s.demoControls}>
            <button className={s.backLink} disabled={sceneIndex === 0} onClick={() => setSceneIndex(sceneIndex - 1)}><ArrowLeft size={18} aria-hidden="true" />戻る</button>
            <p role="status" aria-label="会話の進行">{sceneIndex + 1} / {chosen.scenes.length}</p>
            {sceneIndex < chosen.scenes.length - 1 ? <button className={s.primary} onClick={() => setSceneIndex(sceneIndex + 1)}>{sceneIndex === 0 ? "会話の続きを見る" : "下書きを見る"}<ArrowRight size={20} aria-hidden="true" /></button> : <a className={s.primary} href="#support">支援内容を見る<ArrowRight size={20} aria-hidden="true" /></a>}
          </div>
          <p className={s.exampleNote}>架空の資料と会話による活用例です。実際のAIへの送信は行いません。</p>
        </> : <>
          <div className={s.sectionHead}>
            <p className={s.eyebrow}>{stage ? `STAGE ${stage === "learn" ? "01 / LEARN" : "02 / BUILD"}` : "EXAMPLES"}</p>
            <h2 id="examples-title" ref={exampleHeading} tabIndex={-1}>こんな仕事に使えます</h2>
            <p>{stage === "build" ? "必要な条件を伝え、確認するルールを決める。毎回使える指示の作り方を会話例でご覧ください。" : "気になる例からAIとのやり取りをご覧ください。"}</p>
          </div>
          <div className={s.exampleList}>{examples.map((example, index) => <button key={example.id} className={s.exampleRow} onClick={() => openExample(example.id)}>
            <span className={s.exampleNumber}>{String(index + 1).padStart(2, "0")}</span>
            <span className={s.exampleText}><span className={s.exampleTitle}>{example.title}</span><span>{example.description}</span></span>
            <span className={s.exampleAction}><span className={s.roundArrow}><ArrowRight size={24} aria-hidden="true" /></span><span>会話を見る</span></span>
          </button>)}</div>
          <p className={s.exampleNote}>活用イメージとして作成した会話例です。</p>
          <a className={s.textLink} href="#support">支援内容を見る<ArrowRight size={20} aria-hidden="true" /></a>
        </>}
      </section>

      <section id="support" className={`${s.screen} ${s.support}`} aria-labelledby="support-title">
        <div className={s.sectionHead}><p className={s.eyebrow}>SUPPORT</p><h2 id="support-title">ひとつの仕事を<br />自分で進められるように</h2><p>普段の資料を使い、AIへの指示を作って実務で試します。<br className={s.desktopBreak} />結果を確認し、必要に応じて指示を直すところまで支援します。</p></div>
        <ol className={s.supportSteps}>
          <li><span>01</span><h3>仕事を整理する</h3><p>初回60分。今の手順と期待する仕上がりを確認し、4週間で取り組む範囲を決めます。</p></li>
          <li><span>02</span><h3>AIで試して直す</h3><p>実際に使って質問や修正をSlackで相談。中間の30分で、使いづらい点を確認します。</p></li>
          <li><span>03</span><h3>次回の手順をまとめる</h3><p>最終30分。AIへの指示、結果の確認ルール、使い方をまとめ、ご本人が使えるか確かめます。</p></li>
        </ol>
        <p className={s.supportNote}>LEARNとBUILDは始め方の違いです。どちらも同じ4週間のプランで支援します。</p>
        <a className={s.primary} href="#pricing">料金と無料相談へ<ArrowRight size={20} aria-hidden="true" /></a>
      </section>

      <section id="pricing" className={`${s.screen} ${s.pricing}`} aria-labelledby="pricing-title">
        <div className={s.offer}>
          <p className={s.eyebrow}>PLAN & CONSULTATION</p>
          <h2 id="pricing-title">4週間の<br className={s.mobileBreak} />マンツーマン支援</h2>
          <p className={s.price}>{service.price}<span>（税込）</span></p>
          <ul className={s.includes}>
            <li><CalendarBlank size={25} aria-hidden="true" />打ち合わせ3回 <span>60分・30分・30分</span></li>
            <li><Chats size={25} aria-hidden="true" />Slack中心・メールにも対応</li>
            <li><CalendarBlank size={25} aria-hidden="true" />チャットへの回答は週2回</li>
            <li><BookOpen size={25} aria-hidden="true" />AIへの指示・確認ルール・使い方の手順</li>
          </ul>
          <p className={s.planNote}>1名・1業務／自動更新なし<br />AI利用料・開発・外部連携は別途</p>
          <details className={s.terms}><summary>詳しい支援内容を見る</summary><div>
            <p>対象は、ひとりで繰り返し行うひとつの仕事です。全社への導入、大人数の研修、日々の作業代行は含みません。</p>
            <p>対象業務についての質問と指示の修正を受け付け、{service.chatDays}にまとめて回答します。別業務の追加や開発は別途相談です。</p>
            <p>AIのアカウント、対象業務の資料、期待する仕上がりの見本をご準備ください。必要な有料ツールは申し込み前にご説明します。</p>
            <p>料金は開始前に一括でお支払いいただきます。支払方法、日程変更、キャンセル時の精算条件は申し込み前にご案内します。</p>
            <p>個人情報・機密情報を伏せた見本を基本とし、共有された業務資料は支援終了後30日以内に削除します。</p>
          </div></details>
          <ol className={s.flow}><li><span>1</span>お問い合わせ</li><li><span>2</span>無料相談</li><li><span>3</span>お申し込み</li><li><span>4</span>支援スタート</li></ol>
          <p className={s.finePrint}>無料相談では支援できる範囲を確認します。詳しい業務整理と指示づくりは申し込み後に進めます。</p>
        </div>
        <div id="contact" className={s.contact}><ConsultationForm /></div>
      </section>

      <section id="about" className={s.about} aria-labelledby="about-title"><div><p className={s.eyebrow}>YOUR SUPPORTER</p><h2 id="about-title">支援する人</h2></div><div><h3>石田 卓也<span>ソフトウェアエンジニア</span></h3><p>普段の業務で使う資料と手順を整理し、AIへの指示を一緒に作ります。ご本人が結果を確認し、使いながら改善できるように支援します。</p><Link className={s.textLink} href="/business/profile">プロフィールを見る<ArrowRight size={20} aria-hidden="true" /></Link></div></section>
    </main>
    <footer className={s.footer}>
      <a className={s.brand} href="#main">{service.name}</a>
      <nav aria-label="このサイトについて"><Link href="/business/legal">特定商取引法に基づく表記</Link><Link href="/business/privacy">プライバシーポリシー</Link><a href={`mailto:${owner.email}`}>メールで相談</a></nav>
      <p>© 石田 卓也</p>
    </footer>
  </div>;
}
