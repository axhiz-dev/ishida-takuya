import { test, expect } from "@playwright/test";
import { mkdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

/**
 * デモは実績の代わりに置いている証拠なので、壊れると
 * このページの一番大事な部分が黙って死ぬ。ここで押さえておく。
 *
 * 隠れているタブパネルはアクセシビリティツリーに載らないので、
 * getByRole("tabpanel") は常に「表示中の 1 枚」だけを指す。
 */
const panel = (page: import("@playwright/test").Page) => page.getByRole("tabpanel");

test.beforeEach(async ({ page }) => {
  await page.goto("/business/");
});

test("集計デモ：サンプルを読み、グラフを切り替えられる", async ({ page }) => {
  await page.getByRole("button", { name: "試すファイルがない方はこちら" }).click();
  await expect(page.getByText("サンプル 3 拠点から 6 行を読みました。")).toBeVisible();

  for (const kind of ["縦棒", "横棒", "構成比"]) {
    await page.getByRole("button", { name: kind, exact: true }).click();
    await expect(page.getByRole("button", { name: kind, exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(panel(page).locator("svg")).toBeVisible();
  }

  // 拠点別を折れ線にすると、拠点のあいだに中間の値があるように見える。
  // 日付の列でまとめたときだけ押せること。
  await expect(page.getByRole("button", { name: "折れ線", exact: true })).toBeDisabled();
});

test("デモ：タブを行き来しても入力が消えない", async ({ page }) => {
  await page.getByRole("button", { name: "試すファイルがない方はこちら" }).click();
  await expect(page.getByText(/6 行を読みました/)).toBeVisible();

  await page.getByRole("tab", { name: /請求書/ }).click();
  await page.getByRole("tab", { name: /エクセル/ }).click();
  await expect(page.getByText(/6 行を読みました/)).toBeVisible();
});

test("請求書デモ：プリセット・行削除・支払期日", async ({ page }) => {
  await page.getByRole("tab", { name: /請求書/ }).click();

  await page.getByRole("button", { name: "毎月の保守" }).click();
  await expect(panel(page).getByLabel("1 行目の品目")).toHaveValue("システム保守（月額）");

  await page.getByRole("button", { name: "制作物の納品" }).click();
  await expect(panel(page).getByLabel("2 行目の品目")).toHaveValue("操作マニュアル作成");

  await panel(page).getByRole("button", { name: /2 行目「操作マニュアル作成」を削除/ }).click();
  await expect(panel(page).getByLabel("2 行目の品目")).toHaveValue("導入時の説明会");

  // 1 行だけになったら消せない（空の請求書を作らせない）
  await panel(page).getByRole("button", { name: /2 行目.*削除/ }).click();
  await expect(panel(page).getByRole("button", { name: /1 行目.*削除/ })).toBeDisabled();

  // 支払サイトから期日が引ける
  await page.getByRole("button", { name: "翌々月末", exact: true }).click();
  const due = await panel(page).getByLabel("支払期日").inputValue();
  const issued = await panel(page).getByLabel("請求日").inputValue();
  expect(new Date(due).getTime()).toBeGreaterThan(new Date(issued).getTime());
});

test("ページ内リンクの着地点が固定ナビの下に隠れない", async ({ page }) => {
  await page.getByRole("link", { name: "料金" }).click();
  await page.waitForTimeout(700);

  const heading = page.getByRole("heading", { name: "料金", level: 2 });
  const box = await heading.boundingBox();
  const nav = await page.locator("header").boundingBox();
  expect(box).not.toBeNull();
  expect(nav).not.toBeNull();
  // 見出しの上端がナビの下端より下にあること
  expect(box!.y).toBeGreaterThan(nav!.y + nav!.height);
});

test("請求書デモ：10 件まとめて作ると、開ける ZIP が落ちてくる", async ({ page }) => {
  await page.getByRole("tab", { name: /請求書/ }).click();
  await page.getByRole("button", { name: /10 件まとめてつくる/ }).click();

  await expect(panel(page).getByLabel("1 件目の請求先")).toHaveValue("株式会社サンプル商会");
  await expect(panel(page).getByLabel("10 件目の請求先")).toHaveValue("株式会社サンプル薬品");

  const wait = page.waitForEvent("download");
  await page.getByRole("button", { name: /10 件まとめて作る/ }).click();
  const download = await wait;

  // ロケールが POSIX の環境では、Chromium が和文のファイル名を落として
  // "download" にしてしまう（LANG=C.UTF-8 を与えると和名のまま出る）。
  // 環境しだいの部分なので、ここは名前ではなく中身を確かめる。
  expect(download.suggestedFilename()).toMatch(/^(請求書_\d{6}\.zip|download)$/);

  mkdirSync("screenshots", { recursive: true });
  const zip = "screenshots/invoices.zip";
  await download.saveAs(zip);

  /* ZIP を自前で書いているので、検証も自前のコードでやったら意味がない。
     まったく別の実装（Python の zipfile）に読ませて確かめる。
     unzip -l の出力を見るのはやめた。和文のファイル名を実行環境の
     ロケールしだいでエスケープして出すので、CI で落ちる。
     zipfile は UTF-8 のフラグを見るのでロケールに左右されない。 */
  const probe = [
    "import sys, json, zipfile",
    "z = zipfile.ZipFile(sys.argv[1])",
    "assert z.testzip() is None, 'CRC が合わない'", // 全件を展開して CRC を検査する
    "print(json.dumps({'names': z.namelist(), 'heads': [z.read(n)[:8].decode('latin1') for n in z.namelist()]}))",
  ].join("\n");

  const found = JSON.parse(
    execFileSync("python3", ["-c", probe, zip], { encoding: "utf-8" }),
  ) as { names: string[]; heads: string[] };

  expect(found.names).toHaveLength(10);
  expect(found.names[0]).toMatch(/^請求書_\d{6}-001_株式会社サンプル商会\.pdf$/);
  expect(found.names[9]).toMatch(/^請求書_\d{6}-010_株式会社サンプル薬品\.pdf$/);
  // 中身が本当に PDF であること（空ファイルを 10 個入れても ZIP は通るため）
  for (const head of found.heads) expect(head).toContain("%PDF");

  // jsPDF は PNG を生ピクセルに戻すので、compress を外すと 1 枚 12MB になる。
  // 気づかないまま 120MB の ZIP を配ることになるので、大きさで見張る。
  expect(statSync(zip).size).toBeLessThan(5 * 1024 * 1024);
});
