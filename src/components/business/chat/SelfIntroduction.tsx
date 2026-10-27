import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { BASE_PATH } from "@/config/site";
import s from "./support.module.css";

/** Reuse the owner's photo; never substitute a reference person's portrait. */
export function PersonAvatar({ compact = false }: { compact?: boolean }) {
  const className = compact ? `${s.avatar} ${s.avatarCompact}` : s.avatar;
  return <Image className={className} src={`${BASE_PATH}${profile.photo ?? "/images/business/ishida-avatar.webp"}`} alt="石田卓也の顔写真" width={96} height={96} />;
}
export function PersonIdentity() {
  return <div className={s.person}><PersonAvatar /><p className={s.personName}>石田 卓也</p></div>;
}
export default function SelfIntroduction() {
  return <article className={s.letter}>
    <header className={s.letterCover}>
      <h2 className={s.letterTitle}>大切にしたいことに、もっと時間を使ってほしい。</h2>
      <picture>
        <source media="(max-width: 480px)" srcSet={`${BASE_PATH}/images/business/ishida-profile-banner-mobile.webp`} width={1024} height={1024} />
        {/* The lettering belongs to the selected banner artwork. */}
        <img className={s.letterBanner} src={`${BASE_PATH}/images/business/ishida-profile-banner.webp`} width={1774} height={887} alt="石田 卓也 — エンジニア / AI導入の伴走支援" />
      </picture>
    </header>
    <div className={s.letterGroup}><p>みなさまこんにちは。<br />石田と申します。<br />普段はエンジニアとして人事向けのWebサービスを開発しています。</p></div>
    <div className={s.letterGroup}><p>ここではなぜこの支援を始めたのかを少しお話しさせてください。</p></div>
    <div className={s.letterGroup}><p>私が何を大切にしているかを知ってもらうほうがお互いにとってよい仕事ができると思うからです。</p></div>
    <div className={s.letterGroup}><p>これまで、<br />ピアニスト/美容師/飲食店/ライブハウスを営む方など、「自分の得意で勝負したい」という方たちとお話させていただく機会がありました。</p></div>
    <div className={s.letterGroup}><p>お話していると、<br />そんな思いを持つ一方で、<br />その強みとは直接関係のない仕事にも多くの時間を取られていると感じました。</p></div>
    <div className={s.letterGroup}><p>例えば以下のような作業です。</p><ul><li>営業先を調べて、一件ずつメールを書く</li><li>毎月の売上や入金を確認する</li><li>スタッフのシフト希望を集めて、返事がない人に連絡する</li></ul></div>
    <div className={s.letterGroup}><p>私はそれがすごくもどかしく感じました。</p></div>
    <div className={s.letterGroup}><p>どれも事業を続けるために必要ですが、<br />きちんと組み立てればAIに任せたり、<br />手間を減らせたりする仕事なのです。</p></div>
    <div className={s.letterGroup}><p>彼らには顧客に提供する価値をより良いものにすることに時間を使ってほしい。<br />余計な仕事は自動化していってもらいたいと思ったのです。</p></div>
    <div className={s.letterGroup}><p>私が持ってる知識や経験で、<br />そういった方たちの役に立つことができたらきっと楽しいだろうなと思い、<br />この支援サービスを立ち上げました。</p></div>
    <div className={s.letterGroup}><p>もちろん</p><ul><li>残業を減らして家族と過ごしたい</li><li>自分の時間をもっと増やして趣味を楽しみたい</li><li>ステップアップのための勉強をしたい</li></ul><p>という方も大歓迎です。</p></div>
    <div className={s.letterGroup}><p>大きな目標を叶えるためでも、<br />毎日の仕事をもう少し楽にしたいという気持ちでも、<br />大切な時間を増やしてより良い人生にしていくためのお手伝いができたら嬉しく思います。</p></div>
    <hr className={s.letterDivider} />
    <div className={s.letterGroup}><p>新卒ではPCメーカーで営業をしていました。<br />専門的な話を相手の仕事や立場に置き換えて、<br />分かりやすく伝えるのは得意です。</p></div>
    <div className={s.letterGroup}><p>現在は数万人規模の大企業でも使われているWebサービスを開発し、<br />普段の仕事でもAIをフル活用していますので、<br />自動化の勘所もお伝えできるかと思います。</p></div>
    <div className={s.letterGroup}><p>「AIで作れたけれど、仕事で使って大丈夫か分からない」というときにも、技術面から判断をお手伝いできます。</p></div>
    <div className={s.letterGroup}><p>「AIに何を頼めるのか分からない」という段階でも大丈夫です。<br />普段どんな仕事をしていて、何に時間を取られているのか。<br />任せられることを一緒に考えましょう。</p></div>
    <div className={s.letterGroup}><p>ぜひ無料相談でお話を聞かせてください。<br />お待ちしております</p></div>
    <p className={s.signature}>石田</p>
    <Link className={s.textLink} href="/engineer" target="_blank" rel="noopener noreferrer">詳しい経歴を見る（別タブ）</Link>
  </article>;
}
