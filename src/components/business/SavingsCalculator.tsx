"use client";

import { useId, useState } from "react";
import { priceTiers, savingsConfig } from "@/content";
import styles from "./business.module.css";

const yen = new Intl.NumberFormat("ja-JP");

/** 万円で丸めて読ませる。円単位の桁は、この相手には邪魔になる。 */
function man(value: number): string {
  return `${Math.round(value / 10000)} 万円`;
}

/**
 * 削減額の試算。
 *
 * 買い切りなので「初期費用を何か月で回収するか」が出せる。
 * 月額制だと費用が毎月引かれ続けるので、この絵は描けない。
 *
 * 数字が独り歩きしないよう、但し書きは結果と同じ視野に必ず入れる。
 */
export function SavingsCalculator() {
  const id = useId();
  const [hours, setHours] = useState(savingsConfig.hoursPerWeek.initial);
  const [wage, setWage] = useState(savingsConfig.hourlyWage.initial);
  const [tierId, setTierId] = useState(savingsConfig.tierIds[0]!);

  const tiers = priceTiers.filter((tier) => savingsConfig.tierIds.includes(tier.id));
  const tier = tiers.find((candidate) => candidate.id === tierId) ?? tiers[0]!;
  const cost = tier.amountYen ?? 0;

  const hoursPerYear = hours * 52;
  const savedPerYear = hoursPerYear * wage;
  const savedPerMonth = savedPerYear / 12;
  const months = savedPerMonth > 0 ? cost / savedPerMonth : 0;

  return (
    <div className={styles.calc}>
      <div className={styles.calcInputs}>
        <p className={styles.calcField}>
          <label htmlFor={`${id}-hours`}>週の作業時間</label>
          <output htmlFor={`${id}-hours`} className={styles.calcValue}>
            {hours} 時間
          </output>
          <input
            id={`${id}-hours`}
            type="range"
            min={savingsConfig.hoursPerWeek.min}
            max={savingsConfig.hoursPerWeek.max}
            step={savingsConfig.hoursPerWeek.step}
            value={hours}
            onChange={(event) => setHours(Number(event.target.value))}
          />
        </p>

        <p className={styles.calcField}>
          <label htmlFor={`${id}-wage`}>担当者の時給</label>
          <output htmlFor={`${id}-wage`} className={styles.calcValue}>
            {yen.format(wage)} 円
          </output>
          <input
            id={`${id}-wage`}
            type="range"
            min={savingsConfig.hourlyWage.min}
            max={savingsConfig.hourlyWage.max}
            step={savingsConfig.hourlyWage.step}
            value={wage}
            onChange={(event) => setWage(Number(event.target.value))}
          />
        </p>

        <fieldset className={styles.calcTiers}>
          <legend>依頼する範囲</legend>
          {tiers.map((candidate) => (
            <label key={candidate.id} className={styles.calcTier}>
              <input
                type="radio"
                name={`${id}-tier`}
                value={candidate.id}
                checked={candidate.id === tier.id}
                onChange={() => setTierId(candidate.id)}
              />
              <span>{candidate.label}</span>
              <span className={styles.calcTierAmount}>{candidate.amount}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <dl className={styles.calcResult}>
        <div>
          <dt>年間の削減時間</dt>
          <dd>{yen.format(hoursPerYear)} 時間</dd>
        </div>
        <div>
          <dt>年間の人件費削減</dt>
          <dd>{man(savedPerYear)}</dd>
        </div>
        <div>
          <dt>費用（買い切り・1 回）</dt>
          <dd>{man(cost)}</dd>
        </div>
        <div className={styles.calcHighlight}>
          <dt>回収まで</dt>
          <dd>{months < 0.1 ? "1 か月未満" : `${months.toFixed(1)} か月`}</dd>
        </div>
        <div>
          <dt>2 年目以降にかかる費用</dt>
          <dd>0 円（保守を付けない場合）</dd>
        </div>
      </dl>

      <p className={styles.calcNote}>{savingsConfig.disclaimer}</p>
    </div>
  );
}
