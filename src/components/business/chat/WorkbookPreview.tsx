"use client";

import { useEffect, useRef, useState } from "react";
import { FileXls, X } from "@phosphor-icons/react";
import { BASE_PATH } from "@/config/site";
import s from "./chat.module.css";

type SampleSheet = {
  name: string;
  headers: string[];
  rows: (string | number)[][];
};

export default function WorkbookPreview({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [sheets, setSheets] = useState<SampleSheet[]>([]);
  const [active, setActive] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const controller = new AbortController();
    dialog.current?.showModal();
    // The preview JSON is extracted from the attached workbook's source cells.
    fetch(`${BASE_PATH}/samples/monthly-accounting.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Preview unavailable");
        return response.json();
      })
      .then((data: { sheets: SampleSheet[] }) => setSheets(data.sheets))
      .catch((error) => { if (error.name !== "AbortError") setError(true); });
    return () => { controller.abort(); previousFocus?.focus(); };
  }, []);

  const sheet = sheets[active];
  return (
    <dialog
      ref={dialog}
      className={s.workbookPreview}
      aria-labelledby="workbook-preview-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
    >
      <div className={s.previewSurface}>
        <header className={s.previewHeader}>
          <FileXls size={28} aria-hidden="true" />
          <div>
            <h2 id="workbook-preview-title">月末集計サンプル.xlsx</h2>
            <p>Excelプレビュー · 架空のサンプルデータ</p>
          </div>
          <button aria-label="プレビューを閉じる" onClick={() => dialog.current?.close()}><X size={22} /></button>
        </header>
        {error ? <p role="alert">プレビューを読み込めませんでした。閉じて、もう一度お試しください。</p>
          : !sheet ? <p role="status">プレビューを読み込んでいます…</p>
          : <>
            <div className={s.previewTable}>
              <table aria-label={`${sheet.name}のプレビュー`}>
                <thead><tr><th aria-label="行番号" />{sheet.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
                <tbody>{sheet.rows.map((row, index) => <tr key={index}>
                  <th scope="row">{index + 2}</th>
                  {row.map((value, column) => <td key={column} className={typeof value === "number" ? s.numericCell : undefined}>
                    {typeof value === "number" ? value.toLocaleString("ja-JP") : value}
                  </td>)}
                </tr>)}</tbody>
              </table>
            </div>
            <div className={s.sheetTabs} aria-label="シートを選ぶ">
              {sheets.map((item, index) => <button key={item.name} aria-pressed={active === index} onClick={() => setActive(index)}>{item.name}</button>)}
            </div>
          </>}
      </div>
    </dialog>
  );
}
