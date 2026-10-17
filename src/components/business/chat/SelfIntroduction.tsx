import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { BASE_PATH } from "@/config/site";
import s from "./support.module.css";

/** Reuse the owner's photo; never substitute a reference person's portrait. */
export function PersonAvatar({ compact = false }: { compact?: boolean }) {
  const className = compact ? `${s.avatar} ${s.avatarCompact}` : s.avatar;
  return profile.photo
    ? <Image className={className} src={`${BASE_PATH}${profile.photo}`} alt="石田卓也の顔写真" width={96} height={96} />
    : <span className={className} aria-label="顔写真は準備中です"><span aria-hidden="true">石田</span></span>;
}
export function PersonIdentity() {
  return <div className={s.person}><PersonAvatar /><p className={s.personName}>石田 卓也</p></div>;
}
export default function SelfIntroduction() {
  return <article className={s.letter}>
    <header className={s.letterCover}>
      <h2 className={s.letterTitle}><span>大切にしたいことに、</span><span>もっと時間を使ってほしい。</span></h2>
    </header>
    <PersonIdentity />
    <div className={s.letterGroup}><p>みなさま、こんにちは。</p><p>石田と申します。<br />普段はエンジニアとして、人事向けのWebサービスを開発しています。</p></div>
    <div className={s.letterGroup}><p>ここではなぜこの支援を始めたのかを少しお話しさせてください。</p><p>私が何を大切にしているかを知ってもらうほうがお互いにとってよい仕事ができると思うからです。</p></div>
    <div className={s.letterGroup}><p>これまで、ピアニストや美容師、飲食店やライブハウスを営む方など、自分の好きなこと・強みを仕事にしている方々に出会ってきました。</p></div>
    <div className={s.letterGroup}><p>「これを成し遂げたい」「自分の得意で勝負したい」</p><p>そんな思いを持つ一方で、その強みとは直接関係のない仕事にも多くの時間を取られていると感じました。</p></div>
    <div className={s.letterGroup}><p>例えば、</p><ul><li>営業先を調べて、一件ずつメールを書く</li><li>スタッフのシフト希望を集めて、返事がない人に連絡する</li><li>毎月の売上や入金を確認する</li></ul></div>
    <div className={s.letterGroup}><p>どれも事業を続けるために必要ですが、きちんと組み立てればAIに任せたり、手間を減らせたりする仕事です。</p></div>
    <div className={s.letterGroup}><p>その時間を自分が大切にしたいことに投下すれば、より良いものを作ったり、表現したりすることに注力できるのです。というか、してほしいのです。</p></div>
    <div className={s.letterGroup}><p>もちろん</p><ul><li>残業を減らして家族と過ごしたり</li><li>自分の時間をもっと増やして趣味を楽しんだり</li><li>ステップアップのための勉強をしたり</li></ul><p>することもとても大事です。</p></div>
    <div className={s.letterGroup}><p>大きな目標を叶えるためでも、毎日の仕事をもう少し楽にしたいという気持ちでも、大切な時間が増えることには変わりありません。</p></div>
    <div className={s.letterGroup}><p>私が持ってる知識や経験で、そういった方たちの役に立つことができたらきっと楽しいだろうなと思い、この支援サービスを立ち上げました。</p></div>
    <div className={s.letterGroup}><p>新卒ではPCメーカーで営業をしていました。</p><p>専門的な話を、相手の仕事や立場に置き換えて、分かりやすく伝えるのは得意です。</p></div>
    <div className={s.letterGroup}><p>現在は数万人規模の大企業でも使われているWebサービスを開発し、普段の仕事でもAIを活用しています。</p><p>「AIで作れたけれど、仕事で使って大丈夫か分からない」というときにも、技術面から判断をお手伝いできます。</p></div>
    <div className={s.letterGroup}><p>「AIに何を頼めるのか分からない」という段階でも大丈夫です。</p><p>普段どんな仕事をしていて、何に時間を取られているのか。</p><p>そこから、任せられることを一緒に考えましょう。</p></div>
    <div className={s.letterGroup}><p>ぜひ、無料相談でお話を聞かせてください。<br />お待ちしております。</p></div>
    <p className={s.signature}>石田</p>
    <Link className={s.textLink} href="/engineer" target="_blank" rel="noopener noreferrer">詳しい経歴を見る（別タブ）</Link>
  </article>;
}
