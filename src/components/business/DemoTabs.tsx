"use client";

import { Children, useId, useRef, useState, type ReactNode } from "react";
import styles from "./business.module.css";

/**
 * デモの切り替えタブ。
 *
 * パネルは閉じても **アンマウントしない**（hidden で隠すだけ）。
 * 集計の途中まで進めてから請求書を見て戻ってきたときに、
 * 読み込んだファイルが消えていると触る気が失せるため。
 *
 * キーボードは WAI-ARIA の tabs パターンに合わせてある。
 * 左右で移動、Home/End で端。フォーカスの移動と選択は連動させる
 * （パネルの中身が重くないので、手動アクティベートにする理由がない）。
 */
export function DemoTabs({
  tabs,
  children,
}: {
  tabs: { id: string; title: string }[];
  children: ReactNode;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = Children.toArray(children);

  const move = (to: number) => {
    const next = (to + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const to = keys[event.key];
    if (to === undefined) return;
    event.preventDefault();
    move(to);
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" aria-label="デモの切り替え">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.id}`}
            aria-controls={`${id}-panel-${tab.id}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-panel-${tab.id}`}
          aria-labelledby={`${id}-tab-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
          className={styles.tabPanel}
        >
          {panels[index]}
        </div>
      ))}
    </div>
  );
}
