import data from "./estimateData.json";
import g from "./growth.module.css";
export default function EstimateHistory() {
  return <>
    <p>過去に対応した内容と見積金額の一覧です。金額は税別で、各行は別々の対応を表しています。</p>
    <div className={g.estimateScroll} role="region" aria-label="過去の見積一覧" tabIndex={0}>
      <table className={g.estimateTable}>
        <thead><tr><th scope="col">管理番号・年月</th><th scope="col">対応内容</th><th scope="col">数量</th><th scope="col">金額（税別）</th><th scope="col">含む作業・条件</th></tr></thead>
        <tbody>{data.history.map(row => <tr key={row.id}><th scope="row">{row.id}<small>{row.date}</small></th><td>{row.work}</td><td>{row.quantity}</td><td>{row.amount.toLocaleString("ja-JP")}円</td><td>{row.scope}<small>{row.condition}</small></td></tr>)}</tbody>
      </table>
    </div>
    <p>今回の概算は、E-01・E-03・E-06と同じ範囲で対応できると仮定して算出しています。条件が変わる場合は再見積もりになります。</p>
  </>;
}
