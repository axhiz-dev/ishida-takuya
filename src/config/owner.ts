/**
 * 事業者の情報。特商法の表記・プライバシーポリシー・請求書 PDF が
 * すべてここを見る。**書き換えるのはこのファイルだけでよい。**
 *
 * まだ決まっていない項目は PLACEHOLDER のままにしておく。
 * 画面には「未入力」と出るので、埋め忘れたまま公開しても気づける。
 * さらに E2E が、ダミー表示を切った状態で PLACEHOLDER が残っていたら落とす。
 */

/** 未入力の目印。表示のためではなく、検出のために置いている。 */
export const PLACEHOLDER = "__PLACEHOLDER__";

export const isPlaceholder = (value: string): boolean => value === PLACEHOLDER;

export const owner = {
  name: "石田 卓也",
  /** 特商法でいう「運営統括責任者」。個人事業なので本人。 */
  manager: "石田 卓也",

  /* ── ここから下は本人が埋める ───────────────── */

  /** 番地まで。特商法の表記に出る。 */
  address: PLACEHOLDER,
  phone: PLACEHOLDER,
  email: "axhiz.ozi@gmail.com",

  /** 適格請求書発行事業者の登録番号（T + 13 桁）。請求書 PDF に出る。 */
  invoiceRegistration: PLACEHOLDER,

  /* ── 決まっているもの ───────────────────────── */

  businessHours: "平日 9:00〜18:00",
  /** 対応地域。訪問できる範囲があれば書く。 */
  area: PLACEHOLDER,
  /** 問い合わせへの返信の目安。 */
  responseTime: "1 営業日以内",
} as const;
